import { use, useState } from 'react';
import { Heart } from 'lucide-react';
import { User, Hash, ArrowRight, Sparkles, Shuffle, Code2, } from 'lucide-react';
import {v4 as uuidV4} from "uuid";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import useRoomStore from '../zustand/userStore.js'; 

export default function DarkForm() {
    const [roomId,setRoomId]=useState('');
    const [username,setUsername]=useState('')
    const navigate=useNavigate()
    const { setRoomData } = useRoomStore();


  const generateRoomId = (e) => {
    const id=uuidV4();
     setRoomId(id);
    
  };


  const joinRoom = (e) => {
    e.preventDefault()
    if(!roomId || !username){
        toast.error("Enter all fields")
        return
    }
    if(roomId.length < 5){
        toast.error("Minimum roomId length should be 5")
        return
    }
    if(username.length < 3){
        toast.error("Minimum username length should be 3")
        return
    }
    setRoomData(roomId,username)
    navigate(`/editor/${roomId}`)

  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="relative">
        {/* Animated background glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-20 animate-pulse"></div>
        
        {/* Main form container */}
        <div className="relative bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 w-full max-w-xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <Code2 className="w-8 h-8 text-purple-400 mr-3" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Code-Collab
              </h1>
            </div>
            <p className="text-gray-400 mt-2">Enter your details to get started</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Room ID Input */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room ID
              </label>
              <div className="flex space-x-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    name="roomId"
                    value={roomId}
                    onChange={(e)=>setRoomId(e.target.value)}
                    //onKeyDown={handleEnter}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-gray-800/70"
                    placeholder="Enter room ID"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={generateRoomId}
                  className="px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-xl text-gray-300 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:shadow-lg group"
                  title="Generate Random Room ID"
                >
                  <Shuffle className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Username Input */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e)=>setUsername(e.target.value)}
                  //onKeyDown={handleEnter}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-gray-800/70"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={joinRoom}

              className="w-full relative group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Join Room</span>
                <ArrowRight className={`w-5 h-5 transition-transform duration-200 `} />
              </span>
              
              {/* Button shine effect */}
              
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Make sure your room ID is correct
            </p>
          </div>
        </div>

      </div>

        <div className="fixed bottom-0 left-0 right-0 p-4">
        <div className="text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center space-x-1">
            <span>made with</span>
            <Heart className="w-4 h-4 text-red-400 animate-pulse" />
            <span>by</span>
            <a 
              href="https://github.com/Gaurav352" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-200 underline underline-offset-2"
            >
              Gaurav
            </a>
          </p>
        </div>
      </div>

    </div>
  );
}