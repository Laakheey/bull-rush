// components/admin/SupportDashboard.tsx
import React, { useState, useEffect, useRef } from "react";
import { Search, Send, Image as ImageIcon, Loader2, X, Clock, MessageCircle } from "lucide-react";
import { Loading } from "../components";
import { useAdminSupport } from "../hooks/useAdminSupport";

const SupportDashboard: React.FC = () => {
  const {
    userChats,
    activeChatUserId,
    messages,
    loadingChats,
    loadingMessages,
    setActiveChatUserId,
    sendAdminReply,
    uploadImage,
  } = useAdminSupport();

  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeUser = userChats.find((u) => u.user_id === activeChatUserId);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;
    if (!activeChatUserId) return;

    let imageUrl = "";
    if (selectedFile) {
      setIsUploading(true);
      imageUrl = (await uploadImage(selectedFile)) || "";
      setIsUploading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }

    await sendAdminReply(activeChatUserId, input.trim(), imageUrl);
    setInput("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removePreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const filteredChats = userChats.filter(
    (chat) =>
      chat.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.user_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loadingChats) return <Loading />;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - User List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Support Inbox</h2>
          <p className="text-sm text-gray-500 mt-1">{userChats.length} active conversations</p>

          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.user_id}
                onClick={() => setActiveChatUserId(chat.user_id)}
                className={`w-full p-4 flex items-start gap-4 hover:bg-indigo-50 transition-colors border-b border-gray-100 ${
                  activeChatUserId === chat.user_id ? "bg-indigo-50 border-l-4 border-l-indigo-600" : ""
                }`}
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                  {chat.user_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{chat.user_name}</h4>
                    {chat.unread_count > 0 && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        {chat.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{chat.user_email}</p>
                  <p className="text-sm text-gray-600 mt-1 truncate">{chat.last_message}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(chat.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeUser ? (
          <>
            {/* Chat Header */}
            <div className="p-6 bg-white border-b border-gray-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                {activeUser.user_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{activeUser.user_name}</h3>
                <p className="text-sm text-gray-500">{activeUser.user_email}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {loadingMessages && (
                <div className="text-center text-gray-400">Loading messages...</div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.is_admin_reply ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-lg px-5 py-3 rounded-2xl text-sm shadow-sm ${
                      msg.is_admin_reply
                        ? "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                        : "bg-indigo-600 text-white rounded-tr-none"
                    }`}
                  >
                    {msg.image_url && (
                      <a href={msg.image_url} target="_blank" rel="noreferrer">
                        <img
                          src={msg.image_url}
                          alt="Attachment"
                          className="rounded-lg mb-3 max-h-80 object-cover cursor-zoom-in"
                        />
                      </a>
                    )}
                    <p>{msg.content}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t p-4">
              {previewUrl && (
                <div className="mb-4 p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                    <button
                      onClick={removePreview}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">Image ready to send</p>
                </div>
              )}

              <form onSubmit={handleSendReply} className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-11 h-11 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <ImageIcon size={20} className="text-gray-600" />
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your reply..."
                  disabled={isUploading}
                  className="flex-1 px-5 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="submit"
                  disabled={isUploading || (!input.trim() && !selectedFile)}
                  className="w-11 h-11 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg"
                >
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageCircle size={80} className="mx-auto mb-6 opacity-20" />
              <p className="text-xl">Select a conversation to start replying</p>
              <p className="text-sm mt-2">All user support requests appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;