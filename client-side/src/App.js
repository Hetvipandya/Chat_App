import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserLogin from './components/UserLogin/UserLogin';
import ChatContainer from './components/ChatContainer/ChatContainer';
import Header from './components/Header/Header';
import { useState } from 'react';
import ChatRoom from './components/ChatRoom/ChatRoom';
import Messenger from './components/Messenger/Messenger';
import GoogleAuth from './components/GoogleAuth/GoogleAuth';

function App() {
  const [user, setUser] = useState(localStorage.getItem('user') || '');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Messenger />} />
        <Route path="/login" element={<UserLogin setUser={setUser} />} />
        <Route path="/chat" element={<ChatContainer/>} />
        <Route path="/header" element={<Header />} />
        <Route path="/room" element={<ChatRoom />} />
        <Route path="/google" element={<GoogleAuth/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
