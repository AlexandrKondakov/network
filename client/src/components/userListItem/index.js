import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import './UserListItem.scss'
import emptyAva from '../../img/emptyAva.png'
import { sendAjax } from '../../helpers'
import { setInformer } from '../../actions/CommonActions'

const UserListItem = props => {
  const { id, name, avatarLink } = props.user

  let message = ''

  useEffect(() => {
    const queryElem = document.querySelector(`[data-id="${id}"]`)

    if (queryElem.classList.contains('user-list-item_show')) queryElem.classList.remove('user-list-item_show')
  })

  const showUser = (elem) => {
    Array.from(document.querySelectorAll('.user-list-item')).forEach(el => {
      el.classList.remove('user-list-item_show')
    })

    elem.classList.add('user-list-item_show')
  }

  const userAction = async id => {
    const response = await sendAjax(props.isRemoveUser ? 'removeContact' : 'addContact', {user: id})
    const body = await response.json()

    if (body.error) return props.informerAction({text: body.message, isError: true})

    props.informerAction({text: body.message, isError: false})
  }

  const sendMessage = async (e, id) => {
    e.preventDefault()

    if (!message) { return }

    const response = await sendAjax('sendMessage', {message, user: id})
    const body = await response.json()

    if (body.error) return props.informerAction({text: body.message, isError: true})

    props.informerAction({text: body.message, isError: false})
  }

  const changeMessage = e => { message = e.currentTarget.value }

  return (
    <li className="user-list-item" data-id={id} onClick={(e) => showUser(e.currentTarget)}>
      <span className="user-list-item__name">{name}</span>
      <span className="user-list-item__actions">
        <button className="ui-button" onClick={() => userAction(id)}>
          {props.isRemoveUser ? 'Удалить из контактов' : 'Добавить в контакты'}
        </button>
        <form onSubmit={(e) => sendMessage(e, id)}>
          <textarea placeholder="Сообщение пользователю" onChange={(e) => changeMessage(e)} maxLength="300"/>
          <button className="ui-button ui-button_small">Отправить</button>
        </form>
      </span>
      <span className="user-list-item__ava" style={{backgroundImage: `url(${avatarLink ? avatarLink : emptyAva})`}}/>
    </li>
  )
}

const mapDispatchToProps = dispatch => ({
  informerAction: text => dispatch(setInformer(text)),
})

export default connect(null, mapDispatchToProps)(UserListItem)