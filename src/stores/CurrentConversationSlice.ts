import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";

type MessageType = {
   messageStatus: "" | "loading" | "more-loading" | "successful" | "error";
   page: number;
   size: number;
   messages: Message[];
};

export type CurrentConversation = {
   conversation: Conversation;
   name: string;
   recipient: Member | null;
};

type ConversationType = {
   currentConversationInStore: CurrentConversation | null;
   tempUser: User | null;
};

type StateType = MessageType &
   ConversationType & {
      tempImages: ImageSchema[];
      tempImageMessages: MessageSchema[];
   };

const initState: StateType = {
   currentConversationInStore: null,
   messages: [],
   tempImageMessages: [],
   tempImages: [],
   page: 0,
   size: 20,
   tempUser: null,
   messageStatus: "loading",
};

const currentConversationSlice = createSlice({
   name: "currentConversation",
   initialState: initState,
   reducers: {
      storingCurrentConversation: (
         state: StateType,
         action: PayloadAction<{
            conversationDetail: ConversationDetail | null;
            tempUser: User | null;
         }>
      ) => {
         const { conversationDetail, tempUser } = action.payload;

         if (!conversationDetail) {
            state.currentConversationInStore = null;
         } else {
            const newCurrentConversation: CurrentConversation = {
               conversation: conversationDetail.conversation,
               name: conversationDetail.name,
               recipient: conversationDetail.recipient,
            };

            state.currentConversationInStore = newCurrentConversation;
         }
         state.tempUser = tempUser || null;
      },
      setMessageStatus: (
         state: StateType,
         action: PayloadAction<{ messageStatus: StateType["messageStatus"] }>
      ) => {
         state.messageStatus = action.payload.messageStatus;
      },
      storingMessages: (
         state,
         action: PayloadAction<Partial<MessageType> & { replace?: boolean }>
      ) => {
         const { replace = false, messages = [], ...payload } = action.payload;

         // const newState = { ...state };

         if (replace) {
            state.messages = messages;
         } else {
            state.messages.push(messages[0]);
         }

         Object.assign(state, { ...payload });
      },

      storingTempImages: (
         state: StateType,
         action: PayloadAction<{
            tempImages?: StateType["tempImages"];
            tempImageMessages?: StateType["tempImageMessages"];
         }>
      ) => {
         const payload = action.payload;
         Object.assign(state, payload);
      },

      spliceTempImage: (state: StateType, _action: PayloadAction) => {
         state.tempImageMessages.shift();

         console.log("check state", current(state.tempImageMessages));
      },

      updateSendingImageMessage: (
         state: StateType,
         action: PayloadAction<{
            messageID: number;
            newMessage: Message;
         }>
      ) => {
         const { messageID, newMessage } = action.payload;

         const targetMessage = state.messages.find((m) => m.id === messageID);
         if (!targetMessage) {
            console.log("target message not found");
            return state;
         }

         Object.assign(targetMessage, newMessage);
      },

      resetCurrentConversation: (_state, _action: PayloadAction<undefined>) => {
         return initState;
      },
   },
});

export const selectCurrentConversation = (state: { currentConversation: StateType }) => {
   return state.currentConversation;
};

const {
   storingCurrentConversation,
   resetCurrentConversation,
   storingMessages,
   storingTempImages,
   setMessageStatus,
   spliceTempImage,
   updateSendingImageMessage,
} = currentConversationSlice.actions;

export {
   resetCurrentConversation,
   storingCurrentConversation,
   storingMessages,
   storingTempImages,
   setMessageStatus,
   updateSendingImageMessage,
   spliceTempImage,
};

export default currentConversationSlice.reducer;
