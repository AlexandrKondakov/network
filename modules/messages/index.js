const mongoose = require('mongoose')
const UserModel = require('../../dbModels/user')
const UserChatModel = require('../../dbModels/userChat')
const ChatRoomsModel = require('../../dbModels/chat')
const MessageModel = require('../../dbModels/message')
const passport = require('passport')
const { errorResponse } = require('../../helpers')

exports.subscribeToMessages = client => {
  client.on('subscribeToMessage', (fromId, toId, message) => {
    if (!fromId || !toId || !message || message.length > 350) { return }

    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      fromId,
      date: Date.now(),
      text: message
    }

    const saveNewMessage = userChatId => {
      newMessage.chatId = userChatId

      const updateChatRoom = (chatId, messageId) => {
        ChatRoomsModel.findById(chatId, (err, userChat) => {
          if (err || !userChat) return console.log('logger')

          userChat.lastMessageId = messageId
          userChat.save()
        })
      }

      new MessageModel(newMessage).save()
        .then(() => {
          updateChatRoom(userChatId, newMessage._id)

          UserModel.findById(fromId, (err, user) => {
            if (err || !user) return console.log('logger')

            client.broadcast.to(toId).emit('newMessage', {
              senderName: user.name,
              senderAvatar: user.avatarLink,
              fromId,
              text: message,
              chatId: userChatId,
              date: newMessage.date
            })
          })
        })
        .catch(() => { console.log('logger') })
    }

    const createChatRoom = () => {
      const createUserChat = chatId => {
        new UserChatModel({userId: fromId, partnerId: toId, chatId}).save()
        new UserChatModel({userId: toId, partnerId: fromId, chatId}).save()
      }

      new ChatRoomsModel({lastMessageId: newMessage._id}).save()
        .then(chatRoom => {
          createUserChat(chatRoom._id)
          saveNewMessage(chatRoom._id)
        })
        .catch(() => { console.log('logger') })
    }

    UserChatModel.find(({userId: fromId}), (err, chats) => {
      if (err) return console.log('logger')

      const chatsLength = chats.length
      if (chatsLength) {
        let hasChatWithPartner = false

        for (let i = 0; i < chatsLength; i++) {
          if (chats[i].partnerId === toId) {
            hasChatWithPartner = true
            saveNewMessage(chats[i].chatId)
            break
          }
        }
        if (!hasChatWithPartner) createChatRoom()
      }
      else createChatRoom()
    })
  })
}

exports.getChats = (req, res) => {
  passport.authenticate('jwt', (err, user) => {
    if (err || !user) return errorResponse(res)

    UserChatModel.find({userId: user._id}, async (err, chats) => {
      if (err) return errorResponse(res)

      const userChats = []

      if (chats.length) {
        for await (const chat of chats) {
          const userChat = {chatId: chat.chatId, partnerId: chat.partnerId}

          await ChatRoomsModel.findById(chat.chatId, (err, chatRoom) => {
            if (err || !chatRoom) return errorResponse(res)

            MessageModel.findById(chatRoom.lastMessageId, (err, message) => {
              if (err || !message) return errorResponse(res)

              userChat.text = message.text
              userChat.date = message.date
              userChat.messageFromId = message.fromId
            })
          })

          await UserModel.findById(chat.partnerId, (err, user) => {
            if (err || !user) return errorResponse(res)

            userChat.partnerName = user.name
            userChat.partnerAvatar = user.avatarLink
          })

          userChats.push(userChat)
        }
      }
      res.send({userChats})
    })
  })(req, res)
}

exports.getMessages = (req, res) => {
  passport.authenticate('jwt', (err, user) => {
    if (err || !user) return errorResponse(res)

    MessageModel.find({chatId: req.body.chatId}, (err, messages) => {
      if (err || !messages) return errorResponse(res)
      res.send({messages})
    })
  })(req, res)
}