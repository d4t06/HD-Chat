import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type StateType = {
   status: "" | "loading" | "more-loading" | "successful" | "error";
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
   status: "loading",
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
         const { replace = false, ...payload } = action.payload;

         if (replace) return Object.assign(state, payload);

         return Object.assign(state, {
            ...payload,
            messages: [...(payload.messages || []), ...state.messages],
         });
      },
   },
});

const selectCurrentConversation = (state: { currentConversation: StateType }) => {
   return state.currentConversation;
};

const { storingConversation } = currentConversationSlice.actions;

export { selectCurrentConversation, storingConversation };

export default currentConversationSlice.reducer;
