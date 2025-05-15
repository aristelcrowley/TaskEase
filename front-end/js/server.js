require('dotenv').config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { isAuth, isProjectPageAuth } = require("./auth.js"); // Import the new middleware

const app = express();
const PORT = 3000;

app.use(cookieParser());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../", "home.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../", "login.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../", "register.html"));
});

app.get("/project/:user_id", isAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "../", "project.html"));
});

app.get("/task/:project_id", isProjectPageAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "../", "task.html"));
});

app.get("/history/:user_id", isAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "../", "history.html"));
});

app.use(express.static(path.join(__dirname, "../")));

app.use((req, res) => {
    res.status(404).send("Page not found");
});

app.listen(PORT, () => {
    console.log(`Frontend server running at http://localhost:${PORT}`);
});