import React, { Component } from 'react'
import { connect } from 'react-redux' //для связки стора с приложухой
import { UserPage } from '../components/userPage'
import { Auth } from '../components/auth'
// actions
import { setName } from '../actions/UserPageActions'

import './App.scss'

class App extends Component {
  state = {
    isLoggedIn: Boolean,
    userData: null,
    disableSubmitButtons: false,
    responseWithError: false
  }

  componentDidMount() {
    this.callMainApi()
      .then(res => this.setState({ isLoggedIn: res.isLoggedIn }))
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
    this.setState(
      {
        userData: body.userData, 
        isLoggedIn: body.isLoggedIn ? body.isLoggedIn : false, disableSubmitButtons: false,
        responseWithError: body.error ? true : false
      }
    )
  }

  render() {
    const { userPage, setNameAction } = this.props

    return (
      <div className="App">
        {this.state.isLoggedIn ?

          ( <div className="user-page">
              <UserPage name={userPage.name} setName={setNameAction} />
            </div>
          ) :

          ( <div className="auth">              
              <div className={this.state.responseWithError ? 'auth__message auth__message-error' : 'auth__message'}>
                { this.state.userData && this.state.userData.message ? 
                  this.state.userData.message : 
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
// пробрасывает данные redux в пропсы приложения
const mapStateToProps = store => {
  return {
    userPage: store.userPage
  }
}
// для диспетчеризации экшнов
const mapDispatchToProps = dispatch => ({
    setNameAction: name => dispatch(setName(name))
})
// подключение функции в приложение
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
