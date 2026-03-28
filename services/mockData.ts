export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text?: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'system';
  timestamp: Date;
  isRead: boolean;
  isEncrypted: boolean;
  isDeleted?: boolean;
  isEdited?: boolean;
  selfDestruct?: number; // seconds
  reactions?: { emoji: string; count: number }[];
}

export interface Chat {
  id: string;
  type: 'direct' | 'group' | 'channel' | 'secret';
  name: string;
  avatarColor: string;
  avatarInitials: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isVerified?: boolean;
  membersCount?: number;
  isEncrypted: boolean;
  p2pActive?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  username: string;
  avatarColor: string;
  avatarInitials: string;
  isOnline: boolean;
  lastSeen?: Date;
  bio?: string;
  isVerified?: boolean;
}

export interface CallRecord {
  id: string;
  contactName: string;
  avatarColor: string;
  avatarInitials: string;
  type: 'incoming' | 'outgoing' | 'missed';
  callType: 'audio' | 'video';
  timestamp: Date;
  duration?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'receive' | 'send' | 'stake' | 'burn' | 'reward';
  amount: number;
  address: string;
  timestamp: Date;
  status: 'confirmed' | 'pending' | 'failed';
  note?: string;
}

const now = new Date();
const ago = (minutes: number) => new Date(now.getTime() - minutes * 60 * 1000);

export const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    type: 'secret',
    name: 'Alex Turner',
    avatarColor: '#7B2FFF',
    avatarInitials: 'AT',
    lastMessage: '🔒 Сообщение удалено',
    lastMessageTime: ago(2),
    unreadCount: 3,
    isOnline: true,
    isPinned: true,
    isEncrypted: true,
    p2pActive: true,
  },
  {
    id: '2',
    type: 'group',
    name: 'BitEcho Devs',
    avatarColor: '#00D4FF',
    avatarInitials: 'BD',
    lastMessage: 'New P2P node deployed to mainnet',
    lastMessageTime: ago(15),
    unreadCount: 12,
    isEncrypted: true,
    membersCount: 847,
    isVerified: true,
  },
  {
    id: '3',
    type: 'direct',
    name: 'Maria Santos',
    avatarColor: '#00E676',
    avatarInitials: 'MS',
    lastMessage: 'Перевела 50 VEL ✓',
    lastMessageTime: ago(45),
    unreadCount: 0,
    isOnline: false,
    isEncrypted: true,
    p2pActive: true,
  },
  {
    id: '4',
    type: 'channel',
    name: 'VEL Announcements',
    avatarColor: '#FFB800',
    avatarInitials: 'VEL',
    lastMessage: 'Staking rewards distributed: +2.4%',
    lastMessageTime: ago(120),
    unreadCount: 1,
    isEncrypted: false,
    membersCount: 42100,
    isVerified: true,
  },
  {
    id: '5',
    type: 'direct',
    name: 'Dmitri Volkov',
    avatarColor: '#FF4D6A',
    avatarInitials: 'DV',
    lastMessage: 'Завтра на звонке обсудим',
    lastMessageTime: ago(180),
    unreadCount: 0,
    isOnline: true,
    isEncrypted: true,
    p2pActive: false,
  },
  {
    id: '6',
    type: 'group',
    name: 'Crypto Bears 🐻',
    avatarColor: '#FF6B35',
    avatarInitials: 'CB',
    lastMessage: 'Кто следит за BTC сегодня?',
    lastMessageTime: ago(240),
    unreadCount: 0,
    isEncrypted: true,
    membersCount: 1204,
  },
  {
    id: '7',
    type: 'secret',
    name: 'Yuki Tanaka',
    avatarColor: '#E040FB',
    avatarInitials: 'YT',
    lastMessage: '⏱ Самоуничтожение через 10 сек',
    lastMessageTime: ago(360),
    unreadCount: 0,
    isOnline: false,
    isEncrypted: true,
    p2pActive: true,
  },
  {
    id: '8',
    type: 'channel',
    name: 'BitEcho News',
    avatarColor: '#00D4FF',
    avatarInitials: 'BN',
    lastMessage: 'v2.1.0 release notes published',
    lastMessageTime: ago(720),
    unreadCount: 5,
    isEncrypted: false,
    membersCount: 128400,
    isVerified: true,
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      chatId: '1',
      senderId: 'them',
      text: 'Привет! Подключился через новый P2P узел',
      type: 'text',
      timestamp: ago(30),
      isRead: true,
      isEncrypted: true,
    },
    {
      id: 'm2',
      chatId: '1',
      senderId: 'me',
      text: 'Вижу тебя через три хопа. Задержка 12мс 🔥',
      type: 'text',
      timestamp: ago(28),
      isRead: true,
      isEncrypted: true,
    },
    {
      id: 'm3',
      chatId: '1',
      senderId: 'them',
      text: 'Перевожу тебе 100 VEL за координацию',
      type: 'text',
      timestamp: ago(10),
      isRead: true,
      isEncrypted: true,
    },
    {
      id: 'm4',
      chatId: '1',
      senderId: 'them',
      text: 'Это секретный чат. Сообщения удалятся через 1 час',
      type: 'system',
      timestamp: ago(30),
      isRead: true,
      isEncrypted: true,
    },
    {
      id: 'm5',
      chatId: '1',
      senderId: 'them',
      text: 'Получил транзакцию?',
      type: 'text',
      timestamp: ago(2),
      isRead: false,
      isEncrypted: true,
    },
    {
      id: 'm6',
      chatId: '1',
      senderId: 'them',
      text: 'Пинг есть?',
      type: 'text',
      timestamp: ago(1),
      isRead: false,
      isEncrypted: true,
    },
  ],
  '2': [
    {
      id: 'm10',
      chatId: '2',
      senderId: 'user3',
      text: 'DHT routing table updated for EU nodes',
      type: 'text',
      timestamp: ago(60),
      isRead: true,
      isEncrypted: true,
    },
    {
      id: 'm11',
      chatId: '2',
      senderId: 'user4',
      text: 'Encryption layer v3 passed all audits ✅',
      type: 'text',
      timestamp: ago(30),
      isRead: true,
      isEncrypted: true,
    },
    {
      id: 'm12',
      chatId: '2',
      senderId: 'user5',
      text: 'New P2P node deployed to mainnet',
      type: 'text',
      timestamp: ago(15),
      isRead: false,
      isEncrypted: true,
    },
  ],
  '3': [
    {
      id: 'm20',
      chatId: '3',
      senderId: 'me',
      text: 'Привет Мария! Получила мой файл?',
      type: 'text',
      timestamp: ago(120),
      isRead: true,
      isEncrypted: true,
    },
    {
      id: 'm21',
      chatId: '3',
      senderId: 'them',
      text: 'Да, всё пришло через P2P напрямую! Без серверов — это кайф',
      type: 'text',
      timestamp: ago(90),
      isRead: true,
      isEncrypted: true,
    },
    {
      id: 'm22',
      chatId: '3',
      senderId: 'them',
      text: 'Перевела 50 VEL ✓',
      type: 'text',
      timestamp: ago(45),
      isRead: true,
      isEncrypted: true,
    },
  ],
};

