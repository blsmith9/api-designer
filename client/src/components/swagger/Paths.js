import React from 'react';
import PropTypes from 'prop-types';

const Paths = ({ endpoints, clearEnd, setSwagger, swagger, setEndpoint }) => {
	const onDeleteEndpoint = id => {
		setSwagger({
			...swagger,
			endpoints: endpoints.filter(e => e.tempId !== id)
		});
		clearEnd();
	};
	return (
		<div style={{ marginTop: '20px' }}>
			{endpoints.map(e => (
				<div className='card-panel blue white-text' key={e.tempId}>
					{e.path}
					<a
						className='white-text right'
						href='#!'
						onClick={() => onDeleteEndpoint(e.tempId)}
					>
						<i className='material-icons'>clear</i>
					</a>
					<a
						href='#!'
						className='white-text right'
						style={{ marginRight: '10px' }}
						onClick={() => setEndpoint(e)}
					>
						<i className='material-icons'>create</i>
					</a>
				</div>
			))}
		</div>
	);
};

Paths.propTypes = {
	endpoints: PropTypes.array.isRequired,
	setEndpoint: PropTypes.func.isRequired,
	swagger: PropTypes.object.isRequired,
	setSwagger: PropTypes.func.isRequired,
	clearEnd: PropTypes.func.isRequired
};

export default Paths;
