import React from 'react'
import { sendAjax } from '../../helpers'
import emptyAva from '../../img/emptyAva.png'

export class Contacts extends React.Component {

  componentDidMount() {
    this.getContacts()
  }

  getContacts = async () => {
    const response = await sendAjax('getContacts')
    const body = await response.json()

  }

  render() {
    return (
      <div className="contacts">
        Contacts
      </div>
    )
  }
}
