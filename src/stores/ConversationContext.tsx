import {
   Dispatch,
   ReactNode,
   SetStateAction,
   createContext,
   useContext,
   useState,
} from "react";
type StateType = {
   conversations: Conversation[];
   tempConversations: Conversation[];
   status: "loading" | "successful" | "error";
};

const initState: StateType = {
   conversations: [],
   tempConversations: [],
   status: "loading",
};

type ContextType = {
   state: StateType;
   setConversations: Dispatch<SetStateAction<Conversation[]>>;
   setTempConversations: Dispatch<SetStateAction<Conversation[]>>;
   setStatus: Dispatch<SetStateAction<StateType["status"]>>;
};

const initContext: ContextType = {
   state: initState,
   setConversations: () => {},
   setTempConversations: () => {},
   setStatus: () => {},
};

const ConversationContext = createContext<ContextType>(initContext);

const ConversationProvider = ({ children }: { children: ReactNode }) => {
   const [conversations, setConversations] = useState<Conversation[]>([]);
   const [tempConversations, setTempConversations] = useState<Conversation[]>([]);
   const [status, setStatus] = useState<StateType["status"]>("loading");

   return (
      <ConversationContext.Provider
         value={{
            state: { conversations, tempConversations, status },
            setConversations,
            setTempConversations,
            setStatus,
         }}
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