export const MOCK_CALLS: CallRecord[] = [
  {
    id: 'c1',
    contactName: 'Alex Turner',
    avatarColor: '#7B2FFF',
    avatarInitials: 'AT',
    type: 'incoming',
    callType: 'video',
    timestamp: ago(60),
    duration: '12:34',
  },
  {
    id: 'c2',
    contactName: 'Maria Santos',
    avatarColor: '#00E676',
    avatarInitials: 'MS',
    type: 'outgoing',
    callType: 'audio',
    timestamp: ago(180),
    duration: '5:22',
  },
  {
    id: 'c3',
    contactName: 'Dmitri Volkov',
    avatarColor: '#FF4D6A',
    avatarInitials: 'DV',
    type: 'missed',
    callType: 'video',
    timestamp: ago(360),
  },
  {
    id: 'c4',
    contactName: 'Yuki Tanaka',
    avatarColor: '#E040FB',
    avatarInitials: 'YT',
    type: 'incoming',
    callType: 'audio',
    timestamp: ago(720),
    duration: '2:11',
  },
  {
    id: 'c5',
    contactName: 'BitEcho Devs',
    avatarColor: '#00D4FF',
    avatarInitials: 'BD',
    type: 'outgoing',
    callType: 'video',
    timestamp: ago(1440),
    duration: '45:10',
  },
];

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx1',
    type: 'receive',
    amount: 100,
    address: '0xA3f7...9E2D',
    timestamp: ago(10),
    status: 'confirmed',
    note: 'От Alex Turner',
  },
  {
    id: 'tx2',
    type: 'stake',
    amount: 500,
    address: 'Staking Pool #12',
    timestamp: ago(60),
    status: 'confirmed',
    note: 'Стейкинг 30 дней',
  },
  {
    id: 'tx3',
    type: 'reward',
    amount: 12.4,
    address: 'Staking Rewards',
    timestamp: ago(120),
    status: 'confirmed',
    note: 'Награда за активность',
  },
  {
    id: 'tx4',
    type: 'send',
    amount: 50,
    address: '0xB9c1...4F8A',
    timestamp: ago(180),
    status: 'confirmed',
    note: 'Maria Santos',
  },
  {
    id: 'tx5',
    type: 'burn',
    amount: 25,
    address: '0x0000...0000',
    timestamp: ago(720),
    status: 'confirmed',
    note: 'Сжигание токенов',
  },
  {
    id: 'tx6',
    type: 'receive',
    amount: 200,
    address: '0xD5e2...7C1B',
    timestamp: ago(1440),
    status: 'confirmed',
    note: 'Перевод от Dmitri',
  },
];

export const MOCK_WALLET = {
  address: '0xF4a9...3E7C',
  velBalance: 2847.6,
  velUsd: 1.24,
  stakedAmount: 500,
  stakingApy: 12.4,
  stakingRewards: 24.8,
  totalValueUsd: 3531.03,
};
