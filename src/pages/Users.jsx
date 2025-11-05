import React from 'react';
import UserCard from '../components/UserCard';
import { GlobalContext } from '../context/GlobalState';

function Users() {
  const { state } = React.useContext(GlobalContext);
  const searchText = state.searchText || "";

  const filteredUsers = searchText
    ? state.users.filter(user =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : state.users;

  return (<div>
    <h1>Users</h1>
    {filteredUsers.map(user => (
      <UserCard key={user.id} user={user} />
    ))}
  </div>
  );
}

export default Users;
