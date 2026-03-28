import React, { useState, memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Message } from '@/services/mockData';

interface MessageBubbleProps {
  message: Message;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
}

export const MessageBubble = memo(function MessageBubble({ message, onDelete, onEdit }: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const isMe = message.senderId === 'me';
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <View style={styles.systemContainer}>
        <Text style={styles.systemText}>{message.text}</Text>
      </View>
    );
  }

  if (message.isDeleted) {
    return (
      <View style={[styles.bubbleWrapper, isMe ? styles.myWrapper : styles.theirWrapper]}>
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble, styles.deletedBubble]}>
          <Text style={styles.deletedText}>Сообщение удалено</Text>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      onLongPress={() => isMe && setShowActions(!showActions)}
      style={[styles.bubbleWrapper, isMe ? styles.myWrapper : styles.theirWrapper]}
    >
      <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
        {message.isEncrypted && !isMe && (
          <View style={styles.encryptedRow}>
            <MaterialIcons name="lock" size={9} color={Colors.primary} />
            <Text style={styles.encryptedLabel}>E2E</Text>
          </View>
        )}
        <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>
          {message.text}
        </Text>
        <View style={styles.metaRow}>
          {message.isEdited && <Text style={styles.editedLabel}>ред. </Text>}
          <Text style={[styles.timeText, isMe ? styles.myTime : styles.theirTime]}>
            {formatTime(message.timestamp)}
          </Text>
          {isMe && (
            <MaterialIcons
              name={message.isRead ? 'done-all' : 'done'}
              size={13}
              color={message.isRead ? Colors.primary : Colors.textSubtle}
              style={styles.readIcon}
            />
          )}
        </View>
      </View>
      {showActions && isMe && (
        <View style={styles.actions}>
          <Pressable
            onPress={() => {
              setShowActions(false);
              onEdit(message.id, message.text || '');
            }}
            style={styles.actionBtn}
          >
            <MaterialIcons name="edit" size={16} color={Colors.primary} />
          </Pressable>
          <Pressable
            onPress={() => {
              setShowActions(false);
              onDelete(message.id);
            }}
            style={styles.actionBtn}
          >
            <MaterialIcons name="delete" size={16} color={Colors.error} />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  bubbleWrapper: {
    marginVertical: 2,
    paddingHorizontal: Spacing.md,
    flexDirection: 'column',
  },
  myWrapper: {
    alignItems: 'flex-end',
  },
  theirWrapper: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: Colors.primaryDim,
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primary + '33',
  },
  theirBubble: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deletedBubble: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
  },
  deletedText: {
    fontSize: FontSize.sm,
    color: Colors.textSubtle,
    fontStyle: 'italic',
  },
  encryptedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2,
  },
  encryptedLabel: {
    fontSize: 9,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  myText: {
    color: Colors.textPrimary,
  },
  theirText: {
    color: Colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'flex-end',
    gap: 2,
  },
  editedLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
    fontStyle: 'italic',
  },
  timeText: {
    fontSize: FontSize.xs,
  },
  myTime: {
    color: Colors.textSubtle,
  },
  theirTime: {
    color: Colors.textSubtle,
  },
  readIcon: {
    marginLeft: 2,
  },
  systemContainer: {
    alignItems: 'center',
    marginVertical: 6,
    paddingHorizontal: Spacing.md,
  },
  systemText: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
