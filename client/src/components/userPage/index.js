import React from 'react'
import PropTypes from 'prop-types'
import { api } from '../../config'

export class UserPage extends React.Component {
	
	logout = async () => {
		const response = await fetch(`${api}logout`, {
		 	method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: this.props.userData.id})
    })
    const body = await response.json()

    if (localStorage.getItem('token')) localStorage.removeItem('token')
    this.props.logoutAction(body.isLoggedIn)
	}

  render() {
    return (
      <div className="user-page">
        <p>Привет, { this.props.userData.name }!</p>
        <button onClick={ this.logout }>Выйти</button>
        
      </div>
    )
  }
}

UserPage.propTypes = {
  userData: PropTypes.object.isRequired,
  logoutAction: PropTypes.func.isRequired,
}