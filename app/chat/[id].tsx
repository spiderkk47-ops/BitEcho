import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { useChats } from '@/hooks/useChats';
import { MessageBubble } from '@/components/feature/MessageBubble';
import { Avatar } from '@/components/ui/Avatar';
import { P2PIndicator } from '@/components/ui/P2PIndicator';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { chats, messages, sendMessage, deleteMessage, editMessage, markAsRead } = useChats();
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const listRef = useRef<FlatList>(null);

  const chat = chats.find(c => c.id === id);
  const chatMessages = messages[id || ''] || [];

  useEffect(() => {
    if (id) markAsRead(id);
  }, [id]);

  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [chatMessages.length]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || !id) return;
    sendMessage(id, text);
    setInputText('');
  };

  const handleEditStart = (msgId: string, currentText: string) => {
    setEditingId(msgId);
    setEditText(currentText);
  };

  const handleEditSubmit = () => {
    if (editingId && editText.trim() && id) {
      editMessage(id, editingId, editText.trim());
    }
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (msgId: string) => {
    if (id) deleteMessage(id, msgId);
  };

  if (!chat) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: Colors.textPrimary, margin: 20 }}>Чат не найден</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Pressable style={styles.headerInfo} onPress={() => setShowInfo(true)}>
          <Avatar
            initials={chat.avatarInitials}
            color={chat.avatarColor}
            size={38}
            isOnline={chat.isOnline}
          />
          <View style={styles.headerText}>
            <View style={styles.headerNameRow}>
              <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
              {chat.isVerified && (
                <MaterialIcons name="verified" size={14} color={Colors.primary} />
              )}
            </View>
            <View style={styles.headerSubRow}>
              {chat.p2pActive ? (
                <P2PIndicator compact />
              ) : null}
              <Text style={styles.chatStatus}>
                {chat.type === 'group'
                  ? `${chat.membersCount?.toLocaleString()} участников`
                  : chat.type === 'channel'
                  ? `${chat.membersCount?.toLocaleString()} подписчиков`
                  : chat.isOnline
                  ? 'онлайн'
                  : 'был(а) недавно'}
              </Text>
            </View>
          </View>
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn} hitSlop={8}>
            <MaterialIcons name="call" size={22} color={Colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.iconBtn} hitSlop={8}>
            <MaterialIcons name="more-vert" size={22} color={Colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Encryption Banner */}
      {chat.type === 'secret' && (
        <View style={styles.secretBanner}>
          <MaterialIcons name="lock" size={12} color={Colors.warning} />
          <Text style={styles.secretText}>Секретный чат · P2P · E2E-шифрование · Автоудаление</Text>
        </View>
      )}
      {chat.isEncrypted && chat.type !== 'secret' && (
        <View style={styles.encryptBanner}>
          <MaterialIcons name="lock" size={12} color={Colors.primary} />
          <Text style={styles.encryptText}>Зашифровано E2E · Никто кроме вас не видит сообщения</Text>
        </View>
      )}

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={chatMessages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              onDelete={handleDelete}
              onEdit={handleEditStart}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={() => (
            <View style={styles.emptyChat}>
              <MaterialIcons name="lock" size={40} color={Colors.textSubtle} />
              <Text style={styles.emptyChatText}>Начните зашифрованный разговор</Text>
            </View>
          )}
        />

        {/* Edit bar */}
        {editingId && (
          <View style={styles.editBar}>
            <MaterialIcons name="edit" size={16} color={Colors.primary} />
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleEditSubmit}
              placeholderTextColor={Colors.textSubtle}
            />
            <Pressable onPress={handleEditSubmit} hitSlop={8}>
              <MaterialIcons name="check" size={22} color={Colors.primary} />
            </Pressable>
            <Pressable onPress={() => { setEditingId(null); setEditText(''); }} hitSlop={8}>
              <MaterialIcons name="close" size={22} color={Colors.error} />
            </Pressable>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <Pressable style={styles.attachBtn} hitSlop={8}>
            <MaterialIcons name="attach-file" size={22} color={Colors.textSecondary} />
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="Сообщение..."
            placeholderTextColor={Colors.textSubtle}
            value={inputText}
            onChangeText={setInputText}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <Pressable style={styles.emojiBtn} hitSlop={8}>
            <MaterialIcons name="emoji-emotions" size={22} color={Colors.textSecondary} />
          </Pressable>
          {inputText.trim().length > 0 ? (
            <Pressable
              style={({ pressed }) => [styles.sendBtn, pressed && { opacity: 0.8 }]}
              onPress={handleSend}
            >
              <MaterialIcons name="send" size={20} color={Colors.textInverse} />
            </Pressable>
          ) : (
            <Pressable style={styles.micBtn} hitSlop={8}>
              <MaterialIcons name="mic" size={22} color={Colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Info Modal */}
      <Modal visible={showInfo} animationType="slide" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setShowInfo(false)}>
          <View style={styles.infoPanel}>
            <View style={styles.infoPanelHandle} />
            <Avatar initials={chat.avatarInitials} color={chat.avatarColor} size={64} />
            <Text style={styles.infoName}>{chat.name}</Text>
            {chat.isVerified && (
              <View style={styles.infoVerified}>
                <MaterialIcons name="verified" size={14} color={Colors.primary} />
                <Text style={styles.infoVerifiedText}>Верифицирован</Text>
              </View>
            )}
            <View style={styles.infoStats}>
              {chat.membersCount ? (
                <View style={styles.infoStat}>
                  <Text style={styles.infoStatValue}>{chat.membersCount.toLocaleString()}</Text>
                  <Text style={styles.infoStatLabel}>участников</Text>
                </View>
              ) : null}
              <View style={styles.infoStat}>
                <MaterialIcons name="lock" size={20} color={Colors.primary} />
                <Text style={styles.infoStatLabel}>E2E</Text>
              </View>
              {chat.p2pActive && (
                <View style={styles.infoStat}>
                  <MaterialIcons name="device-hub" size={20} color={Colors.success} />
                  <Text style={styles.infoStatLabel}>P2P</Text>
                </View>
              )}
            </View>
            <View style={styles.infoActions}>
              <Pressable style={styles.infoActionBtn}>
                <MaterialIcons name="call" size={22} color={Colors.primary} />
                <Text style={styles.infoActionLabel}>Звонок</Text>
              </Pressable>
              <Pressable style={styles.infoActionBtn}>
                <MaterialIcons name="videocam" size={22} color={Colors.primary} />
                <Text style={styles.infoActionLabel}>Видео</Text>
              </Pressable>
              <Pressable style={styles.infoActionBtn}>
                <MaterialIcons name="search" size={22} color={Colors.primary} />
                <Text style={styles.infoActionLabel}>Поиск</Text>
              </Pressable>
              <Pressable style={styles.infoActionBtn}>
                <MaterialIcons name="notifications-off" size={22} color={Colors.primary} />
                <Text style={styles.infoActionLabel}>Тишина</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chatName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    flex: 1,
  },
  headerSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chatStatus: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
  },
  secretBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.warningDim,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.warning + '33',
  },
  secretText: {
    fontSize: FontSize.xs,
    color: Colors.warning,
  },
  encryptBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryDim,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  encryptText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  messageList: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyChatText: {
    fontSize: FontSize.sm,
    color: Colors.textSubtle,
  },
  editBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.primary + '44',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    gap: 10,
  },
  editInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    padding: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 6,
  },
  attachBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emojiBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  infoPanel: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  infoPanelHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: 8,
  },
  infoName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  infoVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoVerifiedText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  infoStats: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  infoStat: {
    alignItems: 'center',
    gap: 4,
  },
  infoStatValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  infoStatLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
  },
  infoActions: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },
  infoActionBtn: {
    alignItems: 'center',
    gap: 6,
  },
  infoActionLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
  },
});
