import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import axios from "axios";


import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";


axios.defaults.baseURL = "http://localhost:5001"; // 👈 your Express backend URL
axios.defaults.withCredentials = true;
const ChatContainer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // 03-07-2025
//   useEffect(() => {
//   if (!navigator.geolocation) {
//     console.warn("Geolocation not supported.");
//     return;
//   }

//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;
//       const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
//       console.log(`https://www.google.com/maps?q=${latitude},${longitude}`);
//       axios.post(`/api/messages/send/${selectedUser._id}`, {
//        text: mapsUrl,
// });
//     },
//     (error) => {
//       console.error("Error getting location:");
//       console.error("Code:", error.code);
//       console.error("Message:", error.message || "No message provided");
//     },
//     {
//       enableHighAccuracy: false,
//       timeout: 7000,
//       maximumAge: 0,
//     }
//   );
// }, [selectedUser._id]);
// const handleSendLocation = () => {
//   if (!navigator.geolocation) {
//     alert("Geolocation is not supported by your browser.");
//     return;
//   }

//   navigator.geolocation.getCurrentPosition(
//     async (position) => {
//       const { latitude, longitude } = position.coords;
//       const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

//       try {
//         await axios.post(`/api/messages/send/${selectedUser._id}`, {
//           text: mapsUrl,
//         });
//       } catch (error) {
//         console.error("Failed to send location:", error);
//       }
//     },
//     (error) => {
//       console.error("Error getting location:", error.message);
//     },
//     {
//       enableHighAccuracy: false,
//       timeout: 7000,
//       maximumAge: 0,
//     }
//   );
// };






// useEffect(() => {
//   if (!selectedUser || !authUser) return;

//   const markMessagesAsSeen = async () => {
//     try {
//       await axios.put("/api/messages/mark-seen", {
//         senderId: selectedUser._id,   
//         receiverId: authUser._id,     
//       });
//       console.log("hi");
//     } catch (error) {
//       console.error("Error marking messages as seen:", error);
//     }
//   };

//   markMessagesAsSeen();
// }, );

// useEffect(() => {
//   if (!selectedUser || !authUser) return;

//   const markMessagesAsSeen = async () => {
//     try {
//       await axios.put("/api/messages/mark-seen", {
//         senderId: selectedUser._id,
//         receiverId: authUser._id,
//       });
//       console.log("✅ Messages marked as seen");
//     } catch (error) {
//       console.error("❌ Error marking messages as seen:", error);
//     }
//   };

//   // Mark seen immediately
//   markMessagesAsSeen();

//   // Set interval to mark seen every 5 seconds
//   const intervalId = setInterval(markMessagesAsSeen, 5000);

//   // Clear interval when chat changes or component unmounts
//   return () => clearInterval(intervalId);
// }, [selectedUser?._id, authUser?._id]);

useEffect(() => {
  if (!selectedUser || !authUser) return;

  
  const markMessagesAsSeen = async () => {
    try {
      await axios.put("/api/messages/mark-seen", {
        senderId: selectedUser._id,
        receiverId: authUser._id,
      });

      // Refresh messages to get updated `isSeen` status
      await getMessages(selectedUser._id,true);

      console.log("✅ Messages marked as seen and refreshed");
    } catch (error) {
      console.error("❌ Error marking messages as seen:", error);
    }
  };

  // Run immediately once
  markMessagesAsSeen();

  // Then run repeatedly every 3 seconds while chat is open
  const intervalId = setInterval(markMessagesAsSeen, 3000);

  return () => clearInterval(intervalId); // clean up on chat switch/unmount
}, [selectedUser?._id, authUser?._id]);


// selectedUser._id

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  const filteredMessages = messages.filter((msg) =>
  msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
);
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {
        filteredMessages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
                <div className="chat-bubble flex flex-col relative pr-6">
  {message.image && (
    <img
      src={message.image}
      alt="Attachment"
      className="sm:max-w-[200px] rounded-md mb-2"
    />
  )}
  {message.text && <p>{message.text}</p>}

  {message.senderId === authUser._id && (
    <span className={`absolute bottom-1 right-1 text-xs ${message.isSeen ? "text-blue-500" : "text-gray-400"}`}>
      {message.isSeen ? "✓✓" : "✓"}
    </span>
  )}
</div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
