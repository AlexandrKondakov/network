import React from 'react'
import './Header.scss'
import { appName, sendAjax } from '../../helpers'
import PropTypes from 'prop-types'

export class CustomHeader extends React.Component {

	state = {
		userListIsOpen: false
	}

	logout = async () => {
		const response = await sendAjax('logout')
		const body = await response.json()

		if (body.error) console.log(body.message)

		if (localStorage.getItem('token')) localStorage.removeItem('token')

		this.props.logoutAction(false)
		this.toggleUserList()
	}

	setUserListListener = (e) => {
		if (e.target !== this.refs.userNavList && e.target.parentElement !== this.refs.userNavList) {
			this.setState({userListIsOpen: false})
			document.removeEventListener('click', this.setUserListListener)
		}
	}

	toggleUserList = (open) => {
		this.setState({userListIsOpen: open})

		document[open ? 'addEventListener' : 'removeEventListener']('click', this.setUserListListener)
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
									ref="userNavList"
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