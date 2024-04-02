import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

type StateType = {
   theme: "light" | "dark";
};

const initialState: StateType = {
   theme: "light",
};

type ContextType = {
   state: StateType;
   setTheme: Dispatch<SetStateAction<StateType["theme"]>>;
};

const initialContextState: ContextType = {
   setTheme: () => {},
   state: initialState,
};

const ThemeContext = createContext(initialContextState);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
   const [theme, setTheme] = useState<StateType["theme"]>("light");

   return (
      <ThemeContext.Provider value={{ state: { theme }, setTheme }}>
         {children}
      </ThemeContext.Provider>
   );
};

const useTheme = () => {
   const {
      state: { theme },
      setTheme,
   } = useContext(ThemeContext);

   return { theme, setTheme };
};

export default ThemeProvider;
export { useTheme };
