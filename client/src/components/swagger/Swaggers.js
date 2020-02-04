import React, { useContext, useEffect } from 'react';
import SwaggerContext from '../../context/swagger/swaggerContext';
import AuthContext from '../../context/auth/authContext';
import SwaggerItem from './SwaggerItem';
import Preloader from '../layout/Preloader';

const Swaggers = () => {
	const swaggerContext = useContext(SwaggerContext);
	const authContext = useContext(AuthContext);
	const { swaggers, getSwaggers, loading } = swaggerContext;

	useEffect(() => {
		authContext.loadUser();
		getSwaggers();
		// eslint-disable-next-line
	}, []);
	if (swaggers !== null && swaggers.length === 0)
		return (
			<h5 className='center' style={{ marginTop: '30%' }}>
				Add an API Design!
			</h5>
		);
	return (
		<div className='row'>
			{swaggers !== null && !loading ? (
				swaggers.map(swagger => (
					<div key={swagger._id} className='col s12 m6 l6'>
						<SwaggerItem swagger={swagger} />
					</div>
				))
			) : (
				<Preloader />
			)}
		</div>
	);
};

export default Swaggers;
