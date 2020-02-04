const express = require('express');
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();

const User = require('../models/User');

// @route   POST /api/users
// @desc    Register a user
// @access  Public
router.post(
	'/',
	[
		check('name', 'Please enter a name.').notEmpty(),
		check('email', 'Please enter a valid email.').isEmail(),
		check(
			'password',
			'Please enter a password of 6 or more characters.'
		).isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });
			if (user) {
				res.status(400).json({ errors: [{ msg: 'User already exists.' }] });
			}

			user = new User({
				name,
				email,
				password
			});

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);

			await user.save();

			const payload = {
				user: {
					id: user.id
				}
			};

			const jwtSecret = process.env.jwtSecret || config.get('jwtSecret');
			jwt.sign(payload, jwtSecret, { expiresIn: 36000 }, (error, token) => {
				if (error) throw error;
				res.json({ token });
			});
		} catch (error) {
			console.error(error.message);
			res.status(500).send('Server Error.');
		}
	}
);

module.exports = router;
