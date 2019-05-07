import React from 'react'
import './Settings.scss'
import {api} from '../../config'

export class Settings extends React.Component {

  state = {
    userData: {
      name: '',
      email: '',
      pass: '',
      ava: null
    },
    passConfirm: '',
    errorType: '',
    errorMessage: ''
  }

  cleanErrorState = () => {
    this.setState({errorType: '', errorMessage: ''})
  }

  loadAva = (file) => {
    if (file[0] && file[0].size > 3000000) {
      return this.setState({errorType: 'file', errorMessage: 'Максимальный размер файла 3 мб !'})
    }

    const userData = {...this.state.userData}
    userData.ava = file[0]
    this.setState({userData})
    this.cleanErrorState()
  }

  sendSettings = async e => {
    e.preventDefault()

    if (this.state.userData.pass !== this.state.passConfirm) return;

    const payload = new FormData()

    for (let key in this.state.userData) {
      if (this.state.userData[key]) payload.append(key, this.state.userData[key])
    }

    const response = await fetch(`${api}/settings`, {
      method: 'POST',
      body: payload
    })

    const body = await response.json()

    if (body.error && body.error.type) {
      return this.setState({errorType: body.error.type, errorMessage: body.message})
    }

  }

  changeUserDataProp = (prop, e) => {
    if (prop === 'passConfirm') return this.setState({passConfirm: e.target.value})

    const userData = {...this.state.userData}
    userData[prop] = e.target.value
    this.setState({userData})
  }

  render() {
    return (
      <div className="settings">
        <form onSubmit={this.sendSettings}>
          <label>
            <span className={this.state.errorType === 'name' ? 'error' : ''}>
              {this.state.errorType === 'name' ? this.state.errorMessage : 'Имя'}
            </span>
            <input
              type="text" maxLength="30" autoComplete="off"
              className="ui-input" onChange={(e) => { this.changeUserDataProp('name', e) }}
            />
          </label>
          <label>
            <span className={this.state.errorType === 'email' ? 'error' : ''}>Почта</span>
            <input
              type="email" maxLength="30" autoComplete="off"
              className="ui-input" onChange={(e) => { this.changeUserDataProp('email', e) }}
            />
          </label>
          <label>
            <span className={this.state.errorType === 'pass' ? 'error' : ''}>Новый пароль</span>
            <input
              type="pass" maxLength="30" autoComplete="off"
              className="ui-input" onChange={(e) => { this.changeUserDataProp('pass', e) }}
            />
          </label>
          <label>
            <span>Повторите пароль</span>
            <input
              type="pass" maxLength="30" autoComplete="off"
              className="ui-input" onChange={(e) => { this.changeUserDataProp('passConfirm', e) }}
            />
          </label>
          <label className="file-wrapper">
            <span className="file-wrapper__error">{this.state.errorType === 'file' && this.state.errorMessage}</span>
            <input type="file" accept=".jpg, .jpeg, .png" onChange={(e) => this.loadAva(e.target.files)}/>
            <span className="ui-input file">{this.state.userData.ava ? 'Файл прикреплен' : 'Загрузить аватар'}</span>
          </label>
         <div><button className="ui-button">Отправить</button></div>
        </form>
      </div>
    )
  }
}