document.getElementById('register-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('username-error');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementById('modal-close');

    errorMessage.textContent = "";

    if (username === "" || password === "") {
        showModal("Username and password are required!");
        return;
    }

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
        const response = await fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        const data = await response.json();

        if (response.ok) {
            showModal("Registrasi berhasil! Silakan login sekarang.");
        } else if (data.error) {
            showModal(data.error);
        }
    } catch (error) {
        showModal("Terjadi kesalahan saat menghubungi server.");
    }

    function showModal(message) {
        modalMessage.textContent = message;
        modal.classList.remove("hidden");
    }

    modalClose.addEventListener('click', function () {
        modal.classList.add("hidden");
    });

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });
});