import { createContext } from 'react';
import emptyUserImage from './media/no-profile-picture-15257_128.png';

export interface UserState {
  userName: string;
  userImage: string;
  // Option A: Standard React state setter type (allows functional updates like prev => ...)
  //updateUserData: Dispatch<SetStateAction<{ userName: string; userImage: string; }>>;
  // Option B: Custom callback signature (cleaner if the child just sends a raw value)
  // onUpdateMessage: (newText: string) => void;
}

export const UserContext = createContext({
      userName: '',
      userImage: emptyUserImage
    });