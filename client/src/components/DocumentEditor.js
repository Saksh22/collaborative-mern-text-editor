import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const socket = io('http://localhost:5000'); 

const DocumentEditor = () => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isNewDocument, setIsNewDocument] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocument = async () => {
        
    const token = localStorage.getItem('token'); // To check if user is logged in
        if (!token) {
          navigate('/login');
          return;
        }

      try {
    // For a new document
        if (id === 'new') { 
        setIsNewDocument(true);
        setTitle('Untitled Document'); 
        setContent(''); 

    // For existiing - pull from database
      } else {
        const response = await axios.get(`http://localhost:5000/api/documents/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContent(response.data.content);
        setTitle(response.data.title);
      }
      socket.emit('joinDocument', id);

      socket.on('receiveEdit', (content) => {
        setContent(content);
      });

      return () => {
        socket.emit('leaveDocument', id);
        socket.off('receiveEdit');
      };} 
      catch (error) {
        console.error('Failed to fetch document:', error);
        navigate('/login');
      }
    };

    fetchDocument();
    
  }, [id,navigate]);

  // editing the document
  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket.emit('editDocument', { documentId: id, content: newContent });
  };

  // editing the title
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // saving the document
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    let documentTitle = title;

    if (isNewDocument) {
      documentTitle = prompt('Enter a title for the new document:');
      if (!documentTitle) {
        alert('Title is required to save the document.');
        return;
      }
      setTitle(documentTitle);
    }

    try {
      await axios.put(`http://localhost:5000/api/documents/${id}`, {
        title: documentTitle,
        content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (isNewDocument) {
        // Redirect to the document list page or display a success message
        navigate(`/documents/${id}`);
        setIsNewDocument(false);
      }

      alert('Document saved successfully.');
    } catch (error) {
      console.error('Failed to save document:', error);
      alert('Failed to save document.');
    }
  };

  return (
<div>
      <h1>Collaborative Text Editor</h1>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Document Title"
        style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd' }}
      />
      <textarea
        value={content}
        onChange={handleChange}
        rows="10"
        cols="30"
        style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd' }}
      />
      <p>Document ID: {id}</p>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default DocumentEditor;
