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
};

const initState: StateType = {
   conversations: [],
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

   return (
      <ConversationContext.Provider
         value={{ state: { conversations }, setConversations }}
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
