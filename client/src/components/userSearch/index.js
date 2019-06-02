import React from 'react'
import { UserListItem } from '../userListItem'
import './UserSearch.scss'
import { sendAjax, spaceNormalize } from '../../helpers'

export class UserSearch extends React.Component {

  state = {
    userForSearch: '',
    foundUsers: [],
    errorResponse: false,
    info: '',
  }

  changeUserForSearch = e => {
    this.setState({userForSearch: e.target.value})
  }

  searchUsers = async e => {
    e.preventDefault()

    if (!this.state.userForSearch) return this.setState({foundUsers: []})

    const response = await sendAjax('findUser', {user: spaceNormalize(this.state.userForSearch)})
    const body = await response.json()

    if (body.error) {
      return this.setState({
        info: body.message,
        errorResponse: !!body.error
      })
    }

    if (!body.usersList.length) {
      return this.setState({
        foundUsers: [],
        info: 'Пользователи не найдены...',
        errorResponse: false
      })
    }

    this.setState({
      info: '',
      errorResponse: false,
      foundUsers: body.usersList
    })
  }

  render() {
    const usersList = this.state.foundUsers.map((user, idx) => <UserListItem user={user} key={idx}/>)

    return (
      <div className="users-search">
        <form onSubmit={ this.searchUsers }>
          <input
            className="users-search__searching" type="text"
            autoComplete="off" maxLength="40" placeholder="Введите имя пользователя"
            ref="searchInput" onChange={this.changeUserForSearch}
          />
          <button className="users-search__submit" />
        </form>
        <ul>{this.state.foundUsers.length ? usersList : <li>{this.state.info}</li>}</ul>
      </div>
    )
  }
}





