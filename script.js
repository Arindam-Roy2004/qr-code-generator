document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const closeBtn = document.getElementById('close-btn');
    const textInput = document.getElementById('text-input');
    const qrResultContainer = document.getElementById('qr-result');
    const qrCodeContainer = document.getElementById('qrcode-container');
    const qrCodePlaceholder = document.getElementById('qrcode-placeholder');
    const messageBox = document.getElementById('message-box');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    let qrcodeInstance = null;

    function showMessage(text) {
        messageBox.textContent = text;
        messageBox.style.display = 'block';
    }

    function hideMessage() {
        messageBox.style.display = 'none';
    }

    function hideQrResult() {
        qrResultContainer.classList.add('hidden');
        closeBtn.classList.add('hidden');
        qrCodePlaceholder.style.display = 'flex';
    }

    function isValidUrl(string) {
        try {
            new URL(string);
            if (!string.includes('://')) {
                return string.includes('.');
            }
            return true;
        } catch (_) {
            if (string.includes('.') && !string.includes(' ')) {
                return true;
            }
            return false;
        }
    }

    function handleGenerate() {
        let text = textInput.value.trim();
        hideMessage();

        if (!text) {
            showMessage('Please enter a URL.');
            textInput.focus();
            return;
        }

        if (/^\d+$/.test(text)) {
            showMessage('Please enter a valid URL, not just numbers.');
            textInput.focus();
            return;
        }

        if (!text.match(/^[a-zA-Z]+:\/\//)) {
            text = 'https://' + text;
        }

        if (!isValidUrl(text)) {
            showMessage('Please enter a valid URL (e.g., google.com).');
            textInput.focus();
            return;
        }

        generateBtn.disabled = true;
        hideQrResult();

        progressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';

        setTimeout(() => {
            progressBar.style.width = '80%';
        }, 10);

        setTimeout(() => {
            try {
                qrCodePlaceholder.style.display = 'none';
                if (qrcodeInstance) {
                    qrcodeInstance.makeCode(text);
                } else {
                    qrcodeInstance = new QRCode(qrCodeContainer, {
                        text: text,
                        width: 256,
                        height: 256,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }

                progressBar.style.width = '100%';

                setTimeout(() => {
                    qrResultContainer.classList.remove('hidden');
                    downloadBtn.classList.remove('hidden');
                    closeBtn.classList.remove('hidden');
                    progressContainer.classList.add('hidden');
                }, 400);

            } catch (error) {
                console.error("QR Code Generation Failed:", error);
                showMessage('Failed to generate QR code. Input may be too long or invalid.');
                progressContainer.classList.add('hidden');
                qrCodePlaceholder.style.display = 'flex';
            } finally {
                generateBtn.disabled = false;
            }
        }, 500);
    }

    function handleDownload() {
        const imgElement = qrCodeContainer.querySelector('img');
        if (!imgElement) {
            showMessage('Could not find the QR code image to download.');
            return;
        }
        const imageUrl = imgElement.src;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    generateBtn.addEventListener('click', handleGenerate);
    downloadBtn.addEventListener('click', handleDownload);
    closeBtn.addEventListener('click', hideQrResult);

    textInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleGenerate();
        }
    });

    textInput.addEventListener('focus', () => {
        if (!qrResultContainer.classList.contains('hidden')) {
            hideQrResult();
        }
    });


});
