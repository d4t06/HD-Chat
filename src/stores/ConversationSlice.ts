import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthType } from "./AuthContext";



type StateType = {
   conversationDetails: ConversationDetail[];
   status: "loading" | "successful" | "error";
};

const initialState: StateType = {
   conversationDetails: [],
   status: "loading",
};

const getConversationName = (c: Conversation, auth: AuthType) => {
   if (!!c.name) return c.name;

   const anotherMembers = c.members.filter((m) => m.user_id != auth.id);
   if (c.members.length === 2) {
      return anotherMembers[0].user.fullName;
   }

   let name = "";
   anotherMembers.forEach((m) => (name += m.user.fullName + ", "));
   return name;
};

const conversationDetailFactory = (conversations: Conversation[], auth: AuthType) => {
   return conversations.map((c) => {
      const conversationName = getConversationName(c, auth);

      const conversationDetail: ConversationDetail = {
         conversation: c,
         countNewMessages: 0,
         newMessage: null,
         name: conversationName,
      };

      return conversationDetail;
   });
};

const conversationSlice = createSlice({
   name: "conversations",
   initialState,
   reducers: {
      initConversationDetail: (
         state: StateType,
         action: PayloadAction<{
            conversations: Conversation[];
            auth: AuthType;
            status: StateType["status"];
         }>
      ) => {
         const { auth, conversations, status } = action.payload;

         const conversationDetails = conversationDetailFactory(conversations, auth);
         state.conversationDetails = conversationDetails || state.conversationDetails;
         state.status = status || state.status;
      },
      setConversationStatus: (
         state: StateType,
         action: PayloadAction<{
            status: StateType["status"];
         }>
      ) => {
         state.status = action.payload.status || state.status;
      },
      addConversation: (
         state: StateType,
         action: PayloadAction<{
            conversations: Conversation[];
            auth: AuthType;
         }>
      ) => {
         const { auth, conversations } = action.payload;

         const conversationDetail = conversationDetailFactory(conversations, auth);

         state.conversationDetails =
            [...(conversationDetail || []), ...state.conversationDetails] ||
            state.conversationDetails;
      },

      addMessage(
         state: StateType,
         action: PayloadAction<{
            message: Message;
            conversation_id: number;
         }>
      ) {
         const { message, conversation_id } = action.payload;

         const newConversationsDetails = [...state.conversationDetails];
         const index = newConversationsDetails.findIndex(
            (c) => c.conversation.id === conversation_id
         );
         if (index === -1) console.log("conversation not found");

         const newObj = { ...newConversationsDetails[index] };

         newObj.newMessage = message;
         newObj.countNewMessages = newObj.countNewMessages + 1;

         newConversationsDetails[index] = newObj;

         state.conversationDetails = newConversationsDetails || state.conversationDetails;
      },
      seenMessages: (
         state: StateType,
         action: PayloadAction<{
            conversation_id: number;
         }>
      ) => {
         const { conversation_id } = action.payload;

         const newConversationsDetails = [...state.conversationDetails];
         const index = newConversationsDetails.findIndex(
            (c) => c.conversation.id === conversation_id
         );
         if (index === -1) console.log("conversation not found");

         const newObj = { ...newConversationsDetails[index] };

         newObj.countNewMessages = 0;
         newObj.newMessage = null;

         newConversationsDetails[index] = newObj;

         state.conversationDetails = newConversationsDetails || state.conversationDetails;
      },
      reset: (state: StateType) => {
         Object.assign(state, initialState);
      },
   },
});

const {
   addConversation,
   addMessage,
   initConversationDetail,
   reset,
   seenMessages,
   setConversationStatus,
} = conversationSlice.actions;

export const selectAllConversations = (state: { conversations: StateType }) => {
   return state.conversations;
};

export {
   addConversation,
   addMessage,
   initConversationDetail,
   reset,
   seenMessages,
   setConversationStatus,
};

export default conversationSlice.reducer;
