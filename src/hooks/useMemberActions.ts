import usePrivateRequest from "./usePrivateRequest";

const MEMBER_URL = "/conversations/members";

export default function useMemberActions() {
   const privateRequest = usePrivateRequest();

   const addMember = async (member: MemberSchema) => {
      try {
         const res = await privateRequest.post(MEMBER_URL, member);
         const newMember = (await res.data.data) as Member;

         return newMember;
      } catch (error) {
         console.log({ message: error });
      }
   };

   return {
      addMember,
   };
}
