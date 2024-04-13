import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthType } from "./AuthContext";
import { conversationDetailFactory } from "@/utils/appHelper";
import { CurrentConversation } from "./CurrentConversationSlice";

type StateType = {
   conversationDetails: ConversationDetail[];
   status: "loading" | "successful" | "error";
};

const initialState: StateType = {
   conversationDetails: [],
   status: "loading",
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
      addNewConversation: (
         state: StateType,
         action: PayloadAction<{
            newConversationPayload: NewConversationPayload;
            auth: AuthType;
         }>
      ) => {
         const {
            auth,
            newConversationPayload: { conversation, message },
         } = action.payload;

         const conversationDetail = conversationDetailFactory([conversation], auth);
         conversationDetail[0].newMessage = message;
         conversationDetail[0].countNewMessages = 1;

         state.conversationDetails.unshift(conversationDetail[0]);
      },

      addConversation: (
         state: StateType,
         action: PayloadAction<{
            conversationDetail: ConversationDetail;
         }>
      ) => {
         state.conversationDetails.unshift(action.payload.conversationDetail);
      },

      updateConversation: (
         state: StateType,
         action: PayloadAction<{
            cDetail: ConversationDetail;
         }>
      ) => {
         const { cDetail } = action.payload;

         const targetCDetail = state.conversationDetails.find(
            (_cDetail) => _cDetail.conversation.id === cDetail.conversation.id
         );

         if (targetCDetail === undefined) {
            console.log("target conversation not found");
            return state;
         }

         Object.assign(targetCDetail, cDetail);

         // cDetails.forEach((cDetail) => {
         //    if (cDetail.recipient === null) {
         //       console.log("recipient  not found");
         //       return state;
         //    }

         //    targetCDetail.conversation.members.push(cDetail.recipient);
         //    targetCDetail.name = targetCDetail.name + ", " + cDetail.name;
         // });

         // targetCDetail.recipient = null;
      },
      addMessage(
         state: StateType,
         action: PayloadAction<{
            message: Message;
         }>
      ) {
         const { message } = action.payload;

         const target = state.conversationDetails.find(
            (c) => c.conversation.id === message.conversation_id
         );

         if (!target) return state;

         target.newMessage = message;
         target.countNewMessages = target.countNewMessages + 1;
      },
      seenMessages: (
         state: StateType,
         action: PayloadAction<{
            conversation_id: number;
         }>
      ) => {
         const { conversation_id } = action.payload;

         const target = state.conversationDetails.find(
            (c) => c.conversation.id === conversation_id
         );

         if (!target) return state;

         target.newMessage = null;
         target.countNewMessages = 0;
      },
      reset: (_state: StateType) => {
         return initialState;
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
   addNewConversation,
   updateConversation
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
   addNewConversation,
   updateConversation
};

export default conversationSlice.reducer;
