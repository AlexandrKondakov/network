import React from 'react'
import PropTypes from 'prop-types'
import { spaceNormalize } from '../../helpers'
import './Auth.scss'

export class Auth extends React.Component {

  state = {
    email: '',
    pass: '',
    name: '',
    emptyFields: false
  }

  inputChange = e => {
    this.setState({[e.target.getAttribute('name')] : e.target.value})
  }

  submitFunction = async e => {
    e.preventDefault()

    const { email, pass, name } = this.state
    const fieldsIsRequired = this.props.needNameField ? !email || !pass || !name : !email || !pass

    if (fieldsIsRequired) return this.setState({emptyFields: true})

    this.setState({emptyFields: false})

    const fields = {email: spaceNormalize(email), pass: spaceNormalize(pass), name: spaceNormalize(name)}

    this.props.submitFunction(this.props.submitUrl, fields)
  }

  render() {
    return (
      <div className={`auth-form-${ this.props.formClass } auth-form`}>

        <p className="auth-form__caption">{ this.props.captionText }</p>

        <p className="auth-form__error">{ this.state.emptyFields && 'Заполните все поля!' }</p>

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
            type="email"
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