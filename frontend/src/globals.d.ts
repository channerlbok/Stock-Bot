declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
export interface UserState {
  userName: string;
  userImage: string;
  // Option A: Standard React state setter type (allows functional updates like prev => ...)
  //updateUserData: Dispatch<SetStateAction<{ userName: string; userImage: string; }>>;
  // Option B: Custom callback signature (cleaner if the child just sends a raw value)
  // onUpdateMessage: (newText: string) => void;
}
