import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ForumList = ({ posts, onTagClick }) => {
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post._id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <Link 
                to={`/forum/post/${post._id}`}
                className="text-xl font-semibold hover:text-blue-600"
              >
                {post.title}
              </Link>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                <span>Posted by {post.author.firstName}</span>
                <span>•</span>
                <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                <span>•</span>
                <span>{post.comments.length} comments</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">{post.views} views</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">{post.likes.length} likes</span>
            </div>
          </div>
          
          <p className="mt-4 text-gray-600 line-clamp-2">{post.content}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumList; 