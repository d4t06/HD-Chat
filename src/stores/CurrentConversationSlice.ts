import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type StateType = {
   messageStatus: "" | "loading" | "more-loading" | "successful" | "error";
   currentConversationInStore: Conversation | null;
   messages: Message[];
   tempUser: User | null;
   page: number;
   size: number;
   isNewConversation: boolean;
};

const initState: StateType = {
   currentConversationInStore: null,
   messages: [],
   page: 0,
   size: 20,
   messageStatus: "loading",
   isNewConversation: false,
   tempUser: null,
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

         if (replace) return Object.assign(state, payload);

         return Object.assign(state, {
            ...payload,
            messages: [...state.messages, ...(payload.messages || [])],
         });
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
