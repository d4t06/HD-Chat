import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

type StateType = {
   auth: {
      fullName: string;
      token: string;
   } | null;
   loading: boolean;
};

type ContextType = {
   state: StateType;
   setAuth: Dispatch<SetStateAction<StateType["auth"]>>;
   setLoading: Dispatch<SetStateAction<boolean>>;
};

export type AuthResponse = {
   userInfo: {
      fullName: string;
   };
   token: string;
};

const initContextState: ContextType = {
   setAuth: () => {},
   setLoading: () => {},
   state: { auth: null, loading: true },
};

const AuthContext = createContext<ContextType>(initContextState);

const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [auth, setAuth] = useState<StateType["auth"] | null>(null);
   const [loading, setLoading] = useState(true);

   return (
      <AuthContext.Provider value={{ state: { auth, loading }, setAuth, setLoading }}>
         {children}
      </AuthContext.Provider>
   );
};

const useAuth = () => {
   const context = useContext(AuthContext);

   const {
      state: { auth, loading },
      setAuth,
      setLoading,
   } = context;

   return { auth, loading, setAuth, setLoading };
};

export default AuthProvider;
export { useAuth };
