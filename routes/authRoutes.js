const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();

router.get('/github',
    passport.authenticate('github', { scope: ['user'] })
);

router.get('/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to frontend
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(frontendUrl);
    }
);

// Logout route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(frontendUrl);
    });
});

module.exports = router;