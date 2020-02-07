import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SwaggerContext from '../../context/swagger/swaggerContext';
import M from 'materialize-css/dist/js/materialize.min.js';

const SwaggerItem = ({ swagger }) => {
	const swaggerContext = useContext(SwaggerContext);
	const {
		deleteSwagger,
		setCurrentSwagger,
		clearCurrentSwagger,
		shareSwagger,
		clearSwaggerErrors,
		error
	} = swaggerContext;

	const {
		_id,
		info: { title, version, description }
	} = swagger;

	useEffect(() => {
		if (error && error.length > 0) {
			for (let e of error) M.toast({ html: e.msg, classes: 'rounded' });
			clearSwaggerErrors();
		}
		// eslint-disable-next-line
	}, [error]);

	const onShare = () => {
		let email = window.prompt(
			"Enter the email of the user you'd like to share with",
			'example@email.com'
		);
		if (email != null) {
			shareSwagger(_id, email);
		}
	};

	const onDelete = () => {
		let confirm = window.confirm(
			'Are you sure you want to delete this design?'
		);
		if (confirm === true) {
			deleteSwagger(_id);
			clearCurrentSwagger();
		}
	};

	const onSave = () => {
		let choice = window.prompt(
			"Choose a swagger version: '2.0' or '3.0.0'",
			'2.0'
		);
		if (choice !== null) {
			setCurrentSwagger(swagger);
			convertToJSONSwagger(swagger, choice);
			clearCurrentSwagger();
		}
	};

	const convertToJSONSwagger = (s, version) => {
		let defPath;
		if (version === '3.0.0') {
			defPath = '#/components/schemas/';
		} else {
			version = '2.0';
			defPath = '#/definitions/';
		}

		// map tags
		let newTags = [];
		if (s.tags && s.tags.length > 0) {
			for (let tag of s.tags) {
				let newTag = {
					name: tag.name,
					description: tag.description
				};
				newTags.push(newTag);
			}
		}

		// map paths
		let newPaths = {};
		if (s.endpoints && s.endpoints.length > 0) {
			for (let e of s.endpoints) {
				let newVariables = {};
				if (e.variables && e.variables.length > 0) {
					for (let v of e.variables) {
						let newParameters = [];
						if (v.info.parameters && v.info.parameters.length > 0) {
							for (let p of v.info.parameters) {
								let newParam = {};
								if (p.in === 'body' && version === '3.0.0') {
									newParam = {
										requestBody: {
											description: p.description,
											required: p.required === 'true',
											content: {
												'application/json': {
													schema: {
														$ref: defPath + p.paramSchema.paramRef
													}
												}
											}
										}
									};
								} else {
									newParam = {
										in: p.in,
										name: p.name,
										description: p.description,
										required: p.required === 'true'
									};
								}
								if (p.parameterType === 'array') {
									if (version === '3.0.0') {
										newParam.schema = {
											type: p.parameterType,
											items: {
												type: p.types.items
											}
										};
									} else {
										newParam.type = p.parameterType;
										newParam.items = {
											type: p.types.items
										};
									}
								} else if (p.parameterType === 'reference') {
									if (version !== '3.0.0') {
										newParam.schema = {
											$ref: defPath + p.paramSchema.paramRef
										};
									}
								} else if (p.parameterType === 'date') {
									if (version === '3.0.0') {
										newParam.schema = {
											type: 'string',
											format: 'date'
										};
									} else {
										newParam.type = 'string';
										newParam.format = 'date';
									}
								} else if (p.parameterType === 'decimal') {
									if (version === '3.0.0') {
										newParam.schema = {
											type: 'number',
											format: 'float'
										};
									} else {
										newParam.type = 'number';
										newParam.format = 'float';
									}
								} else {
									if (version === '3.0.0') {
										newParam.schema = {
											type: p.parameterType
										};
									} else {
										newParam.type = p.parameterType;
									}
								}
								newParameters.push(newParam);
							}
						}
						let newResponses = {};
						if (v.info.responses && v.info.responses.length > 0) {
							for (let r of v.info.responses) {
								if (r.response === 'custom') r.response = r.responseCustom;
								newResponses[r.response] = {
									description: r.description
								};
								if (r.responseSchema.responseRef !== '') {
									if (version === '3.0.0') {
										newResponses[r.response].content = {
											'application/json': {
												schema: {
													$ref: defPath + r.responseSchema.responseRef
												}
											}
										};
									} else {
										newResponses[r.response].schema = {
											$ref: defPath + r.responseSchema.responseRef
										};
									}
								}
							}
						}
						newVariables[v.variable] = {
							summary: v.info.summary,
							description: v.info.description,
							parameters: newParameters,
							responses: newResponses
						};
						if (v.info.tag !== '') {
							newVariables[v.variable].tags = [v.info.tag];
						}
					}
				}
				newPaths[e.path] = newVariables;
			}
		}

		// map definitions
		let newDefinitions = {};
		if (s.definitions && s.definitions.length > 0) {
			for (let def of s.definitions) {
				let newProps = {};
				if (def.properties && def.properties.length > 0) {
					for (let prop of def.properties) {
						let newProp = {};
						if (
							prop.propertyType === 'array' &&
							prop.types.items !== 'reference'
						) {
							newProp.items = {
								type: prop.types.items
							};
							newProp.type = prop.propertyType;
						} else if (
							prop.propertyType === 'array' &&
							prop.types.items === 'reference'
						) {
							newProp.items = {
								$ref: '#/definitions/' + prop.types.itemSchema.itemRef
							};
						} else if (prop.propertyType === 'reference') {
							newProp.$ref = '#/definitions/' + prop.childSchema.childRef;
						} else if (prop.propertyType === 'date') {
							newProp.type = 'string';
							newProp.format = 'date';
						} else if (prop.propertyType === 'decimal') {
							newProp.type = 'number';
							newProp.format = 'float';
						} else {
							newProp.type = prop.propertyType;
						}
						newProps[prop.name] = newProp;
					}
				}
				let newDef = {
					type: 'object',
					properties: newProps
				};
				newDefinitions[def.definitionName] = newDef;
			}
		}

		let newSwagger = {
			info: {
				title: s.info.title,
				version: s.info.version,
				description: s.info.description
			},
			tags: newTags,
			paths: newPaths
		};

		if (version === '2.0') {
			newSwagger.swagger = version;
			newSwagger.schemes = [...s.schemes];
			newSwagger.produces = [...s.produces];
			newSwagger.consumes = [...s.consumes];
			newSwagger.definitions = newDefinitions;
		} else {
			newSwagger.openapi = version;
			newSwagger.components = {
				schemas: newDefinitions
			};
		}

		let dataStr =
			'data:text/json;charset=utf-8,' +
			encodeURIComponent(JSON.stringify(newSwagger));
		let downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute('href', dataStr);
		downloadAnchorNode.setAttribute(
			'download',
			newSwagger.info.title + '.json'
		);
		document.body.appendChild(downloadAnchorNode);
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	};

	return (
		<div className='card blue hoverable'>
			<div className='card-content white-text'>
				<div className='card-title'>
					{title} : {version}
				</div>
				<p>
					{description.substr(0, 70)}
					{description.length > 70 ? '...' : ''}
				</p>
			</div>
			<div className='card-action'>
				<Link
					to='/design'
					className='white-text'
					onClick={() => setCurrentSwagger(swagger)}
				>
					<i className='material-icons'>create</i>
				</Link>
				<a href='#!' className='white-text' onClick={onSave}>
					<i className='material-icons'>save_alt</i>
				</a>
				<a href='#!' className='white-text' onClick={onShare}>
					<i className='material-icons'>person_add</i>
				</a>
				<a href='#!' className='white-text' onClick={onDelete}>
					<i className='material-icons'>clear</i>
				</a>
			</div>
		</div>
	);
};

SwaggerItem.propTypes = {
	swagger: PropTypes.object.isRequired
};

export default SwaggerItem;
