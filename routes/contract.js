const express = require('express');
const router = express.Router();
const { validationResult, check } = require('express-validator');
const auth = require('../middleware/auth');

const Swagger = require('../models/Swagger');
const User = require('../models/User');

// @route   PUT /api/contract/share
// @desc    Share api to other user
// @access  Private
router.put(
	'/share',
	[
		auth,
		check(
			'email',
			'Please provide user email you wish to share with.'
		).notEmpty(),
		check(
			'swaggerId',
			'Please provide ID of design you wish to share.'
		).notEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		try {
			const { email, swaggerId } = req.body;
			let swagger = await Swagger.findById(swaggerId);
			if (!swagger)
				return res
					.status(404)
					.json({ errors: [{ msg: 'API Design not found.' }] });

			if (!swagger.user.includes(req.user.id)) {
				return res.status(401).json({ errors: [{ msg: 'Unauthorized.' }] });
			}
			let user = await User.findOne({ email });
			if (!user) {
				return res.status(404).json({ errors: [{ msg: 'User not found.' }] });
			}

			let swaggerFields = {
				user: [...swagger.user, user._id]
			};

			swagger = await Swagger.findByIdAndUpdate(
				swagger._id,
				{ $set: swaggerFields },
				{ new: true }
			);

			res.json(swagger);
		} catch (error) {
			console.error(error.message);
			res.status(500).send('Server Error.');
		}
	}
);

// @route   GET /api/contract
// @desc    Get all users contracts
// @access  Private
router.get('/', auth, async (req, res) => {
	try {
		let swaggers = await Swagger.find({ user: req.user.id }).sort({
			date: -1
		});
		res.json(swaggers);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error.');
	}
});

// @route   POST /api/contract
// @desc    Add contract
// @access  Private
router.post(
	'/',
	[
		auth,
		[
			check('info.title', 'Please provide an API name.').notEmpty(),
			check('info.description', 'Please provide a description.').notEmpty(),
			check('info.version', 'Please provide a version.').notEmpty(),
			check('info.contextRoot', 'Please provide a context root.').notEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		try {
			// split body
			const {
				info: { title, description, version, contextRoot },
				schemes,
				consumes,
				produces,
				tags,
				endpoints,
				definitions
			} = req.body;

			let newTags = [...tags];
			let newSchemes = [...schemes];
			let newConsumes = [...consumes];
			let newProduces = [...produces];
			let newEndpoints = mapEndpoints(endpoints);
			let newDefinitions = mapDefinitions(definitions);

			// build swagger model
			const newSwagger = new Swagger({
				user: [req.user.id],
				info: {
					title,
					description,
					version,
					contextRoot
				},
				schemes: newSchemes,
				consumes: newConsumes,
				produces: newProduces,
				tags: newTags,
				endpoints: newEndpoints,
				definitions: newDefinitions
			});
			const swagger = await newSwagger.save();
			res.json(swagger);
		} catch (error) {
			console.error(error.message);
			res.status(500).send('Server Error.');
		}
	}
);

// @route   PUT /api/contract/:id
// @desc    Update contract
// @access  Private
router.put('/:id', auth, async (req, res) => {
	const {
		info: { title, description, version, contextRoot },
		schemes,
		consumes,
		produces,
		tags,
		endpoints,
		definitions
	} = req.body;

	let swaggerFields = { info: {} };
	if (title) swaggerFields.info.title = title;
	if (description) swaggerFields.info.description = description;
	if (version) swaggerFields.info.version = version;
	if (contextRoot) swaggerFields.info.contextRoot = contextRoot;
	if (schemes) swaggerFields.schemes = [...schemes];
	if (consumes) swaggerFields.consumes = [...consumes];
	if (produces) swaggerFields.produces = [...produces];
	if (tags) swaggerFields.tags = [...tags];
	if (endpoints) swaggerFields.endpoints = mapEndpoints(endpoints);
	if (definitions) swaggerFields.definitions = mapDefinitions(definitions);

	try {
		let swagger = await Swagger.findById(req.params.id);
		if (!swagger)
			return res
				.status(404)
				.json({ errors: [{ msg: 'API Design not found.' }] });

		if (!swagger.user.includes(req.user.id)) {
			return res.status(401).json({ errors: [{ msg: 'Unauthorized.' }] });
		}

		swagger = await Swagger.findByIdAndUpdate(
			req.params.id,
			{ $set: swaggerFields },
			{ new: true }
		);

		res.json(swagger);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error.');
	}
});

// @route   DELETE /api/contract/:id
// @desc    Delete contract
// @access  Private
router.delete('/:id', auth, async (req, res) => {
	try {
		let swagger = await Swagger.findById(req.params.id);
		if (!swagger)
			return res
				.status(404)
				.json({ errors: [{ msg: 'API Design not found.' }] });

		if (swagger.user.toString() !== req.user.id) {
			return res.status(401).json({ errors: [{ msg: 'Unauthorized.' }] });
		}

		swagger = await Swagger.findByIdAndRemove(req.params.id);

		res.json({ msg: 'API Design removed.' });
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error.');
	}
});

const mapEndpoints = endpoints => {
	let newEndpoints = [];
	for (endpoint of endpoints) {
		let newVariables = [];
		for (variable of endpoint.variables) {
			let newParameters = [];
			for (parameter of variable.info.parameters) {
				let newParameter = { ...parameter };
				newParameters.push(newParameter);
			}

			let newResponses = [];
			for (response of variable.info.responses) {
				let newResponse = { ...response };
				newResponses.push(newResponse);
			}
			let newVariable = {
				...variable,
				info: {
					...variable.info,
					parameters: newParameters,
					responses: newResponses
				}
			};
			newVariables.push(newVariable);
		}
		newEndpoints.push({
			...endpoint,
			variables: newVariables
		});
	}
	return newEndpoints;
};

const mapDefinitions = definitions => {
	let newDefinitions = [];
	for (definition of definitions) {
		let newProperties = [];
		for (property of definition.properties) {
			let newProperty = { ...property };
			newProperties.push(newProperty);
		}
		newDefinitions.push({
			...definition,
			properties: newProperties
		});
	}
	return newDefinitions;
};

module.exports = router;
