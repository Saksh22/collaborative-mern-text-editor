import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import '../css/login.css';

const LoginPage = () =>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async(e) =>{
        e.preventDefault();

        try{
            const response = await axios.post('http://localhost:5000/api/auth/login', {username,password});
            localStorage.setItem('token',response.data.token);
            navigate('/documents');
        }catch(error){
            console.error('Login failed:', error);
        }
    }

    return (
        <div>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <br />
                    <button type="submit">Login</button>
                </form>
            </div>
    );
};

export default LoginPage;



