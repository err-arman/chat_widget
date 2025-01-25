"use client"

import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import { Send, Paperclip } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "other"
  file?: string
}

const ChatBoard = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How are you?", sender: "other" },
    { id: 2, text: "I'm doing great, thanks for asking!", sender: "user" },
    { id: 3, text: "That's wonderful to hear!", sender: "other" },
  ])
  const [newMessage, setNewMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: "user" }])
      setNewMessage("")
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you'd upload the file to a server here
      setMessages([
        ...messages,
        { id: messages.length + 1, text: `File: ${file.name}`, sender: "user", file: URL.createObjectURL(file) },
      ])
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                message.sender === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800"
              }`}
            >
              <p>{message.text}</p>
              {message.file && (
                <img src={message.file || "/placeholder.svg"} alt="Uploaded file" className="mt-2 max-w-full h-auto" />
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-white flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 transition-colors duration-200"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors duration-200"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

export default ChatBoard

