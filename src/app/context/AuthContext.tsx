"use client";
import {
  createContext,
  useEffect,
  useReducer,
  ReactNode,
  ActionDispatch,
} from "react";
import AuthReducer from "./AuthReducer";

interface AuthContextType {
  currentUser: any;
  dispatch: any;
}

const INITIAL_STATE = {
  currentUser: JSON.parse(localStorage.getItem("user") as string) || null,
  dispatch: "",
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
        currentUser: state.currentUser !== null && state.currentUser,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
