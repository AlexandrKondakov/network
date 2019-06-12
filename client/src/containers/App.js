import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router-dom'
import Header from '../components/header'
import UserPage from '../components/userPage'
import { Page404 } from '../components/404'
import { Auth } from '../components/auth'
import { api, sendAjax } from '../helpers'
import { setInformer } from '../actions/CommonActions'
import { setIsLoggedIn, setAvatarLink, setUserName, setToken, setId, setContacts } from '../actions/UserActions'
import './App.scss'

class App extends Component {
  state = {
    disableSubmitButtons: false,
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
            this.props.isLoggedInAction(res.isLoggedIn)
            this.setState({pageLoadingState: false})

            if (path.includes('/confirm/') && id.length > 5 && id.length < 50) this.confirmNewUser(id)
          })
          .catch(err => console.log(err))
      })
  }

  confirmNewUser = async (id) => {
    const response = await sendAjax('confirm', {id})
    const body = await response.json()

    if (body.error) return this.props.informerAction({text: body.message, isError: true})

    this.props.informerAction({text: 'Вы успешно зарегистрировались', isError: false})
  }

  setTokenFromLocalStorage = async () => {
     if (localStorage.getItem('token')) await this.props.tokenAction(localStorage.getItem('token'))
  }

  checkResponseSetProps(res) {
    if (res.userData) {
      res.userData.name && this.props.userNameAction(res.userData.name)
      res.userData.id && this.props.userIdAction(res.userData.id)
      res.userData.avatarLink && this.props.avatarLinkAction(res.userData.avatarLink)
      res.userData.contacts && this.props.setContactsAction(res.userData.contacts)
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

    this.setState({disableSubmitButtons: false})
    if (body.error) return this.props.informerAction({text: body.message, isError: true})

    this.checkResponseSetProps(body)

    if (body.token) {
      localStorage.setItem('token', body.token)
      this.props.tokenAction(body.token)
    }

    this.props.isLoggedInAction(body.isLoggedIn ? body.isLoggedIn : false)
    this.props.informerAction({text: body.message, isError: false})
  }

  render() {
    const { user } = this.props

    const auth = (
      <div>
        <div className="auth__message">Авторизуйтесь, или зарегистрируйтесь</div>
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
          render={() => user.isLoggedIn ? <UserPage className="user-page"/> : <Redirect to='/'/>}
        />
        <Route component={ Page404 }/>
      </Switch>
    )

    return (
      <div className="App">
        <Header />
        <div className="container">{this.state.pageLoadingState ? '' : content}</div>
      </div>
    )
  }
}

const mapStateToProps = store => ({user: store.user})
const mapDispatchToProps = dispatch => ({
  isLoggedInAction: isLoggedIn => dispatch(setIsLoggedIn(isLoggedIn)),
  userNameAction: userName => dispatch(setUserName(userName)),
  tokenAction: token => dispatch(setToken(token)),
  userIdAction: id => dispatch(setId(id)),
  avatarLinkAction: link => dispatch(setAvatarLink(link)),
  informerAction: text => dispatch(setInformer(text)),
  setContactsAction: contacts => dispatch(setContacts(contacts))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
