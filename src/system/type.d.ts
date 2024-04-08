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
   last_seen: Date;
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
   type: "text" | "image" | "emoji" | "system-log";
   status: "sending" | "sent" | "received" | "seen";
   from_user_id: number;
   conversation_id: number;
   sent_at: string;
};

type MessageSchema = Omit<Message, "id" | "sent_at" | "from_user">;
