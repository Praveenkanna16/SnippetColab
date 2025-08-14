// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setSnippets, setLoading } from '../store/snippetSlice';
import api from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const { snippets, loading } = useSelector((state) => state.snippets);

  useEffect(() => {
    const fetchSnippets = async () => {
      dispatch(setLoading(true));
      try {
        const response = await api.get('/snippets');
        dispatch(setSnippets(response.data));
      } catch (error) {
        console.error("Failed to fetch snippets:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchSnippets();
  }, [dispatch]);

  if (loading) return <div className="loader">Loading snippets...</div>;

  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <h1>Code Snippets</h1>
        <Link to="/new-snippet" className="btn-create-snippet">Create New Snippet</Link>
      </div>
      <div className="snippet-list">
        {snippets.length > 0 ? (
          snippets.map((snippet) => (
            <Link to={`/snippet/${snippet._id}`} key={snippet._id} className="snippet-card">
              <h3>{snippet.title}</h3>
              <p>{snippet.description}</p>
              <span className={`status-badge status-${snippet.status.toLowerCase().replace(' ', '-')}`}>
                {snippet.status}
              </span>
            </Link>
          ))
        ) : (
          <p className="empty-message">No snippets found. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;