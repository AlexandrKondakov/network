import React from 'react'
import './UsersSearch.scss'
import {api} from '../../config'

export class UsersSearch extends React.Component {

  state = {
    userForSearch: '',
    foundUsers: [],
    errorResponse: false,
    message: ''
  }

  changeUserForSearch = (e) => {
    this.setState({userForSearch: e.target.value})
  }

  chooseUser = (id) => {
    console.log(id)
  }

  searchUsers = async e => {
    e.preventDefault()

    if (!this.state.userForSearch) return this.setState({foundUsers: []})

    const response = await fetch(`${api}/findUser`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user: this.state.userForSearch.trim()})
    })

    const body = await response.json()

    if (body.error) {
      return this.setState({
        message: body.message,
        errorResponse: !!body.error
      })
    }

    if (!body.usersList.length) {
      return this.setState({
        foundUsers: [],
        message: 'Пользователи не найдены...',
        errorResponse: false
      })
    }

    this.setState({
      message: '',
      errorResponse: false,
      foundUsers: body.usersList
    })
  }

  render() {
    const usersList = this.state.foundUsers.map((user, idx) => {
      return <li className='users-search__message' key={idx} onClick={() => this.chooseUser(user.id)}>{user.name}</li>
    })

    return (
      <div className="users-search">
        <form onSubmit={ this.searchUsers }>
          <input
            className="users-search__searching" type="text"
            autoComplete="off" maxLength="40" placeholder="Введите имя пользователя"
            onChange={this.changeUserForSearch}
          />
          <button className="users-search__submit"></button>
        </form>
        <ul>{this.state.foundUsers.length ? usersList : <li>{this.state.message}</li>}</ul>
      </div>
    )
  }
}





