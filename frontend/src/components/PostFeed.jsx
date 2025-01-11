import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Heart, MessageCircle, Send } from 'lucide-react';
import axios from 'axios';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt' or 'likes'
  const { ref, inView } = useInView();

  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(
        `http://localhost:8080/api/v1/posts?page=${page}&size=5&sortBy=${sortBy}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const newPosts = response.data.content;
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.post(
        `http://localhost:8080/api/v1/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update the post's like status in the UI
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, liked: !post.liked, likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1 }
            : post
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  useEffect(() => {
    if (inView) {
      fetchPosts();
    }
  }, [inView]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setPosts([]);
    setPage(0);
    setHasMore(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6 flex justify-center gap-4">
        <button
          onClick={() => handleSortChange('createdAt')}
          className={`px-4 py-2 rounded-lg ${
            sortBy === 'createdAt'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          Recent
        </button>
        <button
          onClick={() => handleSortChange('likes')}
          className={`px-4 py-2 rounded-lg ${
            sortBy === 'likes'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          Most Liked
        </button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            {post.mediaUrl && (
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={`http://localhost:8080${post.mediaUrl}`}
                  alt="Post media"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            
            <div className="p-4">
              <div className="flex items-center mb-3">
                <img
                  src={post.user.profilePictureUrl || '/api/placeholder/40/40'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="font-semibold dark:text-white">
                  {post.user.firstname} {post.user.lastname}
                </span>
              </div>
              
              <p className="text-gray-800 dark:text-gray-200 mb-4">{post.caption}</p>
              
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      post.liked ? 'fill-red-500 text-red-500' : 'text-gray-500'
                    }`}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {post.likeCount || 0}
                  </span>
                </button>
                
                <button className="flex items-center gap-1">
                  <MessageCircle className="w-6 h-6 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {post.commentCount || 0}
                  </span>
                </button>
                
                <button className="flex items-center">
                  <Send className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}
        
        <div ref={ref} className="h-10" />
      </div>
    </div>
  );
};

export default PostFeed;