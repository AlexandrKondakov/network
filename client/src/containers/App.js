import React, { Component } from 'react'
import { connect } from 'react-redux'
import { UserPage } from '../components/userPage'
import { Auth } from '../components/auth'

import { setIsLoggedIn, setUserData } from '../actions/UserPageActions'

import './App.scss'

class App extends Component {
  state = {
    disableSubmitButtons: false,
    responseWithError: false
  }

  componentDidMount() {
    this.callMainApi()
      .then(res => this.props.setIsLoggedInAction(res.isLoggedIn))
      .catch(err => console.log(err))
  }

  callMainApi = async () => {
    const response = await fetch('/api/')
    const body = await response.json()

    if(response.status !== 200) throw Error(body.message)
    return body
  }

  submitUserLogin = async (url, formData) => {
    this.setState({disableSubmitButtons: true})

    const response = await fetch(`/api/${url}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    })

    const body = await response.json()

    this.props.setUserDataAction(body.userData)

    this.props.setIsLoggedInAction(body.isLoggedIn ? body.isLoggedIn : false)

    this.setState(
      {
        disableSubmitButtons: false,
        responseWithError: body.error ? true : false
      }
    )
  }

  render() {
    const { userPage, setIsLoggedInAction, setUserDataAction } = this.props

    return (
      <div className="App">
        {userPage.isLoggedIn ?

          ( <div className="user-page">
              <UserPage name={ userPage.userData.name } />
            </div>
          ) :

          ( <div className="auth">              
              <div className={this.state.responseWithError ? 'auth__message auth__message-error' : 'auth__message'}>
                { userPage.userData && userPage.userData.message ? 
                  userPage.userData.message : 
                  'Авторизуйтесь, или зарегистрируйтесь'}
              </div>
              <Auth 
                submitFunction={this.submitUserLogin} 
                submitUrl="auth" 
                formClass="auth" 
                captionText="Авторизация" 
                buttonText="Войти" 
                isDisabled={this.state.disableSubmitButtons}
              />
              <Auth 
                submitFunction={this.submitUserLogin} 
                submitUrl="registr" 
                formClass="reg" 
                captionText="Регистрация" 
                buttonText="Отправить" 
                isDisabled={this.state.disableSubmitButtons}
              />
            </div>
          )
        }
      </div>
    )
  }
}

const mapStateToProps = store => {
  return {
    userPage: store.userPage
  }
}

const mapDispatchToProps = dispatch => ({
    setIsLoggedInAction: isLoggedIn => dispatch(setIsLoggedIn(isLoggedIn)),
    setUserDataAction: userData => dispatch(setUserData(userData))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
