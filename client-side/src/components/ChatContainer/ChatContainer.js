import React, { useEffect, useRef, useState } from 'react';
import './ChatContainer.css';
import { FaWhatsapp } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import io from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiPaperclip } from "react-icons/fi";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import Header from '../Header/Header';
import ChatRoom from '../ChatRoom/ChatRoom';

const socket = io.connect("http://localhost:5000");

const ChatContainer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState([]);
    const [selectedName, setSelectedName] = useState(null);
    const [room, setRoom] = useState(null);
    const [user, setUser] = useState(location.state || {userName: ''});
    const [isUserSet, setIsUserSet] = useState(!!user); 
    const [users, setUsers] = useState([]);
    const [showGroup, setShowGroup] = useState(false);
    const [groupName, setGroupName] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeMessageId, setActiveMessageId] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [groups, setGroups] = useState([]); // To hold group data

    const fileInputRef = useRef(null);
    const Image1 = require("../ChatContainer/Image1.jpg");

    useEffect(() => {
        axios.get('http://localhost:5000/api/login')
            .then(response => {
                setUsers(response.data);
                console.log('Users fetched from API:', response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });

        axios.get('http://localhost:5000/api/group')
            .then(response => {
                setGroups(response.data);
                console.log('Groups fetched from API:', response.data);
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
            });

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('receive_message', (data) => {
            if ((selectedName && selectedName === data.sender) || (room && data.room === room)) {
                setMessageReceived(prev => [...prev, data]);
            }
        });

        socket.on('update_users', (users) => {
            setUsers(users);
            console.log('Users list updated:', users);
        });

        return () => {
            socket.off('receive_message');
            socket.off('update_users');
            socket.off('connect');
        };
    }, [selectedName, room]);

    const sendMessage = async () => {
        if (!user.userName || !selectedName || !message ) {
            console.error('One or more required fields are missing.');
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/message/add", {
                sender: user.userName,
                receiver: selectedName,
                message: message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            console.log('Message sent successfully');
        } catch (error) {
            console.error('Error sending message:', error);
        }

        if (message || selectedFiles.length > 0) {
            let uploadedFiles = [];
            if (selectedFiles.length > 0) {
                const formData = new FormData();
                selectedFiles.forEach(file => formData.append('files', file));
                try {
                    const response = await axios.post('http://localhost:5000/upload', formData);
                    uploadedFiles = response.data.files;
                } catch (uploadError) {
                    console.error('Error uploading files:', uploadError);
                }
            }

            const messageData = {
                id: new Date().getTime(),
                message,
                sender: user.userName,
                room,
                files: uploadedFiles,
                reactions: [],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            socket.emit('send_message', messageData);
            setMessageReceived(prev => [...prev, { ...messageData, sender: "You" }]);
            setMessage("");
            setSelectedFiles([]);
        }
    };

    const handleNameClick = (name) => {
        if (name.includes('Group')) {
            setSelectedName(name);
            setRoom(name);
            setShowGroup(true);
        } else {
            setSelectedName(name);
            setRoom(null);
            setShowGroup(false);
        }
    };

    const handleRoom = (room) => {
        setRoom(room);
        setShowGroup(true);
        navigate('/chat');
    };

    const handleCreateGroup = (groupName, selectedUsers) => {
        if (!selectedUsers.length || !groupName || !user.userName ) {
            console.error('Validation error: All fields must be filled');
            return;
        }

        const membersNameString = selectedUsers.join(', '); 

        axios.post("http://localhost:5000/api/group/add", {
            membersName: membersNameString,
            groupName: groupName,
            sender: user.userName,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })
        .then((response) => {
            if (response.status === 201) {
                setGroupName(groupName);
                setSelectedName(null);
                setShowGroup(false);
            } else {
                console.error('Failed to create group:', response.data.message);
            }
        })
        .catch((error) => {
            console.error('Error creating group:', error);
        });
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const removeUser = (userName) => {
        axios.delete("http://localhost:5000/api/login/delete", {
            data: { userName } 
        })
        .then(() => {
            console.log('User deleted successfully');
            setUser("");
            setIsUserSet(false);
            navigate('/');
        })
        .catch(error => {
            console.error('Error deleting user:', error.response ? error.response.data : error.message);
        });
    };
    
    const getProfilePicture = (name) => {
        if (typeof name === 'string' && name.length > 0) {
            const firstLetter = name.charAt(0).toUpperCase();
            return (
                <div className='profile-picture'>
                    {firstLetter}
                </div>
            );
        }
        return null;
    };

    const handlePaperclipClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        setSelectedFiles([...event.target.files]);
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage(prevMessage => prevMessage + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const handleEmojiReactionClick = (messageId) => {
        setActiveMessageId(messageId);
        setShowEmojiPicker(true);
    };

    const handleEmojiReactionSelect = (emojiObject) => {
        setMessageReceived(prevMessages =>
            prevMessages.map(msg =>
                msg.id === activeMessageId ? { ...msg, reactions: [...msg.reactions, emojiObject.emoji] } : msg
            )
        );
        setShowEmojiPicker(false);
        setActiveMessageId(null); 
    };

    return (
        <div className='container'>
            {!isUserSet ? (
                <div></div>
            ) : (
                <div className='row'>
                    <div className='left'>
                        <div className='chat-name'>
                            <FaWhatsapp className='icon' /> Chats
                            <div className='chat-group' onClick={() => handleRoom('Group')}><MdGroups /></div>
                            <div className='list'>
                                <BsThreeDotsVertical onClick={toggleMenu} />
                                {showMenu && (
                                    <div className='options-menu'>
                                        <div onClick={() => removeUser(user.userName)}>Logout</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {!showGroup && (
                            <div className='user-list'>
                                {users.map((userObj) => (
                                    <div
                                        key={userObj.id}
                                        className='user-item'
                                        onClick={() => handleNameClick(userObj.userName)}
                                    >
                                        <div className='profile-picture'>
                                            {getProfilePicture(userObj.userName)}
                                        </div>
                                        <div className='username'>
                                            {userObj.userName}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {showGroup && (
                            <div className='room-name'>
                                {room}
                                <ChatRoom users={users} onCreateGroup={handleCreateGroup} />
                            </div>
                        )}
                        {groupName && (
                            <div className='group-name'>
                                <div className='profile-picture'>
                                    {getProfilePicture(groupName)}
                                </div>
                                {groupName}
                                {groups.map((group, index) => (
                                    group.members.includes(user.userName) && (
                                        <div key={index} className={selectedName === group.groupName ? 'selected' : ''}>
                                            <div className='profile-picture'>
                                                {getProfilePicture(group.groupName)}
                                            </div>
                                            {group.groupName}
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                    <div className='right'>
                        <div className='image-container'>
                            <img src={Image1} alt="Full Screen Image" />
                            {(selectedName || groupName) && (
                                <div className='selected-name'>
                                    <div className='select-profile'>{getProfilePicture(selectedName || groupName)}</div>
                                    <div className='select-username'>{selectedName ? selectedName : groupName}</div>
                                    <Header />
                                </div>
                            )}
                            <div className='chat-window'>
                                {messageReceived.map((msg, index) => (
                                    <div key={index} className={`message ${msg.sender === "You" ? 'sent' : 'received'}`}>
                                        <strong>{msg.sender}: </strong>{msg.message}
                                        <span className='timestamp'>{msg.time}</span>
                                        {msg.files && msg.files.map((file, fileIndex) => (
                                            <div key={fileIndex}>
                                                <a href={`http://localhost:5000/files/${file.filename}`} download={file.originalname}>{file.originalname}</a>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className='textarea'>
                                <input
                                    type='file'
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    multiple
                                />
                                {showEmojiPicker && activeMessageId === null && (
                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                )}
                                {showEmojiPicker && activeMessageId !== null && (
                                    <EmojiPicker onEmojiClick={handleEmojiReactionSelect} />
                                )}
                                <MdOutlineEmojiEmotions
                                    className='emoji'
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                />
                                <FiPaperclip className='clip' onClick={handlePaperclipClick} />
                                <input
                                    type='text'
                                    placeholder='Write a message'
                                    value={message}
                                    onChange={(event) => setMessage(event.target.value)}
                                />
                                <button onClick={sendMessage}><IoMdSend /></button>
                                {selectedFiles.length > 0 && (
                                    <div className='file-list'>
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className='file-item'>
                                                {file.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatContainer;
