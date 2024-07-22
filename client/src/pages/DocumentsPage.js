import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/document.css';

const DocumentListPage = () => {
    const [documents, setDocuments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        
        const fetchDocuments = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/documents', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                console.log('Documents fetched:', response.data.documents);
                setDocuments(response.data.documents);
            } catch (error) {
                console.error('Failed to fetch documents:', error);
            }
        };

        fetchDocuments();
    }, [navigate]);

    const handleCreateDocument = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
    
        try {
          const response = await axios.post('http://localhost:5000/api/documents', {
            title: 'Untitled Document'
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
    
          // Navigate to the new document's editor page
          navigate(`/documents/${response.data.createdDocument._id}`);
        } catch (error) {
          console.error('Failed to create document:', error);
        }
      };
    
      const handleEditDocument = (docId) => {
        navigate(`/documents/${docId}`);
      };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <h2>Documents</h2>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <button onClick={handleCreateDocument}>Create Document</button>
           

            <ul>
                {documents.map(doc => (
                    <li key={doc._id}>
                        <button onClick={() => handleEditDocument(doc._id)}>
              {doc.title}
            </button>
                    </li>
                ))}
            </ul>
            
        </div>
    );
};

export default DocumentListPage;
