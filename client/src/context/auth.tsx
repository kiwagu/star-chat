import React, { createContext, useReducer, useContext } from 'react';
import jwtDecode from 'jwt-decode';

export type Payloud = {
  accessToken: string;
  username: string;
  [key: string]: string;
} & { message?: string };
type Action =
  | {
      type: 'LOGIN';
      payload: Payloud;
    }
  | {
      type: 'LOGOUT';
    };
type State = { credentials: Payloud | null };
type AuthProviderProps = { children: React.ReactNode };
type Dispatch = (action: Action) => void;

const AuthStateContext = createContext<State | undefined>(undefined);
const AuthDispatchContext = createContext<Dispatch | undefined>(undefined);

let credentials: Payloud | null = null;
const token = localStorage.getItem('accessToken');
if (token) {
  const decodedToken: { exp: number; username: string } = jwtDecode(token);
  const expiresAt = new Date(decodedToken.exp * 1000);

  if (new Date() > expiresAt) {
    localStorage.removeItem('accessToken');
  } else {
    credentials = {
      accessToken: token,
      username: decodedToken.username,
    };
  }
}

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('accessToken', action.payload.accessToken);
      return {
        ...state,
        credentials: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('accessToken');
      return {
        ...state,
        credentials: null,
      };
    default:
      throw new Error(`Unknown action: ${action}`);
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, { credentials });

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }
  return context;
};

export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }
  return context;
};
