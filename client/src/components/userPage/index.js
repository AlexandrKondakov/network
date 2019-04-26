import React from 'react'
import PropTypes from 'prop-types'
import './UserPage.scss'
import { api, appName } from '../../config'
import { Settings } from '../settings'
import { UsersSearch } from '../usersSearch'
import emptyAva from '../../img/emptyAva.png'

export class UserPage extends React.Component {

  state = {
    componentId: 3
  }

  componentDidMount() {
    document.querySelector('title').innerText = this.props.userData.name
  }

  componentWillUnmount() {
    document.querySelector('title').innerText = appName
  }

  chooseContent(id) {
    this.setState({componentId: id})
  }

  render() {
    const components = [
      'test',
      'test1',
      'test2',
      <UsersSearch />,
      <Settings />
    ]
    const navList = ['Задачи', 'Сообщения', 'Контакты', 'Поиск', 'Настройки']
      .map((item, idx) => <li key={idx} onClick={() => this.chooseContent(idx)}>{ item }</li>)

    return (
      <div className="user-page">
        <ul className="user-page__nav">{ navList }</ul>
        <div className="user-page__ava">
          <img src={emptyAva} alt="avatar"/>
        </div>
        <div className="user-page-content">
          <div className="user-page-content__inner">
            {components[this.state.componentId]}
          </div>
        </div>
      </div>
    )
  }
}

UserPage.propTypes = {
  userData: PropTypes.object.isRequired,
}