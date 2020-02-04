import React, { useReducer } from 'react';
import axios from 'axios';
import SwaggerContext from './swaggerContext';
import swaggerReducer from './swaggerReducer';
import {
	GET_SWAGGERS,
	ADD_SWAGGER,
	DELETE_SWAGGER,
	UPDATE_SWAGGER,
	SET_CURRENT_SWAGGER,
	CLEAR_CURRENT_SWAGGER,
	SWAGGER_ERROR,
	CLEAR_SWAGGERS,
	CLEAR_SWAGGER_ERRORS,
	SHARE_SWAGGER
} from '../types';

const SwaggerState = props => {
	const initialState = {
		swaggers: null,
		currentSwagger: null,
		error: null,
		loading: true
	};

	const [state, dispatch] = useReducer(swaggerReducer, initialState);

	const getSwaggers = async () => {
		try {
			const res = await axios.get('/api/contract');
			dispatch({ type: GET_SWAGGERS, payload: res.data });
		} catch (error) {
			dispatch({ type: SWAGGER_ERROR, payload: error.response.data.errors });
		}
	};

	const clearSwaggers = () => {
		dispatch({ type: CLEAR_SWAGGERS });
	};

	const addSwagger = async swagger => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};
		try {
			const res = await axios.post('/api/contract', swagger, config);
			console.log(res.data);
			dispatch({ type: ADD_SWAGGER, payload: res.data });
		} catch (error) {
			dispatch({ type: SWAGGER_ERROR, payload: error.response.data.errors });
		}
	};

	const deleteSwagger = async id => {
		try {
			await axios.delete(`/api/contract/${id}`);
			dispatch({ type: DELETE_SWAGGER, payload: id });
		} catch (error) {
			dispatch({ type: SWAGGER_ERROR, payload: error.response.data.errors });
		}
	};

	const updateSwagger = async swagger => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};
		try {
			const res = await axios.put(
				`/api/contract/${swagger._id}`,
				swagger,
				config
			);
			dispatch({ type: UPDATE_SWAGGER, payload: res.data });
		} catch (error) {
			dispatch({ type: SWAGGER_ERROR, payload: error.response.data.errors });
		}
	};

	const shareSwagger = async (swaggerId, email) => {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};
		try {
			const res = await axios.put(
				'/api/contract/share',
				{ swaggerId, email },
				config
			);
			dispatch({ type: SHARE_SWAGGER, payload: res.data });
		} catch (error) {
			dispatch({ type: SWAGGER_ERROR, payload: error.response.data.errors });
		}
	};

	const setCurrentSwagger = swagger => {
		dispatch({ type: SET_CURRENT_SWAGGER, payload: swagger });
	};

	const clearCurrentSwagger = () => {
		dispatch({ type: CLEAR_CURRENT_SWAGGER });
	};

	const clearSwaggerErrors = () => {
		dispatch({ type: CLEAR_SWAGGER_ERRORS });
	};

	return (
		<SwaggerContext.Provider
			value={{
				swaggers: state.swaggers,
				currentSwagger: state.currentSwagger,
				currentEndpoint: state.currentEndpoint,
				currentDefinition: state.currentDefinition,
				loading: state.loading,
				error: state.error,
				getSwaggers,
				addSwagger,
				deleteSwagger,
				updateSwagger,
				setCurrentSwagger,
				clearCurrentSwagger,
				clearSwaggers,
				clearSwaggerErrors,
				shareSwagger
			}}
		>
			{props.children}
		</SwaggerContext.Provider>
	);
};

export default SwaggerState;
