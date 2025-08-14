// src/pages/SnippetDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { setCurrentSnippet, setLoading, addCommentToSnippet } from '../store/snippetSlice';
import api from '../services/api';
import './SnippetDetailPage.css';

const SnippetDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentSnippet, loading } = useSelector((state) => state.snippets);

  // State for the new comment form
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSnippet = async () => {
      if (!id) return;
      dispatch(setLoading(true));
      try {
        const response = await api.get(`/snippets/${id}`);
        dispatch(setCurrentSnippet(response.data));
      } catch (error) {
        console.error("Failed to fetch snippet:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchSnippet();
    
    return () => {
      dispatch(setCurrentSnippet(null));
    }
  }, [id, dispatch]);
  
  // Function to handle submitting a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!commentText.trim()) {
      setError('Comment cannot be empty.');
      return;
    }

    try {
      const response = await api.post(`/snippets/${id}/comments`, { text: commentText });
      dispatch(addCommentToSnippet(response.data));
      setCommentText('');
    } catch (err) {
      setError('Failed to post comment.');
      console.error(err);
    }
  };

  if (loading || !currentSnippet) return <div className="loader">Loading snippet...</div>;

  return (
    <div className="detail-page-grid">
      <div className="editor-container">
        <h2>{currentSnippet.title}</h2>
        <p>{currentSnippet.description}</p>
        <Editor
          height="60vh"
          language={currentSnippet.language}
          value={currentSnippet.code}
          theme="vs-dark"
          options={{ readOnly: true, minimap: {enabled: true} }}
        />
      </div>
      <div className="comments-container">
        <h3>Comments</h3>

        {/* --- NEW COMMENT FORM --- */}
        <form onSubmit={handleCommentSubmit} className="comment-form">
          {error && <p className="error-message small">{error}</p>}
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
          ></textarea>
          <button type="submit">Post Comment</button>
        </form>

        {/* --- LIST OF EXISTING COMMENTS --- */}
        <div className="comments-list">
          {currentSnippet.comments.length > 0 ? (
            [...currentSnippet.comments].reverse().map((comment) => (
              <div key={comment._id} className="comment">
                <strong>{comment.author.name}</strong>
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
                <p>{comment.text}</p>
              </div>
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnippetDetailPage;