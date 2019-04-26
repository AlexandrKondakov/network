import React from 'react'
import './Settings.scss'

export class Settings extends React.Component {

  state = {
    changes: {
      name: '',
      phone: '',
      mail: '',
      ava: null,
      pass: ''
    },
    bigFileError: false
  }

  loadAva(file) {
    if (file[0].size > 3000000) return this.setState({bigFileError: true})

    const changes = {...this.state.changes}
    changes.ava = file[0]
    this.setState({bigFileError: false, changes})
  }

  render() {
    return (
      <div className="settings">
        <form>
          <label>
            <span>Имя</span>
            <input type="text" maxLength="30" autoComplete="off" className="ui-input"/>
          </label>
          <label>
            <span>Почта</span>
            <input type="mail" maxLength="30" autoComplete="off" className="ui-input"/>
          </label>
          <label>
            <span>Новый пароль</span>
            <input type="pass" maxLength="30" autoComplete="off" className="ui-input"/>
          </label>
          <label>
            <span>Повторите пароль</span>
            <input type="pass" maxLength="30" autoComplete="off" className="ui-input"/>
          </label>
          <label className="file-wrapper">
            {this.state.bigFileError && <span className="file-wrapper__error">Максимальный размер файла 3 мб !</span>}
            <span className="ui-input file">Загрузить аватар</span>
            <input type="file" accept=".jpg, .jpeg, .png" onChange={(e) => this.loadAva(e.target.files)}/>
          </label>
        </form>
      </div>
    )
  }
}