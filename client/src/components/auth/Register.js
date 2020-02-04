import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';
import M from 'materialize-css/dist/js/materialize.min.js';

const Register = props => {
	const authContext = useContext(AuthContext);
	const { register, error, clearErrors, isAuthenticated } = authContext;
	const [user, setUser] = useState({
		name: '',
		email: '',
		password: '',
		password2: ''
	});

	const { name, email, password, password2 } = user;

	const onChange = e => {
		setUser({
			...user,
			[e.target.name]: e.target.value
		});
	};

	useEffect(() => {
		if (isAuthenticated) {
			props.history.push('/');
		}
		if (error && error.length > 0) {
			for (let e of error) M.toast({ html: e.msg, classes: 'rounded' });
			clearErrors();
		}
		// eslint-disable-next-line
	}, [error, isAuthenticated, props.history]);

	const onSubmit = () => {
		if (name === '' || password === '' || email === '') {
			M.toast({ html: 'Please enter all fields.', classes: 'rounded' });
		} else if (password !== password2) {
			M.toast({ html: 'Passwords do not match.', classes: 'rounded' });
		} else {
			register({
				name,
				email,
				password
			});
		}
	};
	return (
		<div className='container' style={{ width: '50%' }}>
			<h4>Account Register</h4>
			<form onSubmit={e => e.preventDefault}>
				<div className='form-group'>
					<label htmlFor='name'>Name</label>
					<input type='text' name='name' value={name} onChange={onChange} />
				</div>
				<div className='form-group'>
					<label htmlFor='email'>Email</label>
					<input
						className='validate'
						type='email'
						name='email'
						value={email}
						onChange={onChange}
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='name'>Password</label>
					<input
						type='password'
						name='password'
						value={password}
						onChange={onChange}
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='name'>Confirm Password</label>
					<input
						type='password'
						name='password2'
						value={password2}
						onChange={onChange}
					/>
				</div>
				<button
					type='button'
					className='blue waves-effect waves-light btn'
					onClick={onSubmit}
					style={{ marginTop: '10px', width: '100%' }}
				>
					Register
				</button>
			</form>
		</div>
	);
};

export default Register;
