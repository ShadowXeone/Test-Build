document.getElementById('scanButton').addEventListener('click', function () {
    const address = document.getElementById('tokenAddressInput').value.trim();
    scanToken(address);
});

function scanToken(address) {
    const resultContainer = document.querySelector('.results-container');
    resultContainer.className = 'results-container loading';
    resultContainer.textContent = 'Scanning...';

    setTimeout(() => {
        // 1. Check for known malicious pattern
        if (address.toLowerCase().startsWith('0x0000000000000000000000')) {
            resultContainer.className = 'results-container error';
            resultContainer.textContent = 'Scam token detected: Address starts with a known malicious pattern.';
            return;
        }

        // 2. Validate address format
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            resultContainer.className = 'results-container error';
            resultContainer.textContent = 'Invalid address format.';
            return;
        }

        // 3. (Optional) Placeholder for API-based scam check
        // Uncomment and implement if you want to use an external API
        /*
        fetch(`https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=${address}`)
            .then(res => res.json())
            .then(data => {
                if (data.result && data.result[address]) {
                    if (data.result[address].is_honeypot === "1") {
                        resultContainer.className = 'results-container error';
                        resultContainer.textContent = 'Scam/Honeypot detected by API!';
                    } else {
                        resultContainer.className = 'results-container success';
                        resultContainer.textContent = 'No scam detected by API.';
                    }
                } else {
                    resultContainer.className = 'results-container error';
                    resultContainer.textContent = 'API scan failed or no data.';
                }
            })
            .catch(() => {
                resultContainer.className = 'results-container error';
                resultContainer.textContent = 'Error contacting scam detection API.';
            });
        return;
        */

        // 4. If all checks pass
        resultContainer.className = 'results-container success';
        resultContainer.textContent = 'No scam detected in basic checks.';
    }, 800);
}