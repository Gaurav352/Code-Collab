import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useRoomStore = create(
  persist(
    (set) => ({
      roomId: '',
      username: '',
      setRoomData: (roomId, username) => set({ roomId, username }),
    }),
    {
      name: 'room-store', 
    }
  )
);

export default useRoomStore;
