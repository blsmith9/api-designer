import React, { Fragment, useState, useContext, useEffect } from 'react';
import SwaggerContext from '../../context/swagger/swaggerContext';
import AuthContext from '../../context/auth/authContext';
import M from 'materialize-css/dist/js/materialize.min.js';
import TagForm from './TagForm';
import DefinitionForm from './DefinitionForm';
import PathForm from './PathForm';
import Tags from './Tags';
import Definitions from './Definitions';
import Paths from './Paths';

const SwaggerForm = () => {
	const swaggerContext = useContext(SwaggerContext);
	const authContext = useContext(AuthContext);
	const {
		addSwagger,
		updateSwagger,
		currentSwagger,
		clearCurrentSwagger,
		clearSwaggerErrors,
		error
	} = swaggerContext;

	const [swagger, setSwagger] = useState({
		info: {
			title: '',
			description: '',
			version: 'v1',
			contextRoot: ''
		},
		schemes: ['https'],
		consumes: ['application/json'],
		produces: ['application/json'],
		tags: [],
		definitions: [],
		endpoints: []
	});

	const [tag, setTag] = useState({
		tempId: '',
		name: '',
		description: ''
	});

	const [definition, setDefinition] = useState({
		tempId: '',
		definitionName: '',
		properties: []
	});

	const [property, setProperty] = useState({
		tempId: '',
		name: '',
		propertyType: '',
		types: { items: '', itemSchema: { itemRef: '' } },
		childSchema: { childRef: '' }
	});

	const [endpoint, setEndpoint] = useState({
		tempId: '',
		path: '',
		variables: []
	});

	const [vari, setVari] = useState({
		tempId: '',
		variable: '',
		info: {
			summary: '',
			description: '',
			tag: '',
			parameters: [],
			responses: []
		}
	});

	const [param, setParam] = useState({
		tempId: '',
		in: '',
		name: '',
		description: '',
		required: '',
		parameterType: '',
		types: { items: '' },
		paramSchema: { paramRef: '' }
	});

	const [resp, setResp] = useState({
		tempId: '',
		response: '',
		responseCustom: '',
		description: '',
		responseSchema: { responseRef: '' }
	});

	const [advanced, setAdvanced] = useState(false);

	useEffect(() => {
		authContext.loadUser();
		let elem = document.querySelectorAll('.modal');
		M.Modal.init(elem);
		if (currentSwagger !== null) {
			setSwagger(currentSwagger);
		} else {
			setSwagger({
				info: {
					title: '',
					description: '',
					version: 'v1',
					contextRoot: ''
				},
				schemes: ['https'],
				consumes: ['application/json'],
				produces: ['application/json'],
				tags: [],
				definitions: [],
				endpoints: []
			});
		}

		if (error && error.length > 0) {
			for (let e of error) M.toast({ html: e.msg, classes: 'rounded' });
			clearSwaggerErrors();
		}
		// eslint-disable-next-line
	}, [error, swaggerContext, currentSwagger]);

	// swagger

	const { info, tags, definitions, endpoints } = swagger;

	const { title, version, description, contextRoot } = info;

	const onChange = e => {
		setSwagger({
			...swagger,
			info: { ...info, [e.target.name]: e.target.value }
		});
	};

	const onSubmit = () => {
		if (
			title === '' ||
			version === '' ||
			description === '' ||
			contextRoot === ''
		) {
			M.toast({
				html:
					'Please fill out the API Name, Context Root, Version, and Description.',
				classes: 'rounded'
			});
		} else {
			if (currentSwagger === null) {
				addSwagger(swagger);
			} else {
				updateSwagger(swagger);
			}

			setSwagger({
				info: {
					title: '',
					description: '',
					version: 'v1',
					contextRoot: ''
				},
				schemes: ['https'],
				consumes: ['application/json'],
				produces: ['application/json'],
				tags: [],
				definitions: [],
				endpoints: []
			});
			clearAll();
		}
	};

	// clear

	const clearDef = () => {
		setDefinition({
			tempId: '',
			definitionName: '',
			properties: []
		});
		setProperty({
			tempId: '',
			name: '',
			propertyType: '',
			types: { items: '', itemSchema: { itemRef: '' } },
			childSchema: { childRef: '' }
		});
	};

	const clearEnd = () => {
		setEndpoint({
			tempId: '',
			path: '',
			variables: []
		});
		setVari({
			tempId: '',
			variable: '',
			info: {
				summary: '',
				description: '',
				tag: '',
				parameters: [],
				responses: []
			}
		});
		setParam({
			tempId: '',
			in: '',
			name: '',
			description: '',
			required: '',
			parameterType: '',
			types: { items: '' },
			paramSchema: { paramRef: '' }
		});
		setResp({
			tempId: '',
			response: '',
			responseCustom: '',
			description: '',
			responseSchema: { responseRef: '' }
		});
		setAdvanced(false);
	};

	const clearAll = () => {
		clearCurrentSwagger();
		setTag({
			tempId: '',
			name: '',
			description: ''
		});
		clearDef();
		clearEnd();
	};

	return (
		<Fragment>
			<div className='fixed-action-btn'>
				<button
					style={{ marginRight: '10px' }}
					onClick={onSubmit}
					className='btn-floating btn-large waves-effect waves-light green darken-2'
				>
					<i className='large material-icons'>check</i>
				</button>
				<button
					onClick={clearAll}
					className='btn-floating btn-large waves-effect waves-light red darken-2'
				>
					<i className='large material-icons'>clear</i>
				</button>
			</div>
			<form
				style={{ marginBottom: '40px', marginTop: '20px' }}
				onSubmit={e => e.preventDefault()}
			>
				<div className='card-panel'>
					<h4 style={{ marginTop: '0' }}>
						{currentSwagger === null ? 'Design API' : 'Edit API Design'}
					</h4>

					<div className='input-field'>
						<input
							type='text'
							name='title'
							placeholder='API Name'
							value={title}
							onChange={onChange}
							pattern='^[A-Z]([a-z0-9]+[A-Z0-9]?)*$'
							className='validate'
						/>
						<span
							className='helper-text'
							data-error='Please provide a valid name in UpperCamelCase'
						>
							<b>API Name -</b> Ex: TestApiName
						</span>
					</div>
					<div className='input-field'>
						<input
							type='text'
							name='contextRoot'
							placeholder='Context Root'
							value={contextRoot}
							onChange={onChange}
							pattern='^[a-z]+(?:-[a-z]+)*$'
							className='validate'
						/>
						<span
							className='helper-text'
							data-error='Please provide a valid context root in slug-case'
						>
							<b>Context Root -</b> Ex: context-root OR contextRoot
						</span>
					</div>
					<div className='input-field'>
						<input
							type='text'
							name='version'
							placeholder='Version'
							value={version}
							onChange={onChange}
							pattern='^v[0-9]+$'
							className='validate'
						/>
						<span
							className='helper-text'
							data-error='Please provide a valid version'
						>
							<b>Version -</b> Ex: v1
						</span>
					</div>
					<div className='input-field'>
						<input
							type='text'
							name='description'
							placeholder='Description'
							value={description}
							onChange={onChange}
						/>
						<span className='helper-text'>
							<b>Description</b>
						</span>
					</div>
				</div>
				<div className='card-panel'>
					<TagForm
						tag={tag}
						setTag={setTag}
						swagger={swagger}
						setSwagger={setSwagger}
						tags={tags}
					/>
					<Tags
						tags={tags}
						setTag={setTag}
						swagger={swagger}
						setSwagger={setSwagger}
					/>
				</div>
				<div className='card-panel'>
					<DefinitionForm
						definition={definition}
						setDefinition={setDefinition}
						definitions={definitions}
						swagger={swagger}
						setSwagger={setSwagger}
						property={property}
						setProperty={setProperty}
						clearDef={clearDef}
					/>
					<Definitions
						definitions={definitions}
						setDefinition={setDefinition}
						swagger={swagger}
						setSwagger={setSwagger}
						clearDef={clearDef}
					/>
				</div>
				<div className='card-panel'>
					<PathForm
						definitions={definitions}
						resp={resp}
						setResp={setResp}
						param={param}
						setParam={setParam}
						tags={tags}
						advanced={advanced}
						setAdvanced={setAdvanced}
						vari={vari}
						setVari={setVari}
						endpoint={endpoint}
						setEndpoint={setEndpoint}
						endpoints={endpoints}
						swagger={swagger}
						setSwagger={setSwagger}
						clearEnd={clearEnd}
					/>
					<Paths
						endpoints={endpoints}
						setEndpoint={setEndpoint}
						swagger={swagger}
						setSwagger={setSwagger}
						clearEnd={clearEnd}
					/>
				</div>
			</form>
		</Fragment>
	);
};

export default SwaggerForm;
