// src/components/post/PostCard.tsx
import { useState } from 'react';
import { HeartIcon, ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { Post } from '../../types';
import { likesAPI } from '../../api/likes';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import React from 'react';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: number) => void;
}

const PostCard = ({ post, onDelete }: PostCardProps) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      const response = await likesAPI.toggleLike(post.id);
      setIsLiked(response.liked);
      setLikesCount(response.likeCount);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        if (onDelete) {
          await onDelete(post.id);
          toast.success('Post deleted successfully');
        }
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={post.user.profilePictureUrl || '/default-avatar.png'}
            alt={post.user.username}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{post.user.username}</p>
            <p className="text-xs text-gray-500">
              {format(new Date(post.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        {user?.id === post.user.id && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Post Media */}
      {post.mediaUrl && (
        <div className="relative aspect-square">
          {post.mediaType === 'IMAGE' ? (
            <img
              src={post.mediaUrl}
              alt="Post content"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={post.mediaUrl}
              controls
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 text-gray-600"
          >
            {isLiked ? (
              <HeartIconSolid className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIcon className="h-6 w-6" />
            )}
            <span>{likesCount}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-600"
          >
            <ChatBubbleLeftIcon className="h-6 w-6" />
            <span>{post.comments?.length || 0}</span>
          </button>
        </div>

        {/* Caption */}
        <p className="mt-4">{post.caption}</p>
      </div>
    </div>
  );
};

export default PostCard;