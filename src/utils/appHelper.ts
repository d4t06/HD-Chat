import { AuthType } from "@/stores/AuthContext";

export const sleep = (time: number) =>
   new Promise<void>((rs) => {
      setTimeout(() => {
         rs();
      }, time);
   });

export const generateId = (name: string): string => {
   const convertToEn = (str: string) => {
      const newString = str
         .toLocaleLowerCase()
         .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ắ|ằ|ẳ|ẵ|ặ/g, "a")
         .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
         .replace(/ì|í|ị|ỉ|ĩ/g, "i")
         .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ/g, "o")
         .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
         .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
         .replace(/đ/g, "d");
      return newString;
   };
   return convertToEn(name).replaceAll(/[\W_]/g, "-");
};

export const convertDateStringToString = (string: string) => {
   if (!string) return;
   const date = new Date(string);

   return date.toLocaleString("en-us");
};

export const imageFactory = (data: Partial<ImageSchema>) => {
   const newImage: ImageSchema = {
      public_id: "",
      image_url: "",
      link_to: "",
      name: "",
      size: 0,
      height: 0,
      width: 0,
      ...data,
   };

   return newImage;
};

export const messageFactory = (data: Partial<MessageSchema>) => {
   const newMessage: MessageSchema = {
      content: "",
      conversation_id: 0,
      from_user_id: 0,
      status: "sending",
      type: "image",
      ...data,
   };

   return newMessage;
};


const getConversationName = (c: Conversation, auth: AuthType) => {
   let recipient: Member;
   let name = "";

   if (!!c.name) return { name: c.name, recipient: null };

   const anotherMembers = c.members.filter((m) => m.user_id != auth.id);
   if (c.members.length === 2) {
      recipient = anotherMembers[0];
      return { name: recipient.user.fullName, recipient };
   }

   anotherMembers.forEach((m) => (name += m.user.fullName + ", "));

   return { name, recipient: null };
};


export const conversationDetailFactory = (conversations: Conversation[], auth: AuthType) => {
   return conversations.map((c) => {
      const { name, recipient } = getConversationName(c, auth);

      const conversationDetail: ConversationDetail = {
         conversation: c,
         countNewMessages: 0,
         newMessage: null,
         name,
         recipient,
      };

      return conversationDetail;
   });
};
