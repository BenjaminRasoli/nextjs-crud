"use client";
import {
  createContext,
  useEffect,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";
import AuthReducer, { User } from "./AuthReducer";

interface AuthContextType {
  currentUser: User | null;
  dispatch: Dispatch<any>;
}

const INITIAL_STATE = {
  currentUser:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") as string) || null
      : null,
  dispatch: () => {},
};

export const AuthContext = createContext<AuthContextType>(INITIAL_STATE);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.currentUser !== null) {
      localStorage.setItem("user", JSON.stringify(state.currentUser));
    }
  }, [state.currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser: state.currentUser,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
