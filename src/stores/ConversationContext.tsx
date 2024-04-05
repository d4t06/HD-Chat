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
import { useAuth } from "./AuthContext";
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

   const ranEffect = useRef(false);

   const { auth, loading } = useAuth();

   const { getAllUserConversations } = useConversationActions();

   const handleGetUserConversations = async () => {
      try {
         if (!auth) return;

         console.log(">>> get conversations");

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
      if (!auth) return;

      if (!ranEffect.current) {
         ranEffect.current = true;

         handleGetUserConversations();
      }
   }, [auth]);

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
