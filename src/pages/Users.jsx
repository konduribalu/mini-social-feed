import React from 'react';
import UserCard from '../components/UserCard';
import { GlobalContext } from '../context/GlobalState';

function Users() {
  const { state } = React.useContext(GlobalContext);

  return (<div>
    <h1>Users</h1>
    {state.users.map(user => (
      <UserCard key={user.id} user={user} />
    ))}
  </div>
  );
}

export default Users;
