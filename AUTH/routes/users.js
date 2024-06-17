const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
var passport = require('passport')

const User = require('../models/users')
const users = require('../controllers/users');



// Get all users
router.get('/', (req, res) => {
    users.list()
        .then(data => res.jsonp(data))
        .catch(err => res.status(500).jsonp(err))
}
);

// Get user by email
router.get('/:email', (req, res) => {
    users.findByEmail(req.params.email)
        .then(data => res.jsonp(data))
        .catch(err => res.status(500).jsonp(err))
}
);

// Add a new user
router.post('/', (req, res) => {
    users.addUser(req.body)
        .then(data => res.jsonp(data))
        .catch(err => res.status(500).jsonp(err))
}
);

// Update user by username
router.put('/:username', (req, res) => {
    users.updateUser(req.params.username, req.body)
        .then(data => res.jsonp(data))
        .catch(err => res.status(500).jsonp(err))
}
);

// Delete user by username
router.delete('/:username', (req, res) => {
    users.removeUser(req.params.username)
        .then(data => res.jsonp(data))
        .catch(err => res.status(500).jsonp(err))
}
);

// return a users access level


// Register a new user
router.post('/register', function(req, res) {
    var d = new Date().toISOString().substring(0,19)
    User.register(new User({ username: req.body.username, email: req.body.email, filiacao: req.body.filiacao, nivel: req.body.nivel, dataRegisto: d, dataUltimoAcesso: d }), req.body.password, (err, user) => {
        if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ message: 'Failed to create user.', error: err.message });
        }

        // Authenticate user
        passport.authenticate('local')(req, res, () => {
            // Generate JWT token
            const token = jwt.sign({ userId: user.username, accessLevel: user.nivel }, 'segredo321', { expiresIn: '1h' });

            // Return success response with JWT token
            res.status(200).json({ message: 'User created successfully.', token });
        }
        );
    }
    );
  });


// Login user
router.post('/login', passport.authenticate('local'), (req, res) => {
    const token = jwt.sign({ userId: req.user.username, accessLevel: req.user.nivel }, 'segredo321', { expiresIn: '1h' });
    res.status(200).json({ message: 'User logged in successfully.', token });
}
);



module.exports = router;