import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthAction, User, UserRole } from '../types';
import { loginApi } from '../services/api';

const AUTH_STORAGE_KEY = 'hrm_auth_session';

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Pure authReducer function - fully testable with Unit Testing
 */
export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialAuthState,
      };
    case 'UPDATE_USER':
      if (!state.user) return state;
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  updateCurrentUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Restore session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const { user, token } = JSON.parse(stored);
        if (user && token) {
          dispatch({ type: 'RESTORE_SESSION', payload: { user, token } });
        }
      }
    } catch (err) {
      console.warn('Lỗi phục hồi phiên đăng nhập:', err);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (state.isAuthenticated && state.user && state.token) {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user: state.user, token: state.token })
      );
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [state.isAuthenticated, state.user, state.token]);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await loginApi(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res });
    } catch (err: any) {
      const msg = err?.message || 'Đăng nhập không thành công';
      dispatch({ type: 'LOGIN_FAILURE', payload: msg });
      throw err;
    }
  };

  const logout = (): void => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateCurrentUser = (patch: Partial<User>): void => {
    dispatch({ type: 'UPDATE_USER', payload: patch });
  };

  const switchDemoRole = async (role: UserRole): Promise<void> => {
    if (role === 'admin') {
      await login('admin@hrm.vn', 'Admin@123');
    } else {
      await login('nhanvien@hrm.vn', 'Employee@123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
        switchDemoRole,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
