import React, { createContext, useReducer, useContext } from 'react';

export type Payloud = {
  accessToken: string;
  [key: string]: string;
} & { message: string };
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

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('accessToken', action.payload.accessToken);
      return {
        ...state,
        credentials: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        credentials: null,
      };
    default:
      throw new Error(`Unknown action: ${action}`);
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, { credentials: null });

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
