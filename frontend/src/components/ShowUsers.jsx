// src/components/ShowUsers.jsx
import React, { useState } from 'react';
import { FaUser, FaTimes } from 'react-icons/fa';
import useAllUsersStore from '../zustand/allUsersStore';

const ShowUsers = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Dummy user data with random avatars
//   const dummyUsers = [
//     { id: 1, name: 'Alex Johnson', status: 'online', avatar: `https://i.pravatar.cc/150?u=user1` },
//     { id: 2, name: 'Taylor Swift', status: 'online', avatar: `https://i.pravatar.cc/150?u=user2` },
//     { id: 3, name: 'Jamie Smith', status: 'away', avatar: `https://i.pravatar.cc/150?u=user3` },
//     { id: 4, name: 'Jordan Lee', status: 'offline', avatar: `https://i.pravatar.cc/150?u=user4` },
//     { id: 5, name: 'Casey Brown', status: 'online', avatar: `https://i.pravatar.cc/150?u=user5` },
//   ];

    const users = useAllUsersStore((state) => state.users);
    const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    return randomAvatar;
  };
  // Status indicator colors
  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-500',
  };
  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
      >
        <FaUser />
        <span>Show Users</span>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Dropdown Header */}
          <div className="flex justify-between items-center p-3 bg-gray-900 border-b border-gray-700">
            <h3 className="font-semibold">Users</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
          
          {/* Users List */}
          <div className="max-h-80 overflow-y-auto">
            {users.map(user => (
              <div 
                key={user.socketId}
                className="flex items-center p-3 hover:bg-gray-750 transition-colors cursor-pointer"
              >
                {/* User Avatar */}
                <div className="relative mr-3">
                  <img 
                    src={handleRandomAvatar()}
                    alt={user.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {/* Status Indicator */}
                  
                </div>
                
                {/* User Info */}
                <div>
                  <div className="font-medium">{user.username}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default ShowUsers;