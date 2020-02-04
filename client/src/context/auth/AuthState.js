import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	LOGOUT,
	CLEAR_ERRORS,
	AUTH_ERROR
} from '../types';

const AuthState = props => {
	const initialState = {
		token: localStorage.getItem('token'),
		user: null,
		isAuthenticated: null,
		loading: true,
		error: null
	};

	const [state, dispatch] = useReducer(authReducer, initialState);

	const register = async formData => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		try {
			const res = await axios.post('/api/users', formData, config);
			dispatch({ type: REGISTER_SUCCESS, payload: res.data });
			loadUser();
		} catch (error) {
			dispatch({ type: REGISTER_FAIL, payload: error.response.data.errors });
		}
	};

	const loadUser = async () => {
		if (localStorage.token) {
			setAuthToken(localStorage.token);
		}
		try {
			const res = await axios.get('/api/auth');
			dispatch({ type: USER_LOADED, payload: res.data });
		} catch (error) {
			dispatch({ type: AUTH_ERROR, payload: error.response.data.errors });
		}
	};

	const login = async formData => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		try {
			const res = await axios.post('/api/auth', formData, config);
			dispatch({ type: LOGIN_SUCCESS, payload: res.data });
			loadUser();
		} catch (error) {
			dispatch({ type: LOGIN_FAIL, payload: error.response.data.errors });
		}
	};
	const logout = () => {
		dispatch({ type: LOGOUT });
	};
	const clearErrors = () => {
		dispatch({ type: CLEAR_ERRORS });
	};

	return (
		<AuthContext.Provider
			value={{
				token: state.token,
				user: state.user,
				isAuthenticated: state.isAuthenticated,
				loading: state.loading,
				error: state.error,
				register,
				loadUser,
				login,
				logout,
				clearErrors
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthState;
