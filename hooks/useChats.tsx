import { useContext } from 'react';
import { ChatContext } from '@/contexts/ChatContext';

export function useChats() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChats must be used within ChatProvider');
  return context;
}
