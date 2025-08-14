// src/pages/NewSnippetPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../services/api';
import './NewSnippetPage.css'; // We will create this file next

const NewSnippetPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Write your code here...');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/snippets', { title, description, language, code });
      navigate('/'); // Navigate to homepage on success
    } catch (err) {
      setError('Failed to create snippet. Please check all fields.');
      console.error(err);
    }
  };

  return (
    <div className="new-snippet-container">
      <form onSubmit={handleSubmit} className="new-snippet-form">
        <h2>Create a New Snippet</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="language">Language</label>
          <select 
            id="language" 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="sql">SQL</option>
          </select>
        </div>

        <div className="form-group">
          <label>Code</label>
          <div className="editor-wrapper">
            <Editor
              height="40vh"
              language={language}
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
            />
          </div>
        </div>

        <button type="submit">Create Snippet</button>
      </form>
    </div>
  );
};

export default NewSnippetPage;