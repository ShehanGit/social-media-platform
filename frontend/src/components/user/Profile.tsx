// src/components/user/Profile.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, RelationshipStats } from '../../types';
import { usersAPI } from '../../api/users';
import PostList from '../post/PostList';
import Button from '../common/Button';
import { UserCircleIcon, MapPinIcon, LinkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import React from 'react';
import UserList from './UserList';

interface ProfileTabsProps {
  activeTab: 'posts' | 'followers' | 'following';
  onTabChange: (tab: 'posts' | 'followers' | 'following') => void;
  stats: RelationshipStats;
}

interface ProfileProps {
    username?: string;
  }

const ProfileTabs = ({ activeTab, onTabChange, stats }: ProfileTabsProps) => (
  <div className="flex border-b mb-6">
    <button
      onClick={() => onTabChange('posts')}
      className={`px-6 py-3 ${activeTab === 'posts' ? 'border-b-2 border-blue-500' : ''}`}
    >
      Posts
    </button>
    <button
      onClick={() => onTabChange('followers')}
      className={`px-6 py-3 ${activeTab === 'followers' ? 'border-b-2 border-blue-500' : ''}`}
    >
      {stats.followersCount} Followers
    </button>
    <button
      onClick={() => onTabChange('following')}
      className={`px-6 py-3 ${activeTab === 'following' ? 'border-b-2 border-blue-500' : ''}`}
    >
      {stats.followingCount} Following
    </button>
  </div>
);

const Profile: React.FC<ProfileProps> = ({ username: usernameFromProps }) => {
    const { username: usernameFromParams } = useParams<{ username?: string }>();
    const { user: currentUser } = useAuth() as any;
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<RelationshipStats>({
      followersCount: 0,
      followingCount: 0,
      isFollowing: false
    });
    const [activeTab, setActiveTab] = useState<'posts' | 'followers' | 'following'>('posts');
    const [isLoading, setIsLoading] = useState(true);
  
    // Use username from props or params
    const targetUsername = usernameFromProps || usernameFromParams;
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          setIsLoading(true);
          const userData = targetUsername
            ? await usersAPI.getUserByUsername(targetUsername)
            : await usersAPI.getCurrentUser();
          setUser(userData);
  
          const statsData = await usersAPI.getRelationshipStats(userData.id);
          setStats(statsData);
        } catch (error) {
          toast.error('Failed to load profile');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchUserData();
    }, [targetUsername]);

  const handleFollowToggle = async () => {
    if (!user) return;
    try {
      const response = await usersAPI.toggleFollow(user.id);
      setStats(response);
      toast.success(response.isFollowing ? 'Followed successfully' : 'Unfollowed successfully');
    } catch (error) {
      toast.error('Failed to update follow status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">User not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Profile Header */}
        <div className="flex items-start gap-6 mb-6">
          {user.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt={user.username}
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="w-32 h-32 text-gray-400" />
          )}
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              {currentUser?.id !== user.id && (
                <Button
                  onClick={handleFollowToggle}
                  variant={stats.isFollowing ? 'outline' : 'primary'}
                >
                  {stats.isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </div>
            
            <div className="text-gray-600 space-y-2">
              <p className="font-medium">{user.firstname} {user.lastname}</p>
              {user.bio && <p>{user.bio}</p>}
              
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-500 hover:underline"
                >
                  <LinkIcon className="w-4 h-4" />
                  {user.website}
                </a>
              )}
              
              {user.location && (
                <p className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  {user.location}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={stats}
        />

        {/* Tab Content */}
        {activeTab === 'posts' && (
          <PostList userId={user.id} />
        )}
        {activeTab === 'followers' && (
          <UserList
            userId={user.id}
            type="followers"
          />
        )}
        {activeTab === 'following' && (
          <UserList
            userId={user.id}
            type="following"
          />
        )}
      </div>
    </div>
  );
};

export default Profile;