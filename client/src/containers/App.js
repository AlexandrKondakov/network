import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { CustomHeader } from '../components/header'
import { UserPage } from '../components/userPage'
import { Page404 } from '../components/404'
import { Auth } from '../components/auth'
import { api, sendAjax } from '../helpers'

import {
  setIsLoggedIn,
  setAvatarLink,
  setUserName,
  setToken,
  setId
} from '../actions/UserActions'

import './App.scss'

class App extends Component {
  state = {
    disableSubmitButtons: false,
    errorResponse: false,
    serverMessage: '',
    pageLoadingState: true,
  }

  componentDidCatch(err, info) {
    console.log(`Error: ${err}. Info: ${info}`)
  }

  componentDidMount() {
    this.initApp()
  }

  initApp() {
    this.setTokenFromLocalStorage()
      .then(() => {
        this.callMainApi()
          .then(res => {
            const path = window.location.pathname, id = path.split('/confirm/')[1]

            this.checkResponseSetProps(res)
            this.props.setIsLoggedInAction(res.isLoggedIn)
            this.setState({pageLoadingState: false})

            if (path.includes('/confirm/') && id.length > 5 && id.length < 50) this.confirmNewUser(id)
          })
          .catch(err => console.log(err))
      })
  }

  confirmNewUser = async (id) => {
    const response = await sendAjax('confirm', {id})
    const body = await response.json()

    if (body.error) {
      this.setState({
        serverMessage: body.message,
        errorResponse: !!body.error
      })
    }
  }

  setTokenFromLocalStorage = async () => {
     if (localStorage.getItem('token')) await this.props.setTokenAction(localStorage.getItem('token'))
  }

  checkResponseSetProps(res) {
    if (res.message) this.setState({serverMessage: res.message})

    if (res.userData) {
      res.userData.name && this.props.setUserNameAction(res.userData.name)
      res.userData.id && this.props.setUserIdAction(res.userData.id)
      res.userData.avatarLink && this.props.setAvatarLinkAction(res.userData.avatarLink)
    }
  }

  callMainApi = async () => {
    const response = await fetch(api, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': this.props.user.token
      })
    })

    const body = await response.json()

    if (response.status !== 200) throw Error(body.message)
    return body
  }

  submitUserData = async (url, payload) => {
    this.setState({disableSubmitButtons: true})

    const response = await sendAjax(url, payload)
    const body = await response.json()

    this.checkResponseSetProps(body)

    if (body.token) {
      localStorage.setItem('token', body.token)
      this.props.setTokenAction(body.token)
    }

    this.props.setIsLoggedInAction(body.isLoggedIn ? body.isLoggedIn : false)

    this.setState({
      disableSubmitButtons: false,
      errorResponse: !!body.error
    })
  }

  render() {
    const { user, common } = this.props

    const auth = (
      <div>
        <div className={this.state.errorResponse ? 'auth__message auth__message-error' : 'auth__message'}>
          { this.state.serverMessage }
        </div>
        <Auth
          submitFunction={this.submitUserData}
          submitUrl="auth"
          formClass="auth"
          captionText="Авторизация"
          buttonText="Войти"
          isDisabled={this.state.disableSubmitButtons}
        />
      </div>
    )

    const authPage = (
      <div className="auth">
        {auth}
        <Auth
          submitFunction={this.submitUserData}
          submitUrl="register"
          formClass="reg"
          captionText="Регистрация"
          buttonText="Отправить"
          isDisabled={this.state.disableSubmitButtons}
          needNameField={true}
        />
      </div>
    )

    const content = (
      <Switch>
        <Route exact path='/'
          render={() => user.isLoggedIn ? <Redirect to={`/${user.id}/messages`} /> : authPage}
        />
        <Route path='/confirm'
          render={() => user.isLoggedIn ? <Redirect to={`/${user.id}/messages`} /> : auth}
        />
        <Route path={`/${user.id}`}
          render={() => user.isLoggedIn ? <UserPage className="user-page" userData={user}/> : <Redirect to='/'/>}
        />
        <Route component={ Page404 }/>
      </Switch>
    )

    return (
      <Router>
        <div className="App">
          <CustomHeader
            logoutAction={ this.props.setIsLoggedInAction }
            userData={ user }
          />
          <div className="container">{this.state.pageLoadingState ? '' : content}</div>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = store => {
  return {
    user: store.user,
    common: store.common,
  }
}

const mapDispatchToProps = dispatch => ({
  setIsLoggedInAction: isLoggedIn => dispatch(setIsLoggedIn(isLoggedIn)),
  setUserNameAction: userName => dispatch(setUserName(userName)),
  setTokenAction: token => dispatch(setToken(token)),
  setUserIdAction: id => dispatch(setId(id)),
  setAvatarLinkAction: link => dispatch(setAvatarLink(link)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
