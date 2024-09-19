// import React, { useEffect, useState } from "react";
// import './ChatRoom.css';
// import io from "socket.io-client";

// const socket = io.connect("http://localhost:5000");

// const ChatRoom = ({ users = [], onCreateGroup }) => {
//     const [groupName, setGroupName] = useState("");
//     const [selectedUsers, setSelectedUsers] = useState([]);

//     const handleUserSelection = (username) => {
//         setSelectedUsers((prevSelectedUsers) =>
//             prevSelectedUsers.includes(username)
//                 ? prevSelectedUsers.filter((user) => user !== username)
//                 : [...prevSelectedUsers, username]
//         );
//     };

//     const handleCreateGroup = () => {
//         if (groupName) {
//             onCreateGroup(groupName, selectedUsers); 
//             setGroupName("");
//             setSelectedUsers([]);
//         }
//     };

//     useEffect(() => {
//         const handleMessageReceive = (message) => {
//         };
//         socket.on("receive_message", handleMessageReceive);
//         return () => {
//             socket.off("receive_message", handleMessageReceive);
//         };
//     }, []);

//     return (
//         <div className='chat-room'>
//             {users.length > 0 ? (
//                 <div className='user-checkbox-list'>
//                     {users.map((user) => (
//                         <div key={user.id} className='user-checkbox-item'>
//                             <input
//                                 type="checkbox"
//                                 id={`user-${user.id}`}
//                                 checked={selectedUsers.includes(user.userName)}
//                                 onChange={() => handleUserSelection(user.userName)}
//                             />
//                             <label htmlFor={`user-${user.id}`}>{user.userName}</label>
//                         </div>
//                     ))}
//                     <div className='text'>
//                         <input
//                             type='text'
//                             placeholder='Group Name'
//                             value={groupName}
//                             onChange={(e) => setGroupName(e.target.value)}
//                         />
//                         <button onClick={handleCreateGroup}>Create a Group</button>
//                     </div>
//                 </div>
//             ) : (
//                 <p>No users available</p>
//             )}
//         </div>
//     );
// };

// export default ChatRoom;

import React, { useEffect, useState } from "react";
import './ChatRoom.css';
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

const ChatRoom = ({ users = [], onCreateGroup }) => {
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleUserSelection = (username) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.includes(username)
                ? prevSelectedUsers.filter((user) => user !== username)
                : [...prevSelectedUsers, username]
        );
    };

    const handleCreateGroup = () => {
        if (groupName) {
            onCreateGroup(groupName, selectedUsers); 
            setGroupName("");
            setSelectedUsers([]);
        }
    };

    useEffect(() => {
        const handleMessageReceive = (message) => {
            // Placeholder for message handling logic
        };
        socket.on("receive_message", handleMessageReceive);
        return () => {
            socket.off("receive_message", handleMessageReceive);
        };
    }, []);

    return (
        <div className='chat-room'>
            {users.length > 0 ? (
                <div className='user-checkbox-list'>
                    {users.map((user) => (
                        <div key={user.id} className='user-checkbox-item'>
                            <input
                                type="checkbox"
                                id={`user-${user.id}`}
                                checked={selectedUsers.includes(user.userName)}
                                onChange={() => handleUserSelection(user.userName)}
                            />
                            <label htmlFor={`user-${user.id}`}>{user.userName}</label>
                        </div>
                    ))}
                    <div className='text'>
                        <input
                            type='text'
                            placeholder='Group Name'
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <button onClick={handleCreateGroup}>Create a Group</button>
                    </div>
                </div>
            ) : (
                <p>No users available</p>
            )}
        </div>
    );
};

export default ChatRoom;
