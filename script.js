document.addEventListener('DOMContentLoaded', function() {
    // Select elements that ACTUALLY exist in your new HTML
    const pairingCodeElement = document.getElementById('pairing-code');
    const loadingElement = document.getElementById('loading');
    const statusMessage = document.getElementById('status-message');
    const refreshBtn = document.getElementById('refresh-btn');
    const verifyBtn = document.getElementById('verify-btn');
    const codeInput = document.getElementById('code-input');
    const pairingInputContainer = document.getElementById('pairing-input');
    const pairingDisplayContainer = document.getElementById('pairing-code-display');

    let pairingTimeout = null;

    // UI Helpers
    function showLoading() {
        pairingDisplayContainer.classList.add('hidden');
        loadingElement.classList.remove('hidden');
        statusMessage.classList.add('hidden');
        refreshBtn.disabled = true;
    }

    function hideLoading() {
        loadingElement.classList.add('hidden');
        pairingDisplayContainer.classList.remove('hidden');
        refreshBtn.disabled = false;
    }

    function showStatus(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.className = `status ${type}`;
        statusMessage.classList.remove('hidden');
    }

    // Generate a Random 6-Digit Code (Mocking Backend)
    function generatePairingCode() {
        showLoading();

        // Simulate API delay
        setTimeout(() => {
            // Generate random 6 numbers
            const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Update the display
            pairingCodeElement.textContent = mockCode.substring(0, 3) + '-' + mockCode.substring(3, 6); // Format as 123-456
            
            hideLoading();
            showStatus('Code generated. Enter this code in WhatsApp.', 'info');
            
            // Show the input field if you want the user to "verify" something
            // Or hide it if the flow is just displaying the code
            pairingInputContainer.classList.remove('hidden');
            
            startPairingSimulation();

        }, 1500); 
    }

    // Simulate the pairing process (waiting for the user to link)
    function startPairingSimulation() {
        if (pairingTimeout) clearTimeout(pairingTimeout);

        // Simulate a successful connection after 15 seconds
        pairingTimeout = setTimeout(() => {
            showStatus('Device successfully linked!', 'success');
            pairingInputContainer.classList.add('hidden'); // Hide input on success
        }, 15000);
    }

    // Handle Manual Verification (Mocking the "Verify Code" button)
    verifyBtn.addEventListener('click', function() {
        const enteredCode = codeInput.value;
        if (enteredCode.length === 6) {
            showStatus('Verifying code...', 'info');
            setTimeout(() => {
                showStatus('Pairing successful! (Manual Verify)', 'success');
            }, 1000);
        } else {
            showStatus('Please enter a valid 6-digit code.', 'error');
        }
    });

    // Event Listeners
    refreshBtn.addEventListener('click', generatePairingCode);

    // Initialize
    generatePairingCode();
});