import ChatScreen from "@/components/ChatScreen";
import useConnectSocket from "@/hooks/useConnectSocket";
import useListenMessage from "@/hooks/useListenMessage";

export default function HomePage() {
   // hooks
   useConnectSocket();
   useListenMessage();

   return (
      <div className="w-full">
         <ChatScreen />
      </div>
   );
}
