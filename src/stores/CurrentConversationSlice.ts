import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";

type MessageType = {
   messageStatus: "" | "loading" | "more-loading" | "successful" | "error";
   page: number;
   size: number;
   messages: Message[];
};

type ConversationType = {
   currentConversationInStore: {
      conversation: Conversation;
      name: string;
      recipient: User | null;
   } | null;
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
      storingConversation: (
         state: StateType,
         action: PayloadAction<ConversationType>
      ) => {
         const payload = action.payload;
         state.currentConversationInStore = payload.currentConversationInStore || null;
         state.tempUser = payload.tempUser || null;
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

         console.log('check statse', current(state.tempImageMessages));
         

         state.tempImageMessages.pop();
      },

      reset: (_state, _action: PayloadAction<undefined>) => {
         return initState;
      },
   },
});

export const selectCurrentConversation = (state: { currentConversation: StateType }) => {
   return state.currentConversation;
};

const {
   storingConversation,
   reset,
   storingMessages,
   storingTempImages,
   setMessageStatus,
   spliceTempImage,
} = currentConversationSlice.actions;

export {
   reset,
   storingConversation,
   storingMessages,
   storingTempImages,
   setMessageStatus,
   spliceTempImage,
};

export default currentConversationSlice.reducer;
