import React from 'react'
import { connect } from 'react-redux'
import { Route, NavLink } from 'react-router-dom'
import { setInformer } from '../../actions/CommonActions'
import { sendAjax, formatDate, socket } from '../../helpers'
import MessageList from '../messageList'
import emptyAva from '../../img/emptyAva.png'
import './Messages.scss'

class Messages extends React.Component {

  state = {
    chats: [],
    chatId: this.props.location.pathname.split('messages/')[1] || '',
    partnerName: '',
    partnerId: '',
    noMessages: false
  }

  componentDidMount() {
    sendAjax('getChats')
      .then(res => res.json() )
      .then(body => {
        if (body.error) return this.props.informerAction({text: body.message, isError: true})
        if (!body.userChats.length) this.setState({noMessages: true})
        this.setState({chats: body.userChats})

        socket.on('newMessage', mes => { this.updateLastChatMessage(mes) })

        if (this.state.chatId) {
          const { partnerName, partnerId } = body.userChats.find(chat => chat.chatId === this.state.chatId)
          this.setState({partnerName, partnerId})
        }
      })
  }

  updateLastChatMessage = ({ chatId = '', fromId = '', message = '', date = 0 } = {}) => {
    const { chats } = this.state
    const mutableChat = {chatId, messageFromId: fromId, text: message, date}

    if (chats.length) {
      chats.some((chat, idx)  => {
        if (chat.chatId === chatId) {
          mutableChat.partnerName = chat.partnerName
          mutableChat.partnerAvatar = chat.partnerAvatar
          chats.splice(idx, 1)
        }
      })
    }

    this.setState({chats: [mutableChat, ...chats], noMessages: false})
  }

  setChatState = ({chatId, partnerName, partnerId} = {}) => {
    this.setState({chatId, partnerName, partnerId})
  }

  render() {
    const { id } = this.props.user

    const chats = this.state.chats.map((chat, idx) =>
      <li className="chat" key={idx} onClick={() => { this.setChatState(chat) }}>
        <NavLink className="chat-link" to={`/${id}/messages/${chat.chatId}`}>
          <span className="chat__ava" style={{backgroundImage: `url(${chat.partnerAvatar || emptyAva})`}}/>
          <span className="chat__content">
            <span className="chat__content-name">{chat.partnerName}</span>
            <span className="chat__content-message">
              {chat.messageFromId === this.props.user.id && 'Вы: '}
              {chat.text}
            </span>
          </span>
          <span className="chat__date">{ formatDate(chat.date) }</span>
        </NavLink>
      </li>
    )

    const { chatId, partnerName, partnerId } = this.state

    return (
      <div className="messages">
        <Route exact path={`/${id}/messages`}
          render={() => this.state.noMessages ? 'У вас пока нет сообщений' : <ul>{chats}</ul> }
        />
        <Route path={`/${id}/messages/:chatId`}
           render={() => <MessageList chat={{chatId, partnerName, partnerId}}/>}
        />
      </div>
    )
  }
}

const mapStateToProps = store => ({user: store.user})
const mapDispatchToProps = dispatch => ({
  informerAction: text => dispatch(setInformer(text)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Messages)
