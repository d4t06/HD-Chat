import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type StateType = {
   status: "" | "loading" | "more-loading" | "successful" | "error";
   message: Message[];
   conversation_id: number | null;
   page: number;
};

const initState: StateType = {
   conversation_id: null,
   message: [],
   page: 0,
   status: "loading",
};

const currentConversationSlice = createSlice({
   name: "currentConversation",
   initialState: initState,
   reducers: {
      storingMessage: (state, action: PayloadAction<Partial<StateType>>) => {
         const payload = action.payload;
         Object.assign(state, payload);
      },
   },
});

const selectedCurrentConversation = (state: { currentConversation: StateType }) => {
   return state.currentConversation;
};

const { storingMessage } = currentConversationSlice.actions;

export { selectedCurrentConversation, storingMessage };

export default currentConversationSlice.reducer;
