import React from 'react'
import { connect } from 'react-redux'
import UserListItem from '../userListItem'
import './UserSearch.scss'
import { sendAjax, spaceNormalize } from '../../helpers'
import { setInformer } from '../../actions/CommonActions'

class UserSearch extends React.Component {

  state = {
    userForSearch: '',
    foundUsers: [],
  }

  changeUserForSearch = e => {
    this.setState({userForSearch: e.target.value})
  }

  searchUsers = async e => {
    e.preventDefault()

    if (!this.state.userForSearch) return this.setState({foundUsers: []})

    const response = await sendAjax('findUser', {user: spaceNormalize(this.state.userForSearch)})
    const body = await response.json()

    if (body.error) return this.props.informerAction({text: body.message, isError: true})

    if (!body.usersList.length) {
      this.setState({foundUsers: []})
      return this.props.informerAction({text: 'Пользователи не найдены', isError: false})
    }

    this.setState({foundUsers: body.usersList})
  }

  render() {
    const usersList = this.state.foundUsers.map((user, idx) => (
      <UserListItem user={user} key={idx} isRemoveUser={false} />
    ))

    return (
      <div className="users-search">
        <form onSubmit={ this.searchUsers } className="users-search__form">
          <input
            className="users-search__searching" type="text"
            autoComplete="off" maxLength="40" placeholder="Введите имя пользователя"
            ref="searchInput" onChange={this.changeUserForSearch}
          />
          <button className="users-search__submit" />
        </form>
        <ul>{ this.state.foundUsers.length ? usersList : '' }</ul>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  informerAction: text => dispatch(setInformer(text)),
})

export default connect(null, mapDispatchToProps)(UserSearch)




