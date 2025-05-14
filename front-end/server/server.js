const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, "../")));

// Serve home.html only for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "home.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "login.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "register.html"));
});

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
});
