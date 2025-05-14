require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

function isAuth(req, res, next) {
    const token = req.cookies?.token || extractTokenFromHeader(req);
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

function extractTokenFromHeader(req) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return null;
}

module.exports = { isAuth };