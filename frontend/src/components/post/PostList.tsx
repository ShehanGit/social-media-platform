// src/components/post/PostList.tsx
import { useEffect, useState } from 'react';
import { postsAPI } from '../../api/post';
import { Post } from '../../types';
import PostCard from './PostCard';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import React from 'react';

interface PostListProps {
  userId?: number;
  sortBy?: 'createdAt' | 'likes';
}

const PostList = ({ userId, sortBy = 'createdAt' }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = userId
        ? await postsAPI.getUserPosts(page, 10)
        : sortBy === 'likes'
        ? await postsAPI.getPostsByLikes(page, 10)
        : await postsAPI.getPosts(page, 10, sortBy);

      setPosts(prev => [...prev, ...response.content]);
      setHasMore(!response.last);
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, userId, sortBy]);

  const handleDelete = async (postId: number) => {
    try {
      await postsAPI.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={handleDelete}
        />
      ))}
      {hasMore && (
        <div className="text-center py-4">
          <Button
            onClick={() => setPage(prev => prev + 1)}
            isLoading={loading}
            variant="secondary"
          >
            Load More
          </Button>
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <p className="text-center text-gray-500 py-4">
          No more posts to load
        </p>
      )}
      {!loading && posts.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          No posts found
        </p>
      )}
    </div>
  );
};

export default PostList;