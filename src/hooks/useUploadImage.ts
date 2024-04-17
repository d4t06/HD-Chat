import { generateId, imageFactory, sleep } from "@/utils/appHelper";
import { ChangeEvent, useEffect, useRef } from "react";
import usePrivateRequest from "./usePrivateRequest";
import useMessageActions from "./useMessageActions";
import { useDispatch, useSelector } from "react-redux";
import {
   selectCurrentConversation,
   spliceTempImage,
   storingMessages,
   storingTempImages,
} from "@/stores/CurrentConversationSlice";
import { useAuth } from "@/stores/AuthContext";

const IMAGE_URL = "/images";

export default function useUploadImage() {
   const currentConversationRef = useRef<Conversation>();

   // hooks
   const dispatch = useDispatch();

   const { auth } = useAuth();
   const { sendMessage } = useMessageActions();
   const privateRequest = usePrivateRequest();
   const { currentConversationInStore, tempImages } = useSelector(
      selectCurrentConversation
   );

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

      dispatch(storingTempImages({ tempImages: processImageList }));
   };

   const handleSendImage = async (inputEle: HTMLInputElement) => {
      try {
         if (!currentConversationInStore || !auth) return;

         const fileLists = inputEle.files;
         if (!fileLists) return;

         const processImageList: MessageSchema[] = [];

         for (const imageSchema of tempImages) {
            const tempImageMessage: MessageSchema = {
               conversation_id: currentConversationInStore.conversation.id,
               content: imageSchema.image_url,
               from_user_id: auth.id,
               status: "sending",
               type: "image",
            };
            processImageList.push(tempImageMessage);
         }

         dispatch(
            storingTempImages({
               tempImages: [],
               tempImageMessages: processImageList,
            })
         );

         // tempImageMessagesList.current = tempMessageList;

         for (let i = 0; i <= fileLists.length - 1; i++) {
            const file = fileLists[i];

            const formData = new FormData();
            formData.append("image", file);

            const controller = new AbortController();
            if (import.meta.env.DEV) await sleep(1000);

            const sendingMessage = processImageList[i];

            const res = await privateRequest.post(IMAGE_URL, formData, {
               headers: { "Content-Type": "multipart/form-data" },
               signal: controller.signal,
            });

            const newImage = res.data.data as ImageType;

            if (!sendingMessage) throw new Error("message schema is undefine");

            const toUserIds = currentConversationInStore.conversation.members.map(
               (m) => m.user_id
            );

            const newMessage = await sendMessage(
               {
                  message: {
                     ...sendingMessage,
                     status: "seen",
                     content: newImage.image_url,
                  },
                  toUserIds,
               },
               { update: false }
            );

            if (!newMessage) throw new Error("error when send message");

            if (currentConversationRef.current?.id === newMessage.conversation_id) {
               dispatch(
                  storingMessages({
                     messages: [newMessage],
                  })
               );
            }

            dispatch(spliceTempImage());
         }
      } catch (error) {
         console.log({ message: error });

         dispatch(storingTempImages({ tempImages: [], tempImageMessages: [] }));
      }
   };

   useEffect(() => {
      currentConversationRef.current = currentConversationInStore?.conversation;
   }, [currentConversationInStore?.conversation.id]);

   return { handleInputChange, handleSendImage };
}
