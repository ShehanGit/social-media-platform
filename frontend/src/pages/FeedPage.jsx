import React from 'react';
import NavBar from '../components/NavBar';
import PostFeed from '../components/PostFeed';

const FeedPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <NavBar />
      <main className="container mx-auto py-6">
        <PostFeed />
      </main>
    </div>
  );
};

export default FeedPage;