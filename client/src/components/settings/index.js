import React from 'react'
import { connect } from 'react-redux'
import './Settings.scss'
import { sendAjax, spaceNormalize } from '../../helpers'
import { setAvatarLink, setUserName } from '../../actions/UserActions'
import { setInformer } from '../../actions/CommonActions'

class Settings extends React.Component {

  state = {
    userData: {
      name: '',
      email: '',
      pass: '',
      ava: null
    },
    passConfirm: '',
  }

  loadAva = (file) => {
    if (file[0] && file[0].size > 3000000) {
      return this.props.informerAction({text: 'Максимальный размер файла 3 мб', isError: true})
    }

    const userData = {...this.state.userData}
    userData.ava = file[0]
    this.setState({userData})
  }

  sendSettings = async e => {
    e.preventDefault()

    const { userData } = this.state

    if (userData.pass !== this.state.passConfirm) { return }

    const payload = new FormData()

    for (let key in userData) {
      if (userData[key]) {
        typeof userData[key] === 'string'
          ? payload.append(key, spaceNormalize(userData[key]))
          : payload.append(key, userData[key])
      }
    }

    const response = await sendAjax('settings', payload, true)
    const body = await response.json()

    const setNewStoreProps = user => {
      if (user.name) this.props.userNameAction(user.name)
      if (user.avatarLink) this.props.avatarLinkAction(user.avatarLink)
    }

    if (body.error) return this.props.informerAction({text: body.message, isError: true})

    if (body.userData) setNewStoreProps(body.userData)
    this.props.informerAction({text: body.message, isError: false})
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
            <span>Имя</span>
            <input
              maxLength="30" autoComplete="off" className="ui-input"
              onChange={(e) => { this.changeUserDataProp('name', e) }}
            />
          </label>
          <label>
            <span>Почта</span>
            <input
              maxLength="30" autoComplete="off" className="ui-input"
              onChange={(e) => { this.changeUserDataProp('email', e) }}
            />
          </label>
          <label>
            <span>Новый пароль</span>
            <input
              maxLength="30" autoComplete="off" className="ui-input"
              onChange={(e) => { this.changeUserDataProp('pass', e) }}
            />
          </label>
          <label>
            <span>Повторите пароль</span>
            <input
              maxLength="30" autoComplete="off" className="ui-input"
              onChange={(e) => { this.changeUserDataProp('passConfirm', e) }}
            />
          </label>
          <label className="file-wrapper ui-input ">
            <input type="file" accept=".jpg, .jpeg, .png" onChange={(e) => this.loadAva(e.target.files)}/>
            <span className="file">{this.state.userData.ava ? 'Файл прикреплен' : 'Загрузить аватар'}</span>
          </label>
         <div><button className="ui-button">Отправить</button></div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = store => ({user: store.user})

const mapDispatchToProps = dispatch => ({
  userNameAction: userName => dispatch(setUserName(userName)),
  avatarLinkAction: link => dispatch(setAvatarLink(link)),
  informerAction: text => dispatch(setInformer(text)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings)
