import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import M from 'materialize-css/dist/js/materialize.min.js';

const PathForm = ({
	definitions,
	resp,
	setResp,
	param,
	setParam,
	tags,
	advanced,
	setAdvanced,
	vari,
	setVari,
	endpoint,
	setEndpoint,
	endpoints,
	swagger,
	setSwagger,
	clearEnd
}) => {
	// endpoints

	const { path, variables } = endpoint;
	const { variable } = vari;
	const variableInfo = vari.info;
	const variableSummary = variableInfo.summary,
		variableDesc = variableInfo.description,
		variableTag = variableInfo.tag,
		variableParams = variableInfo.parameters,
		variableResponses = variableInfo.responses;
	const parameterIn = param.in,
		parameterName = param.name,
		parameterDesc = param.description,
		parameterReq = param.required,
		parameterType = param.parameterType,
		parameterItems = param.types.items,
		parameterRef = param.paramSchema.paramRef;
	const { response, responseCustom } = resp;
	const responseDesc = resp.description,
		responseRef = resp.responseSchema.responseRef;

	const onChangePath = e => {
		setEndpoint({
			...endpoint,
			path: e.target.value
		});
	};

	const onChangeVariableInfo = e => {
		setVari({
			...vari,
			info: { ...variableInfo, [e.target.name]: e.target.value }
		});
	};

	const onChangeVariable = e => {
		setVari({
			...vari,
			variable: e.target.value
		});
	};

	const onChangeParam = e => {
		setParam({
			...param,
			[e.target.name]: e.target.value
		});
	};

	const onChangeParamItems = e => {
		setParam({
			...param,
			types: { items: e.target.value }
		});
	};

	const onChangeParamRef = e => {
		setParam({
			...param,
			paramSchema: { paramRef: e.target.value }
		});
	};

	const onChangeRespCode = e => {
		switch (e.target.value) {
			case '200':
				setResp({
					...resp,
					response: '200',
					description: 'OK'
				});
				break;
			case '201':
				setResp({
					...resp,
					response: '201',
					description: 'Created'
				});
				break;
			case '400':
				setResp({
					...resp,
					response: '400',
					description: 'Bad Request'
				});
				break;
			case '401':
				setResp({
					...resp,
					response: '401',
					description: 'Unauthorized'
				});
				break;
			case '403':
				setResp({
					...resp,
					response: '403',
					description: 'Forbidden'
				});
				break;
			case '404':
				setResp({
					...resp,
					response: '404',
					description: 'Not Found'
				});
				break;
			case '500':
				setResp({
					...resp,
					response: '500',
					description: 'Server Error'
				});
				break;
			case 'custom':
				setResp({
					...resp,
					response: 'custom',
					description: ''
				});
				break;
			default:
				setResp({
					...resp
				});
				break;
		}
	};

	const onChangeResp = e => {
		setResp({
			...resp,
			[e.target.name]: e.target.value
		});
	};

	const onChangeRespRef = e => {
		setResp({
			...resp,
			responseSchema: { responseRef: e.target.value }
		});
	};

	const onAddUpdateEndpoint = () => {
		if (path === '' || variables.length === 0) {
			M.toast({
				html: 'Please add a path name and at least one variable.',
				classes: 'rounded'
			});
		} else {
			if (endpoint.tempId === '') {
				endpoint.tempId = uuid.v4();
				setSwagger({
					...swagger,
					endpoints: [endpoint, ...endpoints]
				});
			} else {
				setSwagger({
					...swagger,
					endpoints: endpoints.map(e =>
						e.tempId === endpoint.tempId ? endpoint : e
					)
				});
			}
			clearEnd();
		}
	};

	const onAddUpdateVar = () => {
		if (variable === '' || variableSummary === '' || variableDesc === '') {
			M.toast({
				html: 'Please select a resource and add a summary and description.',
				classes: 'rounded'
			});
		} else if (variableResponses.length === 0) {
			M.toast({
				html: 'Please add at least one response.',
				classes: 'rounded'
			});
		} else {
			if (vari.tempId === '') {
				vari.tempId = uuid.v4();
				setEndpoint({
					...endpoint,
					variables: [vari, ...variables]
				});
			} else {
				setEndpoint({
					...endpoint,
					variables: variables.map(variableItem =>
						variableItem.tempId === vari.tempId ? vari : variableItem
					)
				});
			}
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
		}
	};

	const onAddUpdateParameter = () => {
		if (
			parameterIn === '' ||
			parameterName === '' ||
			parameterType === '' ||
			parameterDesc === '' ||
			parameterReq === ''
		) {
			M.toast({
				html:
					'Please make sure parameter In, Name, Type, Description, and Required are filled out.',
				classes: 'rounded'
			});
		} else if (parameterType === 'array' && parameterItems === '') {
			M.toast({
				html: 'Please add a type for each item in the array.',
				classes: 'rounded'
			});
		} else if (parameterType === 'reference' && parameterRef === '') {
			M.toast({
				html: 'Please add a definition to be referenced.',
				classes: 'rounded'
			});
		} else {
			if (param.tempId === '') {
				param.tempId = uuid.v4();
				setVari({
					...vari,
					info: { ...variableInfo, parameters: [param, ...variableParams] }
				});
			} else {
				setVari({
					...vari,
					info: {
						...variableInfo,
						parameters: variableParams.map(parameterItem =>
							parameterItem.tempId === param.tempId ? param : parameterItem
						)
					}
				});
			}
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
		}
	};

	const onAddUpdateResponse = () => {
		if (response === '' || responseDesc === '') {
			M.toast({
				html: 'Please add a response code and description.',
				classes: 'rounded'
			});
		} else if (response === 'custom' && responseCustom === '') {
			M.toast({
				html: 'Please define your custom response.',
				classes: 'rounded'
			});
		} else {
			if (resp.tempId === '') {
				resp.tempId = uuid.v4();
				setVari({
					...vari,
					info: { ...variableInfo, responses: [resp, ...variableResponses] }
				});
			} else {
				setVari({
					...vari,
					info: {
						...variableInfo,
						responses: variableResponses.map(responseItem =>
							responseItem.tempId === resp.tempId ? resp : responseItem
						)
					}
				});
			}
			setResp({
				tempId: '',
				response: '',
				description: '',
				responseSchema: { responseRef: '' }
			});
		}
	};

	const onDeleteVar = id => {
		setEndpoint({
			...endpoint,
			variables: variables.filter(v => v.tempId !== id)
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
	};

	const onDeleteParam = id => {
		setVari({
			...vari,
			info: {
				...variableInfo,
				parameters: variableParams.filter(p => p.tempId !== id)
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
	};

	const onDeleteResp = id => {
		setVari({
			...vari,
			info: {
				...variableInfo,
				responses: variableResponses.filter(r => r.tempId !== id)
			}
		});
		setResp({
			tempId: '',
			response: '',
			description: '',
			responseSchema: { responseRef: '' }
		});
	};

	const onAdvanced = () => {
		setAdvanced(!advanced);
	};

	const clearVari = () => {
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
			description: '',
			responseSchema: { responseRef: '' }
		});
		setAdvanced(false);
	};

	return (
		<Fragment>
			<h5 style={{ marginTop: '0', marginBottom: '20px' }}>Paths</h5>
			<p>
				Paths consist of endpoints to be called within the API in order to
				retrieve, update, or delete a specific resource. It is recommended to
				make any necessary definitions for requests and responses first, so they
				can be utilized in your endpoints.
			</p>
			<div className='input-field'>
				<input
					type='text'
					name='path'
					placeholder='Path Name'
					value={path}
					onChange={onChangePath}
				/>
				<span className='helper-text'>
					<b>Path Name -</b> EX: '/path/extra-path/&#123;id&#125;'
				</span>
			</div>
			{path !== '' && (
				<button
					className='btn waves-effect waves-light red darken-3'
					style={{ marginTop: '10px', width: '100%' }}
					type='button'
					onClick={clearEnd}
				>
					Clear
				</button>
			)}
			<button
				className='btn modal-trigger waves-effect waves-light blue'
				style={{ width: '100%', marginTop: '10px' }}
				type='button'
				data-target='path-modal'
			>
				Resource Editor
			</button>
			{variables.length > 0 && (
				<button
					className='btn waves-effect waves-light blue'
					style={{ width: '100%', marginTop: '10px' }}
					type='button'
					onClick={onAddUpdateEndpoint}
				>
					{endpoint.tempId === '' ? 'Save Path' : 'Update Path'}
				</button>
			)}
			<div className='modal modal-fixed-footer' id='path-modal'>
				<div className='modal-content'>
					<h5>Resources</h5>
					<p>
						There are multiple resources per path, however, only one of each
						resource can be used per path. At least one is required per path.
						Basic types of resources include GET, POST, and DELETE. Choosing
						ADVANCED will give you access to PUT, PATCH, HEAD, and OPTIONS.
					</p>
					{variables.map(varItem => (
						<div key={varItem.tempId} className='card-panel white-text blue'>
							{varItem.variable.toUpperCase()}
							<a
								href='#!'
								className='white-text right'
								onClick={() => onDeleteVar(varItem.tempId)}
							>
								<i className='material-icons'>clear</i>
							</a>
							<a
								href='#!'
								className='white-text right'
								style={{ marginRight: '10px' }}
								onClick={() => setVari(varItem)}
							>
								<i className='material-icons'>create</i>
							</a>
						</div>
					))}
					<label style={{ marginTop: '10px' }}>Resource Type</label>
					<select
						className='browser-default'
						value={variable}
						name='variable'
						onChange={onChangeVariable}
					>
						<option value='' disabled>
							Resource Type
						</option>
						<option
							disabled={
								variables.findIndex(v => v.variable === 'get') === -1
									? ''
									: 'disabled'
							}
							value='get'
						>
							GET
						</option>
						<option
							disabled={
								variables.findIndex(v => v.variable === 'post') === -1
									? ''
									: 'disabled'
							}
							value='post'
						>
							POST
						</option>
						<option
							disabled={
								variables.findIndex(v => v.variable === 'delete') === -1
									? ''
									: 'disabled'
							}
							value='delete'
						>
							DELETE
						</option>
						{advanced === true && (
							<Fragment>
								<option
									disabled={
										variables.findIndex(v => v.variable === 'put') === -1
											? ''
											: 'disabled'
									}
									value='put'
								>
									PUT
								</option>
								<option
									disabled={
										variables.findIndex(v => v.variable === 'patch') === -1
											? ''
											: 'disabled'
									}
									value='patch'
								>
									PATCH
								</option>
								<option
									disabled={
										variables.findIndex(v => v.variable === 'head') === -1
											? ''
											: 'disabled'
									}
									value='head'
								>
									HEAD
								</option>
								<option
									disabled={
										variables.findIndex(v => v.variable === 'options') === -1
											? ''
											: 'disabled'
									}
									value='options'
								>
									OPTIONS
								</option>
							</Fragment>
						)}
					</select>
					{variable !== '' && (
						<Fragment>
							<div className='divider'></div>
							<div className='section'>
								<h6>Info</h6>
								<p>Basic information about the resource.</p>
								<div className='input-field'>
									<input
										type='text'
										name='summary'
										placeholder='Summary'
										value={variableSummary}
										onChange={onChangeVariableInfo}
									/>
									<span className='helper-text'>
										<b>Summary</b>
									</span>
								</div>
								<div className='input-field'>
									<input
										type='text'
										name='description'
										placeholder='Description'
										value={variableDesc}
										onChange={onChangeVariableInfo}
									/>
									<span className='helper-text'>
										<b>Description</b>
									</span>
								</div>
								<label style={{ marginTop: '10px' }}>Tag</label>
								<select
									className={'browser-default'}
									value={variableTag}
									name='tag'
									onChange={onChangeVariableInfo}
								>
									<option value='' disabled>
										Tag
									</option>
									{tags.map(t => (
										<option key={t.tempId} value={t.name}>
											{t.name}
										</option>
									))}
								</select>
							</div>
							<div className='divider'></div>
							<div className='section'>
								<h6 style={{ marginBottom: '20px' }}>Parameters</h6>
								<p>
									There can be multiple parameters per resources. At least one
									is required per resource. Parameters cant be sent via the
									path, query, header, or body. Each parameter defines a bit of
									information that is being sent in order to obtain a response.
									For example, you could send 'name' as a query parameter to
									filter Users by name.
								</p>
								{variableParams.map(paramItem => (
									<div
										key={paramItem.tempId}
										className='card-panel white-text blue'
									>
										{paramItem.name}
										<a
											href='#!'
											className='white-text right'
											onClick={() => onDeleteParam(paramItem.tempId)}
										>
											<i className='material-icons'>clear</i>
										</a>
										<a
											href='#!'
											className='white-text right'
											style={{ marginRight: '10px' }}
											onClick={() => setParam(paramItem)}
										>
											<i className='material-icons'>create</i>
										</a>
									</div>
								))}
								<label style={{ marginTop: '10px' }}>Parameter In</label>
								<select
									className='browser-default'
									value={parameterIn}
									name='in'
									onChange={onChangeParam}
								>
									<option value='' disabled>
										In
									</option>
									<option value='path'>Path</option>
									<option value='query'>Query</option>
									<option value='header'>Header</option>
									<option value='body'>Body</option>
								</select>
								{parameterIn === 'path' && (
									<p style={{ marginLeft: '10px' }}>
										When adding a path parameter, make sure to incorporate the
										parameter in your path name. This parameter should also be
										required. EX: If the path parameter is 'id', then your path
										should be '/example-path/&#123;id&#125;'
									</p>
								)}
								<label style={{ marginTop: '10px' }}>Required</label>
								<select
									className='browser-default'
									value={parameterReq}
									name='required'
									onChange={onChangeParam}
								>
									<option value='' disabled>
										Required
									</option>
									<option value='false'>False</option>
									<option value='true'>True</option>
								</select>
								<div className='input-field'>
									<input
										type='text'
										name='name'
										placeholder='Name'
										value={parameterName}
										onChange={onChangeParam}
									/>
									<span className='helper-text'>
										<b>Parameter Name</b>
									</span>
								</div>
								<div className='input-field'>
									<input
										type='text'
										name='description'
										placeholder='Description'
										value={parameterDesc}
										onChange={onChangeParam}
									/>
									<span className='helper-text'>
										<b>Parameter Description</b>
									</span>
								</div>
								<label style={{ marginTop: '10px' }}>Parameter Type</label>
								<select
									className='browser-default'
									value={parameterType}
									name='parameterType'
									onChange={onChangeParam}
								>
									<option value='' disabled>
										Parameter Type
									</option>
									<option value='string'>String</option>
									<option value='integer'>Integer</option>
									<option value='decimal'>Decimal</option>
									<option value='date'>Date</option>
									<option value='array'>List</option>
									<option value='reference'>Definition</option>
								</select>
								<label
									style={{ marginTop: '10px' }}
									className={parameterType === 'array' ? '' : 'hide'}
								>
									Item Type
								</label>
								<select
									className={`browser-default ${
										parameterType === 'array' ? '' : 'hide'
									}`}
									value={parameterItems}
									name='items'
									onChange={onChangeParamItems}
								>
									<option value='' disabled>
										Item Type
									</option>
									<option value='string'>String</option>
									<option value='integer'>Integer</option>
									<option value='decimal'>Decimal</option>
									<option value='date'>Date</option>
								</select>
								<label
									style={{ marginTop: '10px' }}
									className={parameterType === 'reference' ? '' : 'hide'}
								>
									Item Type
								</label>
								<select
									className={`browser-default ${
										parameterType === 'reference' ? '' : 'hide'
									}`}
									value={parameterRef}
									name='paramRef'
									onChange={onChangeParamRef}
								>
									<option value='' disabled>
										Referenced Definition
									</option>
									{definitions.map(def => (
										<option key={def.tempId} value={def.definitionName}>
											{def.definitionName}
										</option>
									))}
								</select>
								<button
									className='btn waves-effect waves-light blue'
									type='button'
									style={{
										width: '100%',
										marginTop: '10px'
									}}
									onClick={onAddUpdateParameter}
								>
									{param.tempId === '' ? 'Add parameter' : 'Update parameter'}
								</button>
							</div>
							<div className='divider'></div>
							<div className='section'>
								<h6>Responses</h6>
								<p>
									There can be multiple responses per resource. At least one is
									required per resource. Responses define what is returned after
									calling this path. If your response returns information other
									than the status and description, you must reference an
									existing definition, so make sure to build those out so they
									will be available for defining responses.
								</p>
								{variableResponses.map(respItem => (
									<div
										key={respItem.tempId}
										className='card-panel white-text blue'
									>
										{respItem.response}
										<a
											href='#!'
											className='white-text right'
											onClick={() => onDeleteResp(respItem.tempId)}
										>
											<i className='material-icons'>clear</i>
										</a>
										<a
											href='#!'
											className='white-text right'
											style={{ marginRight: '10px' }}
											onClick={() => setResp(respItem)}
										>
											<i className='material-icons'>create</i>
										</a>
									</div>
								))}
								<label style={{ marginTop: '10px' }}>Response Code</label>
								<select
									className='browser-default'
									value={response}
									name='response'
									onChange={onChangeRespCode}
								>
									<option value='' disabled>
										Response Code
									</option>
									<option value='200'>200</option>
									<option value='201'>201</option>
									<option value='400'>400</option>
									<option value='401'>401</option>
									<option value='403'>403</option>
									<option value='404'>404</option>
									<option value='500'>500</option>
									<option value='custom'>Custom</option>
								</select>
								{response === 'custom' && (
									<div className='input-field'>
										<input
											type='text'
											name='responseCustom'
											placeholder='Custom Response Code'
											value={responseCustom}
											onChange={onChangeResp}
										/>
										<span className='helper-text'>
											<b>Custom Response Code</b>
										</span>
									</div>
								)}
								<div className='input-field'>
									<input
										type='text'
										name='description'
										placeholder='Response Description'
										value={responseDesc}
										onChange={onChangeResp}
									/>
									<span className='helper-text'>
										<b>Response Description</b>
									</span>
								</div>
								<label style={{ marginTop: '10px' }}>
									Referenced Definition
								</label>
								<select
									className='browser-default'
									value={responseRef}
									name='responseRef'
									onChange={onChangeRespRef}
								>
									<option value='' disabled>
										Referenced Definition
									</option>
									{definitions.map(def => (
										<option key={def.tempId} value={def.definitionName}>
											{def.definitionName}
										</option>
									))}
								</select>
								<button
									className='btn waves-effect waves-light blue'
									type='button'
									style={{
										width: '100%',
										marginTop: '10px'
									}}
									onClick={onAddUpdateResponse}
								>
									{resp.tempId === '' ? 'Add response' : 'Update response'}
								</button>
							</div>
						</Fragment>
					)}
				</div>
				<div className='modal-footer'>
					<button
						className='btn waves-effect waves-light green'
						onClick={onAdvanced}
						style={{ marginRight: '10px' }}
					>
						{advanced === true ? 'Basic' : 'Advanced'}
					</button>
					<button
						className='btn waves-effect waves-light blue'
						type='button'
						onClick={onAddUpdateVar}
						style={{ marginRight: '10px' }}
					>
						{vari.tempId === '' ? 'Add resource' : 'Update resource'}
					</button>
					<button
						className='btn waves-effect waves-light red darken-3'
						type='button'
						onClick={clearVari}
						style={{ marginRight: '10px' }}
					>
						Clear
					</button>
					<a
						href='#!'
						className='modal-close waves-effect waves-light btn grey'
					>
						Close
					</a>
				</div>
			</div>
		</Fragment>
	);
};

PathForm.propTypes = {
	definitions: PropTypes.array.isRequired,
	resp: PropTypes.object.isRequired,
	setResp: PropTypes.func.isRequired,
	param: PropTypes.object.isRequired,
	setParam: PropTypes.func.isRequired,
	tags: PropTypes.array.isRequired,
	advanced: PropTypes.bool.isRequired,
	setAdvanced: PropTypes.func.isRequired,
	vari: PropTypes.object.isRequired,
	setVari: PropTypes.func.isRequired,
	endpoint: PropTypes.object.isRequired,
	setEndpoint: PropTypes.func.isRequired,
	endpoints: PropTypes.array.isRequired,
	swagger: PropTypes.object.isRequired,
	setSwagger: PropTypes.func.isRequired,
	clearEnd: PropTypes.func.isRequired
};

export default PathForm;
