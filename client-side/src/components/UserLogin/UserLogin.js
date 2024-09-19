import React, { useEffect, useState } from 'react';
import './UserLogin.css';
import { Dialog } from '@mui/material';
import { IoLogoWhatsapp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import GoogleAuth from '../GoogleAuth/GoogleAuth';
import {gapi} from 'gapi-script';
import axios from 'axios';

const clientId = "1094200193389-s63qju92nqcse68cfl97eoj41k8806tv.apps.googleusercontent.com"

const dialogStyle = {
  height: '50%',
  width: '50%',
  maxWidth: '100%',
  boxShadow: 'none',
  overflow: 'none'
};

const UserLogin = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const socket = io('http://localhost:5000');

  useEffect(() => {
    function start(){
      gapi.client.init({
        clientId:clientId,
        scope: ""
      })
    }
    gapi.load('client:auth2',start)
  })

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login/add", { userName, password });
      console.log(response.data);
      console.log(userName);
      if (!userName) return;

      socket.emit('login', userName);

      setTimeout(() => {
        navigate('/chat', { state: { userName } });
      }, 1000); 

    } catch (error) {
      console.error('There was an error submitting the form!', error);
    }
  }
  
  
  const Image2 = require("../UserLogin/Image2.png");

  return (
    <Dialog open={true} PaperProps={{ sx: dialogStyle }}>
      <div className='login_container'>
        <div className='row'>
          <div className='col-md-6 img'>
             <img src={Image2}/>
          </div>

          <div className='col-md-6 login_form'>
            <h1 className='title'>Login</h1>
            <input
            className='email'
               type='text'
               placeholder='User-Name'
               value={userName}
               onChange={(e) => setUserName(e.target.value)}
            />
             <input
             className='email'
               type='text'
               placeholder='Password'
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />

             <div className='login_form'>
                <button onClick={handleLogin}>Login</button>
              </div>

             <p className='part'>OR</p>

            <div>
              <GoogleAuth/>
            </div>

              
          </div>
          
          
        </div>
        
      </div>
    </Dialog>
  );
};

export default UserLogin;
