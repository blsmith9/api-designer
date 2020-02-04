import React from 'react';
import PropTypes from 'prop-types';

const Tags = ({ setSwagger, swagger, tags, setTag }) => {
	const onDeleteTag = id => {
		setSwagger({
			...swagger,
			tags: tags.filter(tagItem => tagItem.tempId !== id)
		});
		setTag({
			tempId: '',
			name: '',
			description: ''
		});
	};

	return (
		<div style={{ marginTop: '20px' }}>
			{tags.map(tagItem => (
				<div className='card-panel blue white-text' key={tagItem.tempId}>
					{tagItem.name}

					<a
						className='white-text right'
						href='#!'
						onClick={() => onDeleteTag(tagItem.tempId)}
					>
						<i className='material-icons'>clear</i>
					</a>
					<a
						className='white-text right'
						href='#!'
						style={{ marginRight: '10px' }}
						onClick={() => setTag(tagItem)}
					>
						<i className='material-icons'>create</i>
					</a>
				</div>
			))}
		</div>
	);
};

Tags.propTypes = {
	tags: PropTypes.array.isRequired,
	setTag: PropTypes.func.isRequired,
	swagger: PropTypes.object.isRequired,
	setSwagger: PropTypes.func.isRequired
};

export default Tags;
