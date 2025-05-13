document.getElementById('register-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('username-error');

    // Clear previous error message
    errorMessage.textContent = "";

    // Validate input
    if (username === "" || password === "") {
        errorMessage.textContent = "Username and password are required!";
        return;
    }

    // Check if username is already taken via the Go backend API
    try {
        console.log("Sending request:", { username, password });
        const response = await fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });        
        const data = await response.json();
        console.log("Response:", data);

        if (response.ok) {
            // Successfully registered, redirect to login page
            window.location.href = 'login.html';
        } else if (data.error) {
            // Handle backend error (e.g., username already taken)
            errorMessage.textContent = data.error;
        }
    } catch (error) {
        // Handle network or server error
        errorMessage.textContent = "An error occurred. Please try again.";
    }
});
