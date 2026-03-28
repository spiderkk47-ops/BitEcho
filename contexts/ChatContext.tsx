import React, { createContext, useState, ReactNode } from 'react';
import { MOCK_CHATS, MOCK_MESSAGES, Chat, Message } from '@/services/mockData';

interface ChatContextType {
  chats: Chat[];
  messages: Record<string, Message[]>;
  sendMessage: (chatId: string, text: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  editMessage: (chatId: string, messageId: string, newText: string) => void;
  markAsRead: (chatId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeFilter: 'all' | 'personal' | 'groups' | 'channels' | 'secret';
  setActiveFilter: (f: 'all' | 'personal' | 'groups' | 'channels' | 'secret') => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'personal' | 'groups' | 'channels' | 'secret'>('all');

  const sendMessage = (chatId: string, text: string) => {
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      chatId,
      senderId: 'me',
      text,
      type: 'text',
      timestamp: new Date(),
      isRead: false,
      isEncrypted: true,
    };
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg],
    }));
    setChats(prev =>
      prev.map(c =>
        c.id === chatId
          ? { ...c, lastMessage: text, lastMessageTime: new Date() }
          : c
      )
    );
  };

  const deleteMessage = (chatId: string, messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [chatId]: (prev[chatId] || []).map(m =>
        m.id === messageId ? { ...m, isDeleted: true, text: undefined } : m
      ),
    }));
  };

  const editMessage = (chatId: string, messageId: string, newText: string) => {
    setMessages(prev => ({
      ...prev,
      [chatId]: (prev[chatId] || []).map(m =>
        m.id === messageId ? { ...m, text: newText, isEdited: true } : m
      ),
    }));
  };

  const markAsRead = (chatId: string) => {
    setChats(prev =>
      prev.map(c => (c.id === chatId ? { ...c, unreadCount: 0 } : c))
    );
    setMessages(prev => ({
      ...prev,
      [chatId]: (prev[chatId] || []).map(m => ({ ...m, isRead: true })),
    }));
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        sendMessage,
        deleteMessage,
        editMessage,
        markAsRead,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
