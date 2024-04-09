import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type StateType = {
   messageStatus: "" | "loading" | "more-loading" | "successful" | "error";
   currentConversationInStore: Conversation | null;
   messages: Message[];
   tempImageMessages: MessageSchema[];
   tempImages: ImageSchema[];
   tempUser: User | null;
   page: number;
   size: number;
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

type PayloadType = Partial<StateType> & {
   replace?: boolean;
};

const currentConversationSlice = createSlice({
   name: "currentConversation",
   initialState: initState,
   reducers: {
      storingConversation: (state, action: PayloadAction<PayloadType>) => {
         console.log("storing conversation", action.payload);

         const { replace = false, ...payload } = action.payload;

         state.messageStatus = payload.messageStatus || state.messageStatus;
         state.currentConversationInStore =
            payload.currentConversationInStore || state.currentConversationInStore;
         state.page = payload.page || state.page;
         state.size = payload.size || state.size;
         state.tempImageMessages = payload.tempImageMessages
            ? [...payload.tempImageMessages]
            : state.tempImageMessages;
         state.tempUser = payload.tempUser || state.tempUser;
         state.tempImages = payload.tempImages ? [...payload.tempImages] : state.tempImages;

         if (replace) {
            state.messages = payload.messages ? [...payload.messages] : [];
         } else {
            state.messages = [...state.messages, ...(payload.messages || [])];
         }
      },
      reset: (state, _action: PayloadAction<undefined>) => {
         return Object.assign(state, initState);
      },
   },
});

const selectCurrentConversation = (state: { currentConversation: StateType }) => {
   return state.currentConversation;
};

const { storingConversation, reset } = currentConversationSlice.actions;

export { selectCurrentConversation, reset, storingConversation };

export default currentConversationSlice.reducer;
