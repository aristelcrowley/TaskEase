document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("login-error");
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  const closeModal = document.getElementById("close-modal");

  errorMessage.textContent = "";

  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  try {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await response.json();
    if (response.ok && data.token) {
      const expireDate = new Date();
      expireDate.setHours(expireDate.getHours() + 3); 
      document.cookie = `token=${data.token}; path=/; expires=${expireDate.toUTCString()};`;

      modalMessage.textContent = "Login berhasil!";
      modal.style.display = "flex";

      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const userId = payload.user_id;

      setTimeout(() => {
        window.location.href = `/project:${userId}`;
      }, 1500);
    } else {
      modalMessage.textContent = data.error || "Login gagal.";
      modal.style.display = "flex";
    }
  } catch (error) {
    modalMessage.textContent = "Terjadi kesalahan. Silakan coba lagi.";
    modal.style.display = "flex";
  }

  closeModal.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});