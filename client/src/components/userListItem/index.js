import React from 'react'
import './UserListItem.scss'
import emptyAva from '../../img/emptyAva.png'
import { sendAjax } from '../../helpers'

export const UserListItem = props => {
  const { id, name, avatarLink} = props.user

  const showUser = (elem) => {
    Array.from(document.querySelectorAll('.user-list-item')).forEach(el => {
      el.classList.remove('user-list-item_show')
    })

    elem.classList.add('user-list-item_show')
  }

  const addUserInContacts = async id => {
    const response = await sendAjax('addContact', {user: id})
    const body = await response.json()

    if (body.error) console.log('error')
  }

  const sendMessage = async (e, id) => {
    e.preventDefault()
    console.log(id)
  }

  return (
    <li className="user-list-item" onClick={(e) => showUser(e.currentTarget)}>
      <span className="user-list-item__name">{name}</span>
      <span className="user-list-item__actions">
        <button className="ui-button" onClick={() => addUserInContacts(id)}>Добавить в контакты</button>
        <form onSubmit={(e) => sendMessage(e, id)}>
          <textarea placeholder="Сообщение пользователю" maxLength="300"/>
          <button className="ui-button ui-button_small">Отправить</button>
        </form>
      </span>
      <span className="user-list-item__ava" style={{backgroundImage: `url(${avatarLink ? avatarLink : emptyAva})`}}/>
    </li>
  )
}