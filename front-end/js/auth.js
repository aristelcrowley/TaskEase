require('dotenv').config();
const jwt = require('jsonwebtoken');
const fetchPromise = import('node-fetch'); // Dynamic import

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const API_BASE_URL = process.env.API_BASE_URL; // Load from .env

function isAuth(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        console.error('JWT verification error:', err);
        return res.redirect('/login');
    }
}

async function isProjectPageAuth(req, res, next) {
    const token = req.cookies?.token;
    const projectId = req.params.project_id;
    const checkProjectUrl = `${API_BASE_URL}/api/project/check-ownership/${projectId}`;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        try {
            const { default: fetch } = await fetchPromise;
            const response = await fetch(checkProjectUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `token=${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.isOwner) {
                    return next(); // User is the owner
                } else {
                    return res.status(404).send('Project not found or access denied');
                }
            } else if (response.status === 401) {
                return res.redirect('/login');
            } else {
                const responseText = await response.text();
                console.error('Go API error:', response.status, responseText);
                return res.status(response.status).send(`Project check failed with status ${response.status}: ${responseText}`);
            }
        } catch (fetchErr) {
            console.error('Fetch error:', fetchErr);
            return res.status(500).send('Internal server error during project check');
        }

    } catch (err) {
        console.error('JWT verification error:', err);
        return res.redirect('/login');
    }
}

module.exports = { isAuth, isProjectPageAuth };