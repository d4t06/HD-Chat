import useConversationActions from "@/hooks/useConversationActions";
import {
   Dispatch,
   ReactNode,
   SetStateAction,
   createContext,
   useContext,
   useEffect,
   useRef,
   useState,
} from "react";
import { AuthType, useAuth } from "./AuthContext";
import { sleep } from "@/utils/appHelper";

type StateType = {
   conversations: Conversation[];
   status: "loading" | "successful" | "error";
};

const initState: StateType = {
   conversations: [],
   status: "loading",
};

type ContextType = {
   state: StateType;
   setConversations: Dispatch<SetStateAction<Conversation[]>>;
};

const initContext: ContextType = {
   state: initState,
   setConversations: () => {},
};

const ConversationContext = createContext<ContextType>(initContext);

const ConversationProvider = ({ children }: { children: ReactNode }) => {
   const [conversations, setConversations] = useState<Conversation[]>([]);
   const [status, setStatus] = useState<StateType["status"]>("loading");

   const { auth, loading } = useAuth();

   const { getAllUserConversations } = useConversationActions();

   const handleGetUserConversations = async (auth: AuthType) => {
      try {
         console.log(">>> get user conversation");
         await sleep(2000);
         const conversations = await getAllUserConversations(auth.id);
         if (conversations) {
            setConversations(conversations);
         }
         setStatus("successful");
      } catch (error) {
         console.log({ message: error });
         setStatus("error");
      }
   };

   useEffect(() => {
      // app always require auth
      if (!auth || loading) return;

      handleGetUserConversations(auth);

      return () => {
         setStatus("loading");
      };
   }, [auth, loading]);

   return (
      <ConversationContext.Provider
         value={{ state: { conversations, status }, setConversations }}
      >
         {children}
      </ConversationContext.Provider>
   );
};

const useConversation = () => {
   const {
      state: { ...restState },
      ...restSetState
   } = useContext(ConversationContext);

   return { ...restSetState, ...restState };
};

export default ConversationProvider;
export { useConversation };
