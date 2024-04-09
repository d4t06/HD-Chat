import { generateId, sleep } from "@/utils/appHelper";
import { ChangeEvent, useRef } from "react";
import usePrivateRequest from "./usePrivateRequest";
import useMessageActions from "./useMessageActions";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentConversation, storingConversation } from "@/stores/CurrentConversationSlice";
import { useAuth } from "@/stores/AuthContext";

const IMAGE_URL = "/images";

export default function useUploadImage() {
   // hooks
   const dispatch = useDispatch();

   const { auth } = useAuth();
   const { sendMessage } = useMessageActions();
   const privateRequest = usePrivateRequest();
   const { currentConversationInStore, tempImages } = useSelector(selectCurrentConversation);

   const imageFactory = (data: Partial<ImageSchema>) => {
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

   const messageFactory = (data: Partial<MessageSchema>) => {
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

   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!currentConversationInStore || !auth) return;

      const inputEle = e.target as HTMLInputElement & { files: FileList };
      const fileLists = inputEle.files;

      const processImageList: ImageSchema[] = [...tempImages];

      for (const file of fileLists) {
         const imageObject = imageFactory({
            name: generateId(file.name),
            image_url: URL.createObjectURL(file),
            size: file.size,
         });

         processImageList.push(imageObject);
      }

      dispatch(storingConversation({ tempImages: processImageList }));
   };

   const handleSendImage = async (inputEle: HTMLInputElement) => {
      try {
         if (!currentConversationInStore || !auth) return;

         const fileLists = inputEle.files;
         if (!fileLists) return;

         const tempMessageList: MessageSchema[] = [];

         for (const imageSchema of tempImages) {
            const tempImageMessage = messageFactory({
               conversation_id: currentConversationInStore.id,
               content: imageSchema.image_url,
               from_user_id: auth.id,
               status: "sending",
               type: "image",
            });
            tempMessageList.push(tempImageMessage);
         }

         dispatch(storingConversation({ tempImages: [], tempImageMessages: tempMessageList }));

         for (let i = 0; i <= fileLists.length - 1; i++) {
            const file = fileLists[i];

            const formData = new FormData();
            formData.append("image", file);

            const controller = new AbortController();
            if (import.meta.env.DEV) await sleep(1000);

            const res = await privateRequest.post(IMAGE_URL, formData, {
               headers: { "Content-Type": "multipart/form-data" },
               signal: controller.signal,
            });

            const newImage = res.data.data as ImageType;

            const newMessageSchema = { ...tempMessageList[0] };
            if (!newMessageSchema) return;

            tempMessageList.splice(0, 1);

            newMessageSchema.status = "seen";
            newMessageSchema.content = newImage.image_url;

            const newMessage = await sendMessage(newMessageSchema, { update: false });
            if (!newMessage) throw new Error("error when send message");

            dispatch(
               storingConversation({
                  messages: [newMessage],
                  tempImageMessages: tempMessageList,
                  replace: false,
               })
            );

            console.log("upload file finish");
         }
      } catch (error) {
         console.log(error);
      }
   };

   return { handleInputChange, handleSendImage };
}
