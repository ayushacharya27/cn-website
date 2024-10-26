let port;
        let defaultSendingInterval; // Interval for sending default "n"
        let currentKeyData; // Data to send based on button pressed

        document.getElementById('connectButton').addEventListener('click', async () => {
            try {
                port = await navigator.serial.requestPort();
                await port.open({ baudRate: 9600 });
                document.getElementById('status').textContent = 'Connected to the COM port!';

                // Start sending default "n" when connected
                startDefaultSending();

                // Add event listeners for button presses
                document.querySelectorAll('.sendButton').forEach(button => {
                    button.addEventListener('mousedown', startSendingKey);
                    button.addEventListener('mouseup', stopSendingKey);
                    button.addEventListener('mouseleave', stopSendingKey); // Stop sending if mouse leaves the button
                });

            } catch (error) {
                console.error('Error connecting to the serial port:', error);
                document.getElementById('status').textContent = 'Failed to connect to the COM port.';
            }
        });

        function startSendingKey(event) {
            if (!port) return; // If not connected, do nothing

            // Stop sending default "n" when a button is pressed
            stopDefaultSending();

            // Set current key data based on button pressed
            currentKeyData = event.target.getAttribute('data-value');

            // Immediately send the character when the button is pressed
            sendData(currentKeyData);
        }

        function stopSendingKey(event) {
            // Clear sending interval if it's active
            currentKeyData = null; // Reset currentKeyData

            // Restart sending default "n" when no button is pressed
            startDefaultSending();
        }

        async function sendData(data) {
            if (!port) return; // If not connected, do nothing
            const encoder = new TextEncoder();
            const writer = port.writable.getWriter();
            try {
                await writer.write(encoder.encode(data + '\n'));
                document.getElementById('status').textContent = `Sent: "${data}"`;
            } catch (error) {
                console.error('Error writing to serial port:', error);
                document.getElementById('status').textContent = 'Failed to send data.';
            } finally {
                writer.releaseLock(); // Release the lock after writing
            }
        }

        function startDefaultSending() {
            if (!port) return; // If not connected, do nothing
            if (defaultSendingInterval) return; // If already sending "n", do nothing

            defaultSendingInterval = setInterval(async () => {
                await sendData('n'); // Send default "n" every second
            }, 1); // Send "n" every second
        }

        function stopDefaultSending() {
            if (defaultSendingInterval) {
                clearInterval(defaultSendingInterval); // Stop sending "n"
                defaultSendingInterval = null; // Reset the interval
            }
        }