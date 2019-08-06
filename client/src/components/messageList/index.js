import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import {sendAjax, formatDate, sendSocketMessage, socket} from '../../helpers'
import { setInformer } from '../../actions/CommonActions'
import './MessageList.scss'

class MessageList extends React.Component {

  state = {
    messages: [],
    message: ''
  }

  componentDidMount() {
    const { chatId, partnerId } = this.props.chat

    sendAjax('getMessages', {chatId})
      .then(res => res.json() )
      .then(body => {
        if (body.error) return this.props.informerAction({text: body.message, isError: true})
        this.setState({messages: body.messages.sort((a, b) =>  b.date - a.date )})
        socket.on('newMessage', mes => {
          if (mes.fromId === partnerId) this.setState(state => ({ messages: [mes, ...state.messages]}))
        })
      })
  }



  sendMessage = async e => {
    e.preventDefault()

    const { message } = this.state
    const { id } = this.props.user
    const { chatId, partnerId } = this.props.chat

    if (!message) { return }
    if (message.length > 350) return this.props.informerAction({text: 'Сообщение слишком длинное', isError: true})

    const newMessageObj = { chatId, fromId: id, text: message, date: Date.now() }

    sendSocketMessage(id, partnerId, message)
    this.setState(state => ({ messages: [newMessageObj, ...state.messages], message: ''}))
  }

  render() {
    const { partnerName } = this.props.chat
    const { id } = this.props.user
    const list = this.state.messages.map((mes, idx) =>
      <li className="message-list__item" key={idx}>
        <span className="message-list__item-info">
          <span className="message-list__item-name">{mes.fromId === id ? 'Вы' : partnerName}</span>
          <span className="message-list__item-date">{ formatDate(mes.date) }</span>
        </span>
        <span className="message-list__item-text">{mes.text}</span>
      </li>
    )
    return (
      <div className="message-list">
        <NavLink className="message-list__back" to={`/${id}/messages`}>Вернуться к чатам</NavLink>
        <form onSubmit={this.sendMessage}>
          <textarea maxLength="350"
            value={this.state.message} onChange={e => { this.setState({message: e.target.value}) }}
          />
          <button className="ui-button ui-button_small">Отправить</button>
        </form>
        <ul>{ list }</ul>
      </div>
    )
  }
}

MessageList.propTypes = {
  chat: PropTypes.shape({
    chatId: PropTypes.string.isRequired,
    partnerName: PropTypes.string.isRequired,
    partnerId: PropTypes.string.isRequired
  })
}

const mapStateToProps = store => ({user: store.user})
const mapDispatchToProps = dispatch => ({
  informerAction: text => dispatch(setInformer(text)),
})
export default connect(mapStateToProps, mapDispatchToProps)(MessageList)