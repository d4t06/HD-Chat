type ThemeType = {
   name: string;
   type: "light" | "dark";
};

type ImageType = {
   id: number;
   image_url: string;
   public_id: string;
   width: number;
   height: number;
   name: string;
   size: number;
   link_to: string;
};

type ImageSchema = Omit<ImageType, "id">;

type User = {
   id: number;
   fullName: string;
   last_seen: string;
};

type Member = {
   user_id: number;
   conversation_id: number;
   joined_at: string;
   left_at: string;
   is_owner: boolean;
   user: User;
};

type MemberSchema = Omit<Member, "user" | "joined_at" | "left_at">;

type Conversation = {
   id: number;
   name: string;
   members: Member[];
};

type ConversationDetail = {
   conversation: Conversation;
   newMessage: Message | null;
   countNewMessages: number;
   name: string;
   recipient: User | null;
};

type ConversationSchema = Omit<Conversation, "id" | "members"> & {};


type NewConversationPayload = {
   conversation: Conversation,
   message: Message
}

type Message = {
   id: number;
   content: string;
   type: "text" | "image" | "emoji" | "system-log" | "sticker";
   status: "sending" | "sent" | "received" | "seen";
   from_user_id: number;
   conversation_id: number;
   send_at: string;
};

type MessageSchema = Omit<Message, "id" | "send_at" | "from_user">;

type MessageSchemaNoConversation = Omit<MessageSchema, "conversation_id">;


type StompMessage = {
   message: Message;
   to_user_ids: number[];
};
