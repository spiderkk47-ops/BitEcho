import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';

const CONTACTS = [
  { id: 'c1', name: 'Alex Turner', username: '@alex_t', avatarColor: '#7B2FFF', avatarInitials: 'AT', isOnline: true },
  { id: 'c2', name: 'Maria Santos', username: '@maria_s', avatarColor: '#00E676', avatarInitials: 'MS', isOnline: false },
  { id: 'c3', name: 'Dmitri Volkov', username: '@dvolkov', avatarColor: '#FF4D6A', avatarInitials: 'DV', isOnline: true },
  { id: 'c4', name: 'Yuki Tanaka', username: '@yuki_t', avatarColor: '#E040FB', avatarInitials: 'YT', isOnline: false },
  { id: 'c5', name: 'Chen Wei', username: '@chenw', avatarColor: '#FFB800', avatarInitials: 'CW', isOnline: true },
  { id: 'c6', name: 'Lucas Ferreira', username: '@lferr', avatarColor: '#00D4FF', avatarInitials: 'LF', isOnline: false },
];

const QUICK_ACTIONS = [
  { id: 'new-group', icon: 'group-add', label: 'Новая группа', color: Colors.primary },
  { id: 'new-channel', icon: 'campaign', label: 'Новый канал', color: Colors.secondary },
  { id: 'secret', icon: 'lock', label: 'Секретный чат', color: Colors.warning },
  { id: 'contact', icon: 'person-add', label: 'Добавить контакт', color: Colors.success },
];

export default function NewChatScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Новый чат</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={18} color={Colors.textSubtle} />
          <TextInput
            style={styles.searchInput}
            placeholder="Имя или @username..."
            placeholderTextColor={Colors.textSubtle}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
        </View>
      </View>

      <FlatList
        data={[]}
        keyExtractor={() => ''}
        renderItem={() => null}
        ListHeaderComponent={() => (
          <>
            {/* Quick actions */}
            {!search && (
              <>
                <View style={styles.quickActions}>
                  {QUICK_ACTIONS.map(action => (
                    <Pressable
                      key={action.id}
                      style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.8 }]}
                    >
                      <View style={[styles.quickActionIcon, { backgroundColor: action.color + '22' }]}>
                        <MaterialIcons name={action.icon as any} size={22} color={action.color} />
                      </View>
                      <Text style={styles.quickActionLabel}>{action.label}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.sectionLabel}>КОНТАКТЫ</Text>
              </>
            )}

            {/* Contacts */}
            {filtered.map(contact => (
              <Pressable
                key={contact.id}
                style={({ pressed }) => [styles.contactRow, pressed && styles.contactPressed]}
                onPress={() => {
                  router.replace(`/chat/1`);
                }}
              >
                <Avatar
                  initials={contact.avatarInitials}
                  color={contact.avatarColor}
                  size={46}
                  isOnline={contact.isOnline}
                />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactUsername}>{contact.username}</Text>
                </View>
                <View style={styles.contactActions}>
                  <Pressable style={styles.contactBtn} hitSlop={8}>
                    <MaterialIcons name="message" size={18} color={Colors.primary} />
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </>
        )}
        showsVerticalScrollIndicator={false}
      />
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
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  searchRow: {
    paddingHorizontal: Spacing.md,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    padding: 0,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginBottom: 20,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: FontWeight.medium,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
    paddingHorizontal: Spacing.md,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: 12,
  },
  contactPressed: {
    backgroundColor: Colors.card,
  },
  contactInfo: {
    flex: 1,
    gap: 3,
  },
  contactName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  contactUsername: {
    fontSize: FontSize.sm,
    color: Colors.textSubtle,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
