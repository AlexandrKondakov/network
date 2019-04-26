import React from 'react'
import './Header.scss'
import { api, appName } from '../../config'
import PropTypes from 'prop-types'

export class CustomHeader extends React.Component {
	constructor(props) {
		super(props)
		this.userNavList = null

		this.setNavListRef = el => {
			this.userNavList = el
		}
	}

	state = {
		userListIsOpen: false
	}

	logout = async () => {
		const response = await fetch(`${api}logout`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({id: this.props.userData.id})
		})
		const body = await response.json()

		if (localStorage.getItem('token')) localStorage.removeItem('token')
		this.props.logoutAction(body.isLoggedIn)
		this.toggleUserList()
	}

	setUserListListener = (e) => {
		if (e.target !== this.userNavList && e.target.parentElement !== this.userNavList) {
			this.setState({userListIsOpen: false})
			document.removeEventListener('click', this.setUserListListener)
		}
	}

	toggleUserList = (open) => {
		this.setState({userListIsOpen: open})

		if (open) document.addEventListener('click', this.setUserListListener)
		else document.removeEventListener('click', this.setUserListListener)
	}

	render() {
		return (
			<div className="header-wrapper">
				<header className="header">
					<div className="logo">{ appName }</div>
					{this.props.userData.isLoggedIn &&
						<div className="navigation">
							<div className="user">
								<span
									className="user-name"
									onClick={() => { this.toggleUserList(true) }}
								>{ this.props.userData.name }</span>
								<ul
									className={this.state.userListIsOpen ? 'user-list user-list__open' : 'user-list'}
									ref={this.setNavListRef}
								>
									<li onClick={ this.logout }>Выйти</li>
								</ul>
							</div>
						</div>
					}
				</header>
			</div>
		)
	}
}

CustomHeader.propTypes = {
	logoutAction: PropTypes.func.isRequired,
	userData: PropTypes.object.isRequired,
}