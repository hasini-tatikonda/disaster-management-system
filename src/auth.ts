import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import app from "./firebase";

const auth = getAuth(app);

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export default auth;