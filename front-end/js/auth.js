require('dotenv').config();
const jwt = require('jsonwebtoken');
const fetchPromise = import('node-fetch'); 

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const API_BASE_URL = process.env.API_BASE_URL; 

function isAuth(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.redirect('/login');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const requestedUserId = req.params.user_id;
        if (String(decoded.user_id) !== requestedUserId) {
            return res.status(403).send('Unauthorized access');
        }
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
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
                    return next(); 
                } else {
                    return res.status(404).send('error: Project not urs. Access denied');
                }
            } else if (response.status === 401) {
                return res.redirect('/login');
            } else {
                const responseText = await response.text();
                console.error('error:', response.status, responseText);
                return res.status(response.status).send(`${response.status}: ${responseText}`);
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