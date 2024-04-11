import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type MessageType = {
   messageStatus: "" | "loading" | "more-loading" | "successful" | "error";
   page: number;
   size: number;
   messages: Message[];
   tempImageMessages: MessageSchema[];
   tempImages: ImageSchema[];
};

type ConversationType = {
   currentConversationInStore: Conversation | null;
   tempUser: User | null;
};

type StateType = MessageType &
   ConversationType & {
      tempImages: ImageSchema[];
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

const getUserConversations = createAsyncThunk("getUserConversations", () => {
   
})

const currentConversationSlice = createSlice({
   name: "currentConversation",
   initialState: initState,
   reducers: {
      storingConversation: (state, action: PayloadAction<ConversationType>) => {
         const payload = action.payload;
         state.currentConversationInStore = payload.currentConversationInStore || null;
         state.tempUser = payload.tempUser || null;
      },
      storingMessages: (
         state,
         action: PayloadAction<Partial<MessageType> & { replace?: boolean }>
      ) => {
         const { replace = false, ...payload } = action.payload;

         state.page = payload.page || state.page;
         state.size = payload.size || state.size;
         state.messageStatus = payload.messageStatus || state.messageStatus;

         state.tempImageMessages = payload.tempImageMessages
            ? [...payload.tempImageMessages]
            : state.tempImageMessages;

         state.tempImages = payload.tempImages
            ? [...payload.tempImages]
            : state.tempImages;

         if (replace) {
            state.messages = payload.messages ? [...payload.messages] : [];
         } else {
            state.messages = [...state.messages, ...(payload.messages || state.messages)];
         }
      },

      storingTempImages: (
         state: StateType,
         action: PayloadAction<{ tempImages: StateType["tempImages"] }>
      ) => {
         const payload = action.payload;
         state.tempImages = payload.tempImages || state.tempImages;
      },

      reset: (state, _action: PayloadAction<undefined>) => {
         return Object.assign(state, initState);
      },
   },
});

const selectCurrentConversation = (state: { currentConversation: StateType }) => {
   return state.currentConversation;
};

const { storingConversation, reset, storingMessages, storingTempImages } =
   currentConversationSlice.actions;

export {
   selectCurrentConversation,
   reset,
   storingConversation,
   storingMessages,
   storingTempImages,
};

export default currentConversationSlice.reducer;
