import React from 'react';
import { GlobalContext } from '../context/GlobalState';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import Feed from '../components/Feed';
import Side from '../components/Side';

function Home() {
  const { state } = React.useContext(GlobalContext);

  if (state.loading) return <p>Loading posts...</p>;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <CreatePost />
        <Feed />
      </div>
      <Side />
    </div>
  );
}

export default Home;
