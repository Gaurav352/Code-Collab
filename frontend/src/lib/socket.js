import { io } from 'socket.io-client';

export const initSocket = async () => {
  const options = {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ['websocket']
  };

  const URL =
    import.meta.env.MODE === "production"
      ? 'https://code-collab-bkcn.onrender.com' 
      : 'http://localhost:5000';               

  return io(URL, options);
};
