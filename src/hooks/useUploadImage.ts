import { generateId } from "@/utils/appHelper";
import { ChangeEvent } from "react";
import usePrivateRequest from "./usePrivateRequest";
import { nanoid } from "@reduxjs/toolkit";
import useMessageActions from "./useMessageActions";
import { useDispatch, useSelector } from "react-redux";
import {
   selectCurrentConversation,
   storingConversation,
} from "@/stores/CurrentConversationSlice";
import { useAuth } from "@/stores/AuthContext";

const IMAGE_URL = "/image-management/images";

export default function useUploadImage() {
   // hooks
   const dispatch = useDispatch();

   const { currentConversationInStore, tempUser, tempImageMessages } = useSelector(
      selectCurrentConversation
   );
   const { auth } = useAuth();
   const { sendMessage } = useMessageActions();

   const privateRequest = usePrivateRequest();

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

   const handleInputChange = () => {};

   const handleSendImage = async (e: ChangeEvent<HTMLInputElement>) => {
      try {
         if (!currentConversationInStore)
            throw new Error("currentConversationInStore not found");
         if (!auth) throw new Error("Auth not found");

         const inputEle = e.target as HTMLInputElement & { files: FileList };
         const fileLists = inputEle.files;

         // init tempImage
         const processImageList: ImageSchema[] = [];
         const fileNeedToUploadIndexes: number[] = [];
         const tempMessages: MessageSchema[] = [];

         const checkDuplicateImage = (ob: ImageSchema) => {
            return processImageList.some(
               (image) => image.name === ob.name && image.size == ob.size
            );
         };

         let i = 0;
         for (const file of fileLists) {
            const imageObject = imageFactory({
               name: generateId(file.name),
               image_url: URL.createObjectURL(file),
               size: file.size,
            });

            if (checkDuplicateImage(imageObject)) {
               URL.revokeObjectURL(imageObject.image_url);

               i++;
               continue;
            }

            processImageList.push(imageObject);
            const tempImageMessage = messageFactory({
               conversation_id: currentConversationInStore.id,
               content: imageObject.image_url,
               from_user_id: auth.id,
               status: "sending",
               type: "image",
            });

            tempImageMessages.push(tempImageMessage);
            fileNeedToUploadIndexes.push(i);

            // assign
            Object.assign(file, {
               message_index: tempImageMessages.length - 1,
            });

            i++;
         }

         // setTempImages(processImageList);

         for (const val of fileNeedToUploadIndexes.reverse()) {
            const file = fileLists[val] as File & { message_index: number };

            const formData = new FormData();
            formData.append("image", file);

            const controller = new AbortController();

            const res = await privateRequest.post(IMAGE_URL, formData, {
               headers: { "Content-Type": "multipart/form-data" },
               signal: controller.signal,
            });

            const newMessageSchema = tempMessages.shift();
            if (!newMessageSchema) return;

            const newImage = res.data.data as ImageType;

            Object.assign(newMessageSchema, {
               content: newImage.image_url,
               status: "seen",
            } as Partial<MessageSchema>);

            const newMessage = await sendMessage(newMessageSchema, { update: false });
            if (!newMessage) throw new Error("error when send message");

            dispatch(
               storingConversation({
                  tempImageMessages: tempImageMessages,
                  messages: [newMessage],
               })
            );
         }
      } catch (error) {
         console.log(error);
      }
   };

   return { handleInputChange };
}
