import { configureStore } from "@reduxjs/toolkit";
import currentConversation from "./CurrentConversationSlice";
import conversations from "./ConversationSlice";

const store = configureStore({
   reducer: {
      currentConversation: currentConversation,
      conversations: conversations
   },
});

export type AppDispatch = typeof store.dispatch;

export default store;
