/**
 * Kekius Token Risk Scanner
 *
 * This script handles the front-end logic for the token scanner widget.
 * It captures user input, validates it, calls the API, and displays the results.
 */

// --- Configuration ---
// For a production app, consider using a separate config file or environment variables.
const config = {
    apiBase: "https://your-api-endpoint.com/api/v1" // IMPORTANT: Replace with your actual API endpoint
};

// --- DOM Element References ---
// Caching elements improves performance by avoiding repeated DOM queries.
const addressInput = document.getElementById('tokenAddressInput');
const scanButton = document.getElementById('scanButton');
const resultsDiv = document.getElementById('results');

// --- Event Listeners ---
scanButton.addEventListener('click', handleScan);
// Allow pressing Enter in the input field to trigger a scan
addressInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleScan();
    }
});

/**
 * Main handler for the scan button click and Enter key press.
 */
async function handleScan() {
    const tokenAddress = addressInput.value.trim();

    // 1. Client-side input validation
    if (!isValidEthereumAddress(tokenAddress)) {
        displayState({ error: "Please enter a valid Ethereum address (starts with 0x)." });
        return;
    }

    // 2. Set UI to loading state and disable button to prevent multiple clicks
    displayState({ loading: true });
    scanButton.disabled = true;

    try {
        // 3. Asynchronously fetch data from the API
        const riskData = await fetchRiskScore(tokenAddress);
        displayState({ data: riskData });
    } catch (error) {
        // 4. Gracefully handle errors from the fetch operation
        console.error("API Request Failed:", error);
        displayState({ error: error.message || "Could not retrieve risk score. The API may be down." });
    } finally {
        // 5. Re-enable the button regardless of success or failure
        scanButton.disabled = false;
    }
}

/**
 * Fetches the risk score from the configured API endpoint.
 * @param {string} address - The valid Ethereum token address.
 * @returns {Promise<object>} A promise that resolves to the JSON data from the API.
 */
async function fetchRiskScore(address) {
    const response = await fetch(`${config.apiBase}/scan/${address}`);

    if (!response.ok) {
        // Handle HTTP errors like 404 (Not Found) or 500 (Server Error)
        const errorBody = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorBody || response.statusText}`);
    }

    return response.json();
}

/**
 * Updates the UI to reflect the current state (loading, error, or success).
 * @param {object} state - The state object.
 * @param {boolean} [state.loading] - If true, show a loading message.
 * @param {string} [state.error] - If present, display an error message.
 * @param {object} [state.data] - If present, display the success data.
 */
function displayState({ loading, error, data }) {
    resultsDiv.innerHTML = '';
    resultsDiv.className = 'results-container'; // Reset classes

    if (loading) {
        resultsDiv.classList.add('loading');
        resultsDiv.textContent = 'Scanning...';
    } else if (error) {
        resultsDiv.classList.add('error');
        resultsDiv.textContent = error;
    } else if (data) {
        resultsDiv.classList.add('success');
        // Security: Use textContent to prevent Cross-Site Scripting (XSS)
        // This assumes the API returns an object like { score: 85, details: "..." }
        resultsDiv.innerHTML = `
            <p><strong>Risk Score:</strong> ${data.score || 'N/A'}</p>
            <p><strong>Details:</strong> ${data.details || 'No details provided.'}</p>
        `;
    }
}

/**
 * Performs a basic validation of an Ethereum address format.
 * @param {string} address - The string to validate.
 * @returns {boolean} - True if the address matches the expected format.
 */
function isValidEthereumAddress(address) {
    // Checks for '0x' prefix followed by 40 hexadecimal characters.
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}