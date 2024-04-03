import { useState } from "react";

export default function useConversationActions() {
   const [isFetching, setIsFetching] = useState(false);


   const createConversation = async() => {

   }

   const invite= async() => {
      
   }

   return { isFetching };
}
