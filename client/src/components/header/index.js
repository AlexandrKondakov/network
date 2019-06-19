import React from 'react'
import './Header.scss'
import { appName, sendAjax } from '../../helpers'
import { connect } from 'react-redux'
import { setIsLoggedIn } from '../../actions/UserActions'
import { setInformer } from '../../actions/CommonActions'

class Header extends React.Component {

	state = {
		userListIsOpen: false,
	}

	componentDidUpdate() {
		const { user, common, informerAction } = this.props

		if (common.informer.text) setTimeout(() => {informerAction({text: '', isError: false})}, 5000)

		document.querySelector('title').innerText = user.isLoggedIn ? user.name : appName
	}

	logout = () => {
		if (localStorage.getItem('token')) localStorage.removeItem('token')
		this.props.isLoggedInAction(false)
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

	getInformerClassList = () => {
		const { text, isError } = this.props.common.informer
		return `${text && 'informer_show'} ${isError ? 'informer_error' : ''} informer`
	}

	render() {
		const { user, common } = this.props
		return (
			<div className="header-wrapper">
				<header className="header">
					<div className="logo">{ appName }</div>
					{user.isLoggedIn &&
						<div className="navigation">
							<div className="user">
								<span
									className="user-name"
									onClick={() => { this.toggleUserList(true) }}
								>{ user.name }</span>
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
				<div className={ this.getInformerClassList() }>
					{common.informer.isError ? `Ошибка: ${common.informer.text}` : common.informer.text }
				</div>
			</div>
		)
	}
}

const mapStateToProps = store => ({user: store.user, common: store.common})
const mapDispatchToProps = dispatch => ({
	isLoggedInAction: isLoggedIn => dispatch(setIsLoggedIn(isLoggedIn)),
	informerAction: text => dispatch(setInformer(text)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
