import React from 'react'
import { connect } from 'react-redux'
import UserListItem from '../userListItem'

const Contacts = props => {
  const usersList = props.user.contacts.length
    ? props.user.contacts.map((user, idx) => <UserListItem user={user} key={idx} isRemoveUser={true}/>)
    : 'У вас нет контактов'

  return (<ul className="contacts">{ props.common.contactsIsLoading ? '' : usersList }</ul>)
}

const mapStateToProps = store => ({user: store.user, common: store.common})

export default connect(mapStateToProps)(Contacts)
