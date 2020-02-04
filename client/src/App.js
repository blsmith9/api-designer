import React, { useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import PrivateRoute from './components/routing/PrivateRoute';
import Header from './components/layout/Header';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import SwaggerState from './context/swagger/SwaggerState';
import AuthState from './context/auth/AuthState';
import setAuthToken from './utils/setAuthToken';
import SwaggerForm from './components/swagger/SwaggerForm';
import Swaggers from './components/swagger/Swaggers';

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		M.AutoInit();
	}, []);

	return (
		<AuthState>
			<SwaggerState>
				<Router>
					<Fragment>
						<Header />
						<div className='container'>
							<Switch>
								<PrivateRoute exact path='/design' component={SwaggerForm} />
								<PrivateRoute exact path='/' component={Swaggers} />
								<Route exact path='/register' component={Register} />
								<Route exact path='/login' component={Login} />
							</Switch>
						</div>
					</Fragment>
				</Router>
			</SwaggerState>
		</AuthState>
	);
};

export default App;
