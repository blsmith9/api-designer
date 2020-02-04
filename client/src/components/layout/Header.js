import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import SwaggerContext from '../../context/swagger/swaggerContext';

const Header = ({ title, icon }) => {
	const authContext = useContext(AuthContext);
	const swaggerContext = useContext(SwaggerContext);
	const { clearSwaggers } = swaggerContext;
	const { isAuthenticated, logout } = authContext;
	const onLogout = () => {
		logout();
		clearSwaggers();
	};

	const authLinks = (
		<Fragment>
			<li>
				<Link className='sidenav-close' to='/'>
					My APIs
				</Link>
			</li>
			<li>
				<Link className='sidenav-close' to='/design'>
					Design New API
				</Link>
			</li>
			<li>
				<a href='#!' className='sidenav-close' onClick={onLogout}>
					Logout
				</a>
			</li>
		</Fragment>
	);

	const guestLinks = (
		<Fragment>
			<li>
				<Link className='sidenav-close' to='/login'>
					Login
				</Link>
			</li>
		</Fragment>
	);

	return (
		<Fragment>
			<div className='navbar-fixed'>
				<nav className='blue' style={{ marginBottom: '10px' }}>
					<div className='nav-wrapper'>
						<Link to='/' className='brand-logo' style={{ paddingLeft: '10px' }}>
							<i className='material-icons'>{icon}</i>
							<span className='hide-on-med-and-down'>{title}</span>
						</Link>
						<a
							href='#!'
							data-target='mobile-sidenav'
							className='sidenav-trigger'
						>
							<i className='material-icons'>menu</i>
						</a>
						<ul id='nav-mobile' className='right hide-on-med-and-down'>
							{isAuthenticated ? authLinks : guestLinks}
						</ul>
					</div>
				</nav>
			</div>
			<ul className='sidenav' id='mobile-sidenav' style={{ width: '50%' }}>
				{isAuthenticated ? authLinks : guestLinks}
			</ul>
		</Fragment>
	);
};

Header.propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string
};

Header.defaultProps = {
	title: 'API Designer',
	icon: 'gamepad'
};

export default Header;
