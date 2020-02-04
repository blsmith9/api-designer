import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import M from 'materialize-css/dist/js/materialize.min.js';

const Login = props => {
	const authContext = useContext(AuthContext);
	const { login, error, clearErrors, isAuthenticated } = authContext;
	const [user, setUser] = useState({
		email: '',
		password: ''
	});

	const { email, password } = user;

	const onChange = e => {
		setUser({
			...user,
			[e.target.name]: e.target.value
		});
	};

	const onSubmit = () => {
		if (email === '' || password === '') {
			M.toast({
				html: 'Please enter your email and password.',
				classes: 'rounded'
			});
		} else {
			login({
				email,
				password
			});
		}
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

	return (
		<div className='container' style={{ width: '50%' }}>
			<h4>Account Login</h4>
			<form onSubmit={e => e.preventDefault}>
				<div className='form-group'>
					<label htmlFor='email'>Email</label>
					<input type='email' name='email' value={email} onChange={onChange} />
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
				<p>
					Don't have an account? <Link to='/register'>Register</Link>
				</p>
				<button
					type='button'
					className='blue waves-effect waves-light btn'
					onClick={onSubmit}
					style={{ marginTop: '10px', width: '100%' }}
				>
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
