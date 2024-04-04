import { configureStore } from "@reduxjs/toolkit";
import currentConversation from "./CurrentConversationSlice";

const store = configureStore({
   reducer: {
      currentConversation: currentConversation,
   },
});

export type AppDispatch = typeof store.dispatch;

export default store;
