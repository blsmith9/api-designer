import React from 'react';
import PropTypes from 'prop-types';

const Definitions = ({
	definitions,
	setDefinition,
	swagger,
	setSwagger,
	clearDef
}) => {
	const onDeleteDefinition = id => {
		setSwagger({
			...swagger,
			definitions: definitions.filter(d => d.tempId !== id)
		});
		clearDef();
	};
	return (
		<div style={{ marginTop: '20px' }}>
			{definitions.map(def => (
				<div className='card-panel blue white-text' key={def.tempId}>
					{def.definitionName}
					<a
						className='white-text right'
						href='#!'
						onClick={() => onDeleteDefinition(def.tempId)}
					>
						<i className='material-icons'>clear</i>
					</a>
					<a
						href='#!'
						className='white-text right'
						style={{ marginRight: '10px' }}
						onClick={() => setDefinition(def)}
					>
						<i className='material-icons'>create</i>
					</a>
				</div>
			))}
		</div>
	);
};

Definitions.propTypes = {
	definitions: PropTypes.array.isRequired,
	setDefinition: PropTypes.func.isRequired,
	swagger: PropTypes.object.isRequired,
	setSwagger: PropTypes.func.isRequired,
	clearDef: PropTypes.func.isRequired
};

export default Definitions;
