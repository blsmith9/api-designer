import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import M from 'materialize-css/dist/js/materialize.min.js';

const DefinitionForm = ({
	definition,
	setDefinition,
	swagger,
	setSwagger,
	property,
	setProperty,
	clearDef,
	definitions
}) => {
	const { definitionName } = definition;
	const definitionProperties = definition.properties;
	const propertyName = property.name,
		propertyType = property.propertyType,
		propertyTypes = property.types,
		propertyItems = propertyTypes.items,
		propertyItemRef = propertyTypes.itemSchema.itemRef,
		propertyChildRef = property.childSchema.childRef;

	const onAddUpdateDefinition = () => {
		if (definitionName === '' || definitionProperties.length === 0) {
			M.toast({
				html: 'Please add a definition name and at least one property.',
				classes: 'rounded'
			});
		} else {
			if (definition.tempId === '') {
				definition.tempId = uuid.v4();
				setSwagger({
					...swagger,
					definitions: [definition, ...definitions]
				});
			} else {
				setSwagger({
					...swagger,
					definitions: definitions.map(d =>
						d.tempId === definition.tempId ? definition : d
					)
				});
			}
			clearDef();
		}
	};

	const onChangeDefinitionName = e => {
		setDefinition({
			...definition,
			definitionName: e.target.value
		});
	};

	const onAddUpdateProperty = () => {
		if (propertyName === '' || propertyType === '') {
			M.toast({
				html: 'Please add a property name and type.',
				classes: 'rounded'
			});
		} else if (propertyType === 'array' && propertyItems === '') {
			M.toast({
				html: 'Please add a type for each item in the array.',
				classes: 'rounded'
			});
		} else if (
			propertyType === 'array' &&
			propertyItems === 'reference' &&
			propertyItemRef === ''
		) {
			M.toast({
				html: 'Please add a definition to be referenced.',
				classes: 'rounded'
			});
		} else if (propertyType === 'reference' && propertyChildRef === '') {
			M.toast({
				html: 'Please add a definition to be referenced.',
				classes: 'rounded'
			});
		} else {
			if (property.tempId === '') {
				property.tempId = uuid.v4();
				setDefinition({
					...definition,
					properties: [property, ...definitionProperties]
				});
			} else {
				setDefinition({
					...definition,
					properties: definitionProperties.map(propertyItem =>
						propertyItem.tempId === property.tempId ? property : propertyItem
					)
				});
			}
			clearProperty();
		}
	};

	const onDeleteProperty = id => {
		setDefinition({
			...definition,
			properties: definitionProperties.filter(
				property => property.tempId !== id
			)
		});
		clearProperty();
	};

	const onChangeProperty = e => {
		setProperty({
			...property,
			[e.target.name]: e.target.value
		});
	};

	const onChangePropertyItems = e => {
		setProperty({
			...property,
			types: { ...propertyTypes, items: e.target.value }
		});
	};

	const onChangePropertyItemsRef = e => {
		setProperty({
			...property,
			types: { ...propertyTypes, itemSchema: { itemRef: e.target.value } }
		});
	};

	const onChangePropertyChildRef = e => {
		setProperty({
			...property,
			childSchema: { childRef: e.target.value }
		});
	};

	const clearProperty = () => {
		setProperty({
			tempId: '',
			name: '',
			propertyType: '',
			types: { items: '', itemSchema: { itemRef: '' } },
			childSchema: { childRef: '' }
		});
	};

	return (
		<Fragment>
			<h5 style={{ marginTop: '0', marginBottom: '20px' }}>Definitions</h5>
			<p>
				Definitions are used as models for requests and responses. It is
				recommended you create some of these first in order to use them in path
				creation. This will allow you to re-use request and response models
				throughout different paths.
			</p>
			<div className='input-field'>
				<input
					type='text'
					placeholder='Definition Name'
					name='definitionName'
					value={definitionName}
					onChange={onChangeDefinitionName}
					className='validate'
					pattern='^[A-Z]([a-z0-9]+[A-Z0-9]?)*$'
				/>
				<span
					className='helper-text'
					data-error='Please provide a valid name in UpperCamelCase'
				>
					<b>Definition Name -</b> Ex: TestDefinitionName
				</span>
			</div>
			{definitionName !== '' && (
				<button
					className='btn waves-effect waves-light red darken-3'
					style={{ marginTop: '10px', width: '100%' }}
					type='button'
					onClick={clearDef}
				>
					Clear
				</button>
			)}
			<button
				className='btn modal-trigger waves-effect waves-light blue'
				style={{ marginTop: '10px', width: '100%' }}
				type='button'
				data-target='definition-modal'
			>
				Property Editor
			</button>
			{definitionProperties.length > 0 && (
				<button
					className='btn waves-effect waves-light blue'
					style={{ marginTop: '10px', width: '100%' }}
					type='button'
					onClick={onAddUpdateDefinition}
				>
					{definition.tempId === '' ? 'Save Definition' : 'Update Definition'}
				</button>
			)}
			<div className='modal modal-fixed-footer' id='definition-modal'>
				<div className='modal-content'>
					<h5>Properties</h5>
					<p>
						Properties are a characteristics of the definition. If your
						definition was a User, potential properties could be firstName,
						lastName, address, etc.
					</p>
					{definitionProperties.map(propItem => (
						<div key={propItem.tempId} className='card-panel white-text blue'>
							{propItem.name}
							<a
								href='#!'
								className='white-text right'
								onClick={() => onDeleteProperty(propItem.tempId)}
							>
								<i className='material-icons'>clear</i>
							</a>
							<a
								href='#!'
								className='white-text right'
								style={{ marginRight: '10px' }}
								onClick={() => setProperty(propItem)}
							>
								<i className='material-icons'>create</i>
							</a>
						</div>
					))}
					<div className='input-field'>
						<input
							type='text'
							placeholder='Property Name'
							name='name'
							value={propertyName}
							onChange={onChangeProperty}
						/>
						<span className='helper-text'>
							<b>Property Name -</b> Ex: testPropertyName
						</span>
					</div>
					<label style={{ marginTop: '10px' }}>Property Type</label>
					<select
						className='browser-default'
						value={propertyType}
						name='propertyType'
						onChange={onChangeProperty}
					>
						<option value='' disabled>
							Property Type
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
						className={propertyType === 'array' ? '' : 'hide'}
					>
						Item Type
					</label>
					<select
						className={`browser-default ${
							propertyType === 'array' ? '' : 'hide'
						}`}
						value={propertyItems}
						name='items'
						onChange={onChangePropertyItems}
					>
						<option value='' disabled>
							Item Type
						</option>
						<option value='string'>String</option>
						<option value='integer'>Integer</option>
						<option value='decimal'>Decimal</option>
						<option value='date'>Date</option>
						<option value='reference'>Definition</option>
					</select>
					<label
						style={{ marginTop: '10px' }}
						className={propertyType === 'reference' ? '' : 'hide'}
					>
						Referenced Definition
					</label>
					<select
						className={`browser-default ${
							propertyType === 'reference' ? '' : 'hide'
						}`}
						value={propertyChildRef}
						name='childRef'
						onChange={onChangePropertyChildRef}
					>
						<option value='' disabled>
							Referenced Definition
						</option>
						{definitions.map(def => (
							<option
								disabled={
									def.definitionName === definitionName ? 'disabled' : ''
								}
								key={def.tempId}
								value={def.definitionName}
							>
								{def.definitionName}
							</option>
						))}
					</select>
					<label
						style={{ marginTop: '10px' }}
						className={propertyItems === 'reference' ? '' : 'hide'}
					>
						Referenced Definition
					</label>
					<select
						className={`browser-default ${
							propertyItems === 'reference' ? '' : 'hide'
						}`}
						value={propertyItemRef}
						name='itemRef'
						onChange={onChangePropertyItemsRef}
					>
						<option value='' disabled>
							Referenced Definition
						</option>
						{definitions.map(def => (
							<option
								disabled={
									def.definitionName === definitionName ? 'disabled' : ''
								}
								key={def.tempId}
								value={def.definitionName}
							>
								{def.definitionName}
							</option>
						))}
					</select>
				</div>
				<div className='modal-footer'>
					<button
						className='btn waves-effect waves-light blue'
						type='button'
						onClick={onAddUpdateProperty}
						style={{ marginRight: '10px' }}
					>
						{property.tempId === '' ? 'Add property' : 'Update property'}
					</button>
					<button
						className='btn waves-effect waves-light red darken-3'
						type='button'
						onClick={clearProperty}
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

DefinitionForm.propTypes = {
	definition: PropTypes.object.isRequired,
	setDefinition: PropTypes.func.isRequired,
	swagger: PropTypes.object.isRequired,
	setSwagger: PropTypes.func.isRequired,
	property: PropTypes.object.isRequired,
	setProperty: PropTypes.func.isRequired,
	clearDef: PropTypes.func.isRequired,
	definitions: PropTypes.array.isRequired
};

export default DefinitionForm;
