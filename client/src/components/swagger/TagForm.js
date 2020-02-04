import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import M from 'materialize-css/dist/js/materialize.min.js';

const TagForm = ({ tag, setTag, swagger, setSwagger, tags }) => {
	const tagName = tag.name;
	const tagDesc = tag.description;

	const onChangeTag = e => {
		setTag({
			...tag,
			[e.target.name]: e.target.value
		});
	};

	const onAddUpdateTag = () => {
		if (tagName === '' || tagDesc === '') {
			M.toast({
				html: 'Please add a tag name and description.',
				classes: 'rounded'
			});
		} else {
			if (tag.tempId === '') {
				tag.tempId = uuid.v4();
				setSwagger({
					...swagger,
					tags: [tag, ...tags]
				});
			} else {
				setSwagger({
					...swagger,
					tags: tags.map(tagItem =>
						tagItem.tempId === tag.tempId ? tag : tagItem
					)
				});
			}
			clearTag();
		}
	};

	const clearTag = () => {
		setTag({
			tempId: '',
			name: '',
			description: ''
		});
	};

	return (
		<Fragment>
			<h5 style={{ marginTop: '0', marginBottom: '20px' }}>Tags</h5>
			<p>
				Tags are used to group paths together. An example may be 'Users' and
				this tag would be added to all paths that manipulate User data.
			</p>
			<div className='input-field'>
				<input
					type='text'
					name='name'
					placeholder='Tag Name'
					value={tagName}
					onChange={onChangeTag}
				/>
				<span className='helper-text'>
					<b>Tag Name</b>
				</span>
			</div>
			<div className='input-field'>
				<input
					type='text'
					name='description'
					placeholder='Tag Description'
					value={tagDesc}
					onChange={onChangeTag}
				/>
				<span className='helper-text'>
					<b>Tag Description</b>
				</span>
			</div>
			{(tagName !== '' || tagDesc !== '') && (
				<button
					className='red darken-3 waves-effect waves-light btn'
					style={{ marginTop: '10px', width: '100%' }}
					type='button'
					onClick={clearTag}
				>
					Clear
				</button>
			)}
			<button
				className='blue waves-effect waves-light btn'
				style={{ marginTop: '10px', width: '100%' }}
				type='button'
				onClick={onAddUpdateTag}
			>
				{tag.tempId === '' ? 'Add Tag' : 'Update Tag'}
			</button>
		</Fragment>
	);
};

TagForm.propTypes = {
	tag: PropTypes.object.isRequired,
	setTag: PropTypes.func.isRequired,
	swagger: PropTypes.object.isRequired,
	setSwagger: PropTypes.func.isRequired,
	tags: PropTypes.array.isRequired
};

export default TagForm;
