// src/pages/Profile.tsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfileComponent from '../components/user/Profile';
import { withAuth } from '../contexts/AuthContext';
import { useAuth } from '../hooks/useAuth';
import React from 'react';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth() as any;

  return (
    <div className="container mx-auto px-4">
      <ProfileComponent username={username || user?.username} />
    </div>
  );
};

export default withAuth(Profile);