type ThemeType = {
   name: string;
   type: "light" | "dark";
};

type User = {
   id: number;
   fullName: string;
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

type ConversationSchema = Omit<Conversation, "id" | "members"> & {};

type NewConversation = {};

type Message = {
   id: number;
   content: string;
   type: string;
   from_user_id: number;
   conversation_id: number;
   sent_at: string;
   // from_user: User;
};

type MessageSchema = Omit<Message, "id" | "sent_at" | "from_user">;
