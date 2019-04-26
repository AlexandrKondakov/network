import React from 'react'
import PropTypes from 'prop-types'
import './Auth.scss'

export class Auth extends React.Component {

  state = {
    email: '',
    pass: '',
    name: '',
    errorMessage: ''
  }

  inputChange = e => {
    this.setState({[e.target.getAttribute('name')] : e.target.value})
  }

  submitFunction = async e => {
    e.preventDefault()

    const fieldsIsRequired = this.props.needNameField
      ? !this.state.email || !this.state.pass || !this.state.name
      : !this.state.email || !this.state.pass

    if (fieldsIsRequired) return this.setState({errorMessage: 'Заполните все поля!'})

    this.setState({errorMessage: ''})

    this.props.submitFunction(
      this.props.submitUrl, {email: this.state.email.trim(), pass: this.state.pass, name: this.state.name.trim()}
    )
  }

  render() {
    return (
      <div className={`auth-form-${ this.props.formClass } auth-form`}>

        <p className="auth-form__caption">{ this.props.captionText }</p>

        <p className="auth-form__error">{ this.state.errorMessage && this.state.errorMessage }</p>

        <form autoComplete="off" onSubmit={ this.submitFunction }>
          {this.props.needNameField &&
            <input
              className="ui-input"
              type="text"
              name="name"
              placeholder="имя"
              onChange={ this.inputChange }
              maxLength="30" autoComplete="off"
            />
          }
          <input
            className="ui-input"
            type="text"
            name="email"
            placeholder="email"
            onChange={ this.inputChange }
            maxLength="30" autoComplete="off"
          />
          <input
            className="ui-input"
            type="password"
            name="pass"
            placeholder="пароль"
            onChange={ this.inputChange }
            maxLength="30" autoComplete="off"
          />
          <button className="ui-button" disabled={this.props.isDisabled} type="submit">
            { this.props.buttonText }
          </button>
        </form>
        
      </div>
    )
  }
}

Auth.propTypes = {
  formClass: PropTypes.string.isRequired,
  captionText: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  submitUrl: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  needNameField: PropTypes.bool
}