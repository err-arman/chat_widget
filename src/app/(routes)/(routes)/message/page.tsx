import ChatBoard from "@/components/chat/ChatBoard";
import ChatBoardForAdmin from "@/components/dashboard/ChatBoardForAdmin";
import MessageList from "@/components/message/message-list";

const Message = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {" "}
      {/* Assuming a 4rem tall navbar */}
      <div className="w-1/5 bg-white overflow-y-auto p-4">
        {/* <p className="text-white">Left sidebar content</p> */}
        <MessageList />
        {/* Add more sidebar content here */}
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatBoardForAdmin />
      </div>
    </div>
  );
};

export default Message;
