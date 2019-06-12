import React from 'react'
import { Route, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import Settings from '../settings'
import UserSearch from '../userSearch'
import { Messages } from '../messages'
import Contacts from '../contacts'
import emptyAva from '../../img/emptyAva.png'
import './UserPage.scss'

const UserPage = props => {
  const { avatarLink, id } = props.user

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
            <Route path={`/${id}/messages`} render={() => <Messages /> }/>
            <Route path={`/${id}/contacts`} render={() => <Contacts /> }/>
            <Route path={`/${id}/search`} render={() => <UserSearch /> }/>
            <Route path={`/${id}/settings`} render={() => <Settings /> }/>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = store => ({user: store.user})

export default connect(mapStateToProps)(UserPage)