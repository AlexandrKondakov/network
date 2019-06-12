import React from 'react'
import { connect } from 'react-redux'
import UserListItem from '../userListItem'

const Contacts = props => {
  const { contacts } = props.user

  return (
    <ul className="contacts">
      { contacts.length
        ? contacts.map((user, idx) => <UserListItem user={user} key={idx} isRemoveUser={true}/>)
        : 'У вас нет контактов' }
    </ul>
  )
}

const mapStateToProps = store => ({user: store.user})

export default connect(mapStateToProps)(Contacts)
