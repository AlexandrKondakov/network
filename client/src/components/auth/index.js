import React from 'react'
import PropTypes from 'prop-types'
import './Auth.scss'

export class Auth extends React.Component {

  state = {
    login: '',
    pass: '',
    errorMessage: ''
  }

  inputChange = e => {
    this.setState({[e.target.getAttribute('name')] : e.target.value})
  }

  submitFunction = async e => {
    e.preventDefault()

    if(this.state.login == '' || this.state.pass == ''){
      return this.setState({errorMessage: 'Заполните все поля!'})
    }
    else this.setState({errorMessage: ''})

    this.props.submitFunction(this.props.submitUrl, {login: this.state.login, pass: this.state.pass})
  }

  render() {
    return (
      <div className={`auth-form-${ this.props.formClass } auth-form`}>

        <p className="auth-form__caption">{ this.props.captionText }</p>

        <p className="auth-form__error">{ this.state.errorMessage && this.state.errorMessage }</p>

        <form autoComplete="off" onSubmit={ this.submitFunction }>
          <input type="text" name="login" placeholder="логин" onChange={ this.inputChange } />
          <input type="password" name="pass" placeholder="пароль" onChange={ this.inputChange } />
          <button disabled={this.props.isDisabled} type="submit">
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
  isDisabled: PropTypes.bool.isRequired
}