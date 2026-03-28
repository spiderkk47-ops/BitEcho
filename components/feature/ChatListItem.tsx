import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { P2PIndicator } from '@/components/ui/P2PIndicator';
import { Chat } from '@/services/mockData';

interface ChatListItemProps {
  chat: Chat;
  onPress: () => void;
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = diff / (1000 * 60 * 60);
  if (hours < 24) {
    return date.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
  }
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Вчера';
  return date.toLocaleDateString('ru', { day: '2-digit', month: '2-digit' });
}

function getChatTypeIcon(type: Chat['type']) {
  switch (type) {
    case 'group': return 'group';
    case 'channel': return 'campaign';
    case 'secret': return 'lock';
    default: return null;
  }
}

export const ChatListItem = memo(function ChatListItem({ chat, onPress }: ChatListItemProps) {
  const typeIcon = getChatTypeIcon(chat.type);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Avatar
        initials={chat.avatarInitials}
        color={chat.avatarColor}
        size={50}
        isOnline={chat.isOnline}
        isEncrypted={chat.type === 'secret'}
      />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            {typeIcon && (
              <MaterialIcons
                name={typeIcon as any}
                size={14}
                color={Colors.textSubtle}
                style={styles.typeIcon}
              />
            )}
            <Text style={styles.name} numberOfLines={1}>
              {chat.name}
            </Text>
            {chat.isVerified && (
              <MaterialIcons name="verified" size={14} color={Colors.primary} style={styles.verifiedIcon} />
            )}
          </View>
          <View style={styles.rightMeta}>
            {chat.isMuted && (
              <MaterialIcons name="volume-off" size={12} color={Colors.textSubtle} />
            )}
            <Text style={styles.time}>{formatTime(chat.lastMessageTime)}</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.messageRow}>
            {chat.membersCount ? (
              <Text style={styles.memberCount}>{chat.membersCount.toLocaleString()} · </Text>
            ) : null}
            <Text style={styles.lastMessage} numberOfLines={1}>
              {chat.lastMessage}
            </Text>
          </View>
          <View style={styles.indicators}>
            {chat.p2pActive && <P2PIndicator compact />}
            {chat.unreadCount > 0 && (
              <Badge count={chat.unreadCount} color={chat.isMuted ? Colors.textSubtle : Colors.primary} />
            )}
            {chat.isPinned && chat.unreadCount === 0 && (
              <MaterialIcons name="push-pin" size={14} color={Colors.textSubtle} />
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    gap: 12,
  },
  pressed: {
    backgroundColor: Colors.card,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  typeIcon: {
    marginRight: 2,
  },
  verifiedIcon: {
    marginLeft: 2,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    flex: 1,
  },
  rightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  messageRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  memberCount: {
    fontSize: FontSize.sm,
    color: Colors.textSubtle,
  },
  lastMessage: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
