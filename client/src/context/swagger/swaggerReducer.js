import {
	ADD_SWAGGER,
	DELETE_SWAGGER,
	UPDATE_SWAGGER,
	SET_CURRENT_SWAGGER,
	CLEAR_CURRENT_SWAGGER,
	SWAGGER_ERROR,
	GET_SWAGGERS,
	CLEAR_SWAGGERS,
	CLEAR_SWAGGER_ERRORS,
	SHARE_SWAGGER
} from '../types';

export default (state, action) => {
	switch (action.type) {
		case GET_SWAGGERS:
			return {
				...state,
				swaggers: action.payload,
				loading: false
			};
		case ADD_SWAGGER:
			return {
				...state,
				swaggers: [action.payload, ...state.swaggers],
				loading: false
			};
		case DELETE_SWAGGER:
			return {
				...state,
				swaggers: state.swaggers.filter(
					swagger => swagger._id !== action.payload
				),
				loading: false
			};
		case SHARE_SWAGGER:
		case UPDATE_SWAGGER:
			return {
				...state,
				swaggers: state.swaggers.map(swagger =>
					swagger._id === action.payload._id ? action.payload : swagger
				),
				loading: false
			};
		case SET_CURRENT_SWAGGER:
			return {
				...state,
				currentSwagger: action.payload
			};
		case CLEAR_CURRENT_SWAGGER:
			return {
				...state,
				currentSwagger: null
			};
		case SWAGGER_ERROR:
			return {
				...state,
				error: action.payload
			};
		case CLEAR_SWAGGERS:
			return {
				...state,
				swaggers: null,
				error: null,
				currentDefinition: null,
				currentSwagger: null,
				currentEndpoint: null
			};
		case CLEAR_SWAGGER_ERRORS:
			return {
				...state,
				error: null
			};
		default:
			return state;
	}
};
