import React from 'react'
import { Route, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import './UserPage.scss'
import { appName } from '../../helpers'
import { Settings } from '../settings'
import { UserSearch } from '../userSearch'
import { Messages } from '../messages'
import { Contacts } from '../contacts'
import emptyAva from '../../img/emptyAva.png'

export class UserPage extends React.Component {

  componentDidMount = () => {
    document.querySelector('title').innerText = this.props.userData.name
  }

  componentWillUnmount = () => {
    document.querySelector('title').innerText = appName
  }

  render() {
    const { avatarLink, id } = this.props.userData

    const navList = [
      {path: 'messages', title: 'Сообщения'},
      {path: 'contacts', title: 'Контакты'},
      {path: 'search', title: 'Поиск'},
      {path: 'settings', title: 'Настройки'}
    ].map((i, idx) =>
      <li key={idx}><NavLink activeClassName="active-link" to={`/${id}/${i.path}`}>{i.title}</NavLink></li>
    )

    return (
      <div className="user-page">
        <div className="user-page__nav">
          <ul>{ navList }</ul>
        </div>
        <div className="user-page__wrap">
          <div
            className="user-page__ava"
            style={{backgroundImage: `url(${avatarLink ? avatarLink : emptyAva})`}}
          />
          <div className="user-page-content">
            <div className="user-page-content__inner">
              <Route path={`/${id}/messages`} component={ Messages }/>
              <Route path={`/${id}/contacts`} component={ Contacts }/>
              <Route path={`/${id}/search`} component={ UserSearch }/>
              <Route path={`/${id}/settings`} component={ Settings }/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

UserPage.propTypes = {
  userData: PropTypes.object.isRequired,
}