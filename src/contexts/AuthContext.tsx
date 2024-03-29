import { ReactNode, createContext, useState, useEffect } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import Router from "next/router";

import { api } from "../../services/apiClient";

type User = {
  name: string;
  email: string;
  permissions: string[];
  roles: string[];
  avatar: string;
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, 'vizinhancasolidaria.token');
  destroyCookie(undefined, 'vizinhancasolidaria.refreshToken');

  // authChannel.postMessage('signOut');

  Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          Router.push('/')
          break;
        default:
          break;
      }
    };
  }, [])

  useEffect(() => {
    const { "vizinhancasolidaria.token": token } = parseCookies();

    if (token) {
      api.get("/me")
        .then((response) => {
          const { name, email, permissions, roles, avatar } = response.data;

          setUser({ name, email, permissions, roles, avatar });
        })
        .catch(() => {
          signOut();
        })
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/sessions", {
        email,
        password,
      });
      
      const { user, token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, 'vizinhancasolidaria.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
      setCookie(undefined, 'vizinhancasolidaria.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      setUser({
        name: user.name,
        email,
        permissions,
        roles,
        avatar: user.avatar
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      Router.push("/informativos");
    } catch (err) {
      console.log(err.response.data.message);
    }
  }
  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
