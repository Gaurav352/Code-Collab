// src/components/Editor.jsx
import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FaPlay, FaUser, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import ShowUsers from '../components/ShowUsers'; // Make sure the path is correct
import { initSocket } from '../lib/socket';
import { ACTIONS } from '../lib/Actions';
import useRoomStore from '../zustand/userStore';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import useAllUsersStore from '../zustand/allUsersStore';
import { Code2, CopyIcon } from 'lucide-react';

const EditorComponent = () => {
    const navigate = useNavigate()
    const { roomId, username } = useRoomStore()
    const setAllUsers = useAllUsersStore((state) => state.setAllUsers);
    const removeUser = useAllUsersStore((state) => state.removeUser);


    const themes = ['vs-dark', 'vs-light', 'hc-black'];
    const [code, setCode] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('vs-dark');
    const [loading, setLoading] = useState(false);
    const [version, setVersion] = useState("*");

    const codeRef = useRef(null);
    const socketRef = useRef(null);
    const langRef = useRef('javascript');
    function handleError(error) {
        console.log('socket error', error)
        toast.error('Socket Connection Failed')
        navigate("/")
    }
    useEffect(() => {
        if (!roomId || !username) {
            navigate("/")
        }
        
        console.log(roomId, username);
        const init = async () => {
            socketRef.current = await initSocket();

            const savedCode = sessionStorage.getItem('code');
              if (savedCode) setCode(savedCode);
            // socketRef.current.on('connect_error',(err)=>handleError(err))
            // socketRef.current.on('connect_error',(err)=>handleError(err)) 

            // //JOINING ROOM
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId, username
            })

            socketRef.current.on(ACTIONS.JOINED, ({ clients, newUser, socketId }) => {
                if (newUser !== username) {
                    toast.success(`${newUser} joined the room!`)
                }
                console.log(`${newUser} joined the room!`)
                console.log(clients)
                setAllUsers(clients)
                console.log(codeRef.current)
                if (codeRef.current !== null) {
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId
                    })
                    if (langRef.current !== 'javascript') {
                        socketRef.current.emit(ACTIONS.SYNC_LANG, {
                            language: langRef.current,
                            socketId
                        })
                    }
                }
            })

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, leavingUser }) => {
                toast.error(`${leavingUser} left the room`);
                removeUser(socketId)
            })

            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    console.log("Here", code);
                    setCode(code);
                }
            })
            socketRef.current.on(ACTIONS.LANG_CHANGE, ({ language }) => {
                setLanguage(language)
            })
            socketRef.current.on(ACTIONS.CODE_RESPONSE, ({ response }) => {
                console.log(response.run.output);
                setOutput(response.run.output)
                setLoading(false);
            })

        }
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
            socketRef.current.off(ACTIONS.CODE_CHANGE);
            socketRef.current.off(ACTIONS.LANG_CHANGE);
            socketRef.current.off(ACTIONS.CODE_RESPONSE);
        }
    }, [])

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        sessionStorage.setItem('code', newCode);
        localStorage.setItem('code', newCode)
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code: newCode,
        })
        codeRef.current = newCode;
    }
    const handleLanguageChange = (newLanguage) => {
        setLanguage(newLanguage)
        socketRef.current.emit(ACTIONS.LANG_CHANGE, {
            roomId,
            language: newLanguage
        })
        langRef.current = newLanguage
    }



    const editorRef = useRef(null);


    // Initialize editor
    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };

    // Run code
    const runCode = () => {
        setLoading(true)
        socketRef.current.emit(ACTIONS.COMPILE_CODE, { code, roomId, language, version, input })
    };

    // Leave room handler
    const handleLeaveRoom = () => {
        navigate("/");
        sessionStorage.removeItem('code')
        toast.success("Left room")
    };

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Copied Room ID")
        } catch (error) {
            toast.error("Error on copying Room ID")
        }
    }


    // Available languages
    const languages = [
        { id: 'javascript', name: 'JavaScript' },
        { id: 'python', name: 'Python' },
        { id: 'java', name: 'Java' },
        { id: 'csharp', name: 'C#' },
        { id: 'cpp', name: 'C++' },
        { id: 'html', name: 'HTML' },
        { id: 'css', name: 'CSS' },
    ];

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-200 overflow-hidden">
            {/* Top Navigation Bar */}
            <nav className="bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Run Button */}
                    <button
                        onClick={runCode}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg flex items-center transition-all ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:scale-105'
                            }`}
                    >
                        <FaPlay className="mr-2" />

                        {loading ? 'Executing...' : 'Run Code'}
                    </button>


                    {/* Language Select */}
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                        >
                            {languages.map((lang) => (
                                <option key={lang.id} value={lang.id}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    >
                        {themes.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>

                </div>


                <div className="flex justify-center items-center mb-4">
                    <Code2 className="w-8 h-8 text-purple-400 mr-3" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Code-collab
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    {/* Show Users Component */}

                    <button
                        onClick={copyRoomId}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors hover:scale-105"
                    >
                        <CopyIcon />
                        <span>Copy Room Id</span>
                    </button>

                    <ShowUsers />



                    {/* Leave Room Button */}
                    <button
                        onClick={handleLeaveRoom}
                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors hover:scale-105"
                    >
                        <FaSignOutAlt />
                        <span>Leave Room</span>
                    </button>
                </div>
            </nav>

            {/* Main Editor Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Code Editor (70% width) */}
                <div className="w-[70%]">
                    <Editor
                        height="100%"
                        language={language}
                        theme={theme}
                        value={code}
                        onChange={(value) => handleCodeChange(value)}
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 15 },
                        }}
                    />
                </div>

                {/* Input/Output Panel (30% width) */}
                <div className="w-[30%] flex flex-col border-l border-gray-700">
                    {/* Input Panel */}
                    <div className="h-1/2 border-b border-gray-700 flex flex-col">
                        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                            <h3 className="font-semibold">Input</h3>
                            <button
                                onClick={() => setInput('')}
                                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 w-full bg-gray-900 p-4 font-mono text-sm focus:outline-none resize-none"
                            placeholder="Enter input for your program..."
                            spellCheck="false"
                        />
                    </div>

                    {/* Output Panel */}
                    <div className="h-1/2 flex flex-col">
                        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                            <h3 className="font-semibold">Output</h3>
                            <button
                                onClick={() => setOutput('')}
                                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                        <textarea
                            value={output}
                            className="flex-1 w-full bg-gray-900 p-4 font-mono text-sm focus:outline-none resize-none"
                            placeholder="Output will appear here"
                            spellCheck="false"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorComponent;