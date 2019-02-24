import React from 'react'
import PropTypes from 'prop-types'

export class UserPage extends React.Component {
  render() {
    return (
      <div className="user-page">
        <p>Привет, { this.props.name }!</p>

        
      </div>
    )
  }
}

UserPage.propTypes = {
  name: PropTypes.string.isRequired,
}