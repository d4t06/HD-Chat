import ChatScreen from "@/components/ChatScreen";
import useListenMessage from "@/hooks/useListenMessage";

export default function HomePage() {
   useListenMessage();

   return (
      <div className="w-full">
         <ChatScreen />
      </div>
   );
}
