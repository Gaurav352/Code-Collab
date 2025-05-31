// allUsersStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAllUsersStore = create(
  persist(
    (set, get) => ({
      users: [], // Array of user objects: [{ username, socketId }, ...]
      
      // Add a new user to the room
      addUser: (username, socketId) => set((state) => {
        // Check if user already exists (prevent duplicates)
        const existingUser = state.users.find(user => user.socketId === socketId);
        if (existingUser) {
          return state; // User already exists, no change
        }
        
        return {
          users: [...state.users, { username, socketId }]
        };
      }),
      
      // Remove a user from the room
      removeUser: (socketId) => set((state) => ({
        users: state.users.filter(user => user.socketId !== socketId)
      })),
      
      // Update user info (if username changes)
      updateUser: (socketId, newUsername) => set((state) => ({
        users: state.users.map(user => 
          user.socketId === socketId 
            ? { ...user, username: newUsername }
            : user
        )
      })),
      
      // Set all users at once (useful for initial room data)
      setAllUsers: (usersList) => set({ users: usersList }),
      
      // Clear all users (when leaving room)
      clearUsers: () => set({ users: [] }),
      
      // Get user by socketId
      getUserBySocketId: (socketId) => {
        const { users } = get();
        return users.find(user => user.socketId === socketId);
      },
      
      // Get all usernames
      getAllUsernames: () => {
        const { users } = get();
        return users.map(user => user.username);
      },
      
      // Get user count
      getUserCount: () => {
        const { users } = get();
        return users.length;
      },
      
      // Check if user exists
      userExists: (socketId) => {
        const { users } = get();
        return users.some(user => user.socketId === socketId);
      }
    }),
    {
      name: 'all-users-store', // localStorage key
      // Optional: Only persist users array
      partialize: (state) => ({ users: state.users })
    }
  )
);

export default useAllUsersStore;