import { useState } from "react";
import Button from "../ui/Button";
import MyInput from "../ui/MyInput";
import ModalHeader from "./ModalHeader";
import SelectConversationList from "./SelectConversationList";
import useConversationActions from "@/hooks/useConversationActions";
import { useAuth } from "@/stores/AuthContext";
import useMemberActions from "@/hooks/useMemberActions";
import { conversationDetailFactory } from "@/utils/appHelper";
import { useDispatch } from "react-redux";
import { addConversation } from "@/stores/ConversationSlice";
import { storingCurrentConversation } from "@/stores/CurrentConversationSlice";
import useMessageActions from "@/hooks/useMessageActions";

type Props = {
   close: () => void;
};
export default function CreateGroupModal({ close }: Props) {
   const [groupName, setGroupName] = useState("");
   const [isFetching, setIsFetching] = useState(false);
   const [selectCDetails, setSelectCDetails] = useState<ConversationDetail[]>([]);

   // hooks
   const dispatch = useDispatch();
   const { auth } = useAuth();
   const { createConversation, sendConversation } = useConversationActions();
   const { addMember } = useMemberActions();
   const { sendMessage } = useMessageActions();

   const ableToSubmit = !!groupName && selectCDetails.length <= 3;

   const handleAddGroup = async () => {
      try {
         if (!auth) return;

         setIsFetching(true);

         const c = await createConversation({ name: groupName });

         const firstMessage: MessageSchema = {
            conversation_id: c.id,
            content: `${auth.fullName} created group '${groupName}'`,
            from_user_id: auth.id,
            status: "seen",
            type: "system-log",
         };

         const ownerMember: MemberSchema = {
            conversation_id: c.id,
            is_owner: true,
            user_id: auth.id,
         };

         const otherMemberSchemas = selectCDetails.map((cDetail) => {
            if (!cDetail.recipient) throw new Error("recipient not found");

            return {
               conversation_id: c.id,
               is_owner: false,
               user_id: cDetail.recipient?.user_id,
            } as MemberSchema;
         });

         const owner = await addMember(ownerMember);

         if (!owner) throw new Error("owner member not found");

         const others: Member[] = [];

         for await (const otherMemberSchema of otherMemberSchemas) {
            const other = await addMember(otherMemberSchema);
            if (!other) throw new Error("other member not found");

            others.push(other);
         }

         owner["user"] = auth;

         for (let i = 0; i < selectCDetails.length; i++) {
            if (!selectCDetails[i] || !selectCDetails[i].recipient)
               throw new Error("recipient not found");

            others[i]["user"] = (selectCDetails[i].recipient as Member).user;
         }

         c.members = [owner, ...others];

         const cDetail = conversationDetailFactory([c], auth)[0];

         dispatch(addConversation({ conversationDetail: cDetail }));

         dispatch(
            storingCurrentConversation({
               conversationDetail: cDetail,
               tempUser: null,
            })
         );

         const toUserIds = c.members.map((m) => m.user_id);

         // no send to others
         const newMessage = await sendMessage(
            { message: firstMessage, toUserIds },
            { sendMessage: false }
         );

         if (!newMessage) throw new Error("new message not found");

         console.log("check payload", c);
         console.log("check payload", newMessage);
         console.log("check payload", toUserIds);

         sendConversation({
            conversation: c,
            message: newMessage,
            toUserIDs: toUserIds,
         });
      } catch (error) {
         console.log({ message: error });
      } finally {
         setIsFetching(false);
         close();
      }
   };

   return (
      <div className="flex flex-col w-[700px] max-w-[80vw] min-h-[300px] h-[500px] max-h-[80vh]">
         <ModalHeader close={close} title="Create group" />
         <div className="flex-grow flex flex-col">
            <MyInput
               className="h-[36px] px-[16px] rounded-[99px]"
               cb={(value) => setGroupName(value)}
               placeholder="Group name..."
            />
            <h5 className="mt-[10px] mb-[6px] text-[#11f1f1f] font-[500]">
               Your conversations
            </h5>
            <div className="flex-grow overflow-auto">
               <SelectConversationList
                  type="create-group"
                  setSelectCDetails={setSelectCDetails}
               />
            </div>
            <div className="flex justify-center">
               <Button
                  onClick={handleAddGroup}
                  disabled={!ableToSubmit}
                  isLoading={isFetching}
                  className="font-[500]"
                  variant={"push"}
               >
                  Create
               </Button>
            </div>
         </div>
      </div>
   );
}
