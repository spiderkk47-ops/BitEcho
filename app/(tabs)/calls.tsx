import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';
import { MOCK_CALLS, CallRecord } from '@/services/mockData';

function formatCallTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = diff / (1000 * 60 * 60);
  if (hours < 24) return date.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
  if (hours < 48) return 'Вчера';
  return date.toLocaleDateString('ru', { day: '2-digit', month: 'short' });
}

interface CallItemProps {
  call: CallRecord;
}

function CallItem({ call }: CallItemProps) {
  const isMissed = call.type === 'missed';
  return (
    <View style={styles.callItem}>
      <Avatar initials={call.avatarInitials} color={call.avatarColor} size={46} />
      <View style={styles.callInfo}>
        <Text style={[styles.callerName, isMissed && styles.missedName]}>
          {call.contactName}
        </Text>
        <View style={styles.callMeta}>
          <MaterialIcons
            name={
              call.type === 'incoming'
                ? 'call-received'
                : call.type === 'outgoing'
                ? 'call-made'
                : 'call-missed'
            }
            size={14}
            color={isMissed ? Colors.error : call.type === 'incoming' ? Colors.success : Colors.primary}
          />
          <Text style={[styles.callType, isMissed && { color: Colors.error }]}>
            {call.type === 'incoming' ? 'Входящий' : call.type === 'outgoing' ? 'Исходящий' : 'Пропущенный'}
          </Text>
          <Text style={styles.dot}>·</Text>
          <MaterialIcons
            name={call.callType === 'video' ? 'videocam' : 'mic'}
            size={12}
            color={Colors.textSubtle}
          />
          <Text style={styles.callTypeLabel}>{call.callType === 'video' ? 'видео' : 'аудио'}</Text>
          {call.duration && (
            <>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.callDuration}>{call.duration}</Text>
            </>
          )}
        </View>
      </View>
      <View style={styles.callRight}>
        <Text style={styles.callTime}>{formatCallTime(call.timestamp)}</Text>
        <Pressable style={styles.callAgainBtn} hitSlop={8}>
          <MaterialIcons
            name={call.callType === 'video' ? 'videocam' : 'call'}
            size={20}
            color={Colors.primary}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default function CallsScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'missed'>('all');

  const filtered = activeTab === 'missed'
    ? MOCK_CALLS.filter(c => c.type === 'missed')
    : MOCK_CALLS;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Звонки</Text>
        <Pressable style={styles.newCallBtn}>
          <MaterialIcons name="add-call" size={22} color={Colors.primary} />
        </Pressable>
      </View>

      {/* P2P Badge */}
      <View style={styles.p2pBanner}>
        <MaterialIcons name="security" size={14} color={Colors.primary} />
        <Text style={styles.p2pText}>Все звонки защищены · P2P · E2E · Без серверов</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['all', 'missed'] as const).map(tab => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab === 'all' ? 'Все' : 'Пропущенные'}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CallItem call={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialIcons name="call" size={48} color={Colors.textSubtle} />
            <Text style={styles.emptyTitle}>Нет пропущенных звонков</Text>
          </View>
        )}
      />

      {/* Quick dial */}
      <View style={styles.quickDial}>
        <Pressable style={[styles.quickBtn, { backgroundColor: Colors.primaryDim, borderColor: Colors.primary }]}>
          <MaterialIcons name="call" size={24} color={Colors.primary} />
          <Text style={[styles.quickBtnLabel, { color: Colors.primary }]}>Аудио</Text>
        </Pressable>
        <Pressable style={[styles.quickBtn, { backgroundColor: Colors.secondaryDim, borderColor: Colors.secondary }]}>
          <MaterialIcons name="videocam" size={24} color={Colors.secondary} />
          <Text style={[styles.quickBtnLabel, { color: Colors.secondary }]}>Видео</Text>
        </Pressable>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  newCallBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  p2pBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryDim,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '33',
  },
  p2pText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginBottom: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.primaryDim,
    borderColor: Colors.primary,
  },
  tabLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSubtle,
    fontWeight: FontWeight.medium,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: 12,
  },
  callInfo: {
    flex: 1,
    gap: 4,
  },
  callerName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  missedName: {
    color: Colors.error,
  },
  callMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  callType: {
    fontSize: FontSize.sm,
    color: Colors.textSubtle,
  },
  callTypeLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSubtle,
  },
  dot: {
    fontSize: FontSize.sm,
    color: Colors.textSubtle,
  },
  callDuration: {
    fontSize: FontSize.sm,
    color: Colors.textSubtle,
  },
  callRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  callTime: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
  },
  callAgainBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    marginLeft: 70,
    backgroundColor: Colors.border,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: FontSize.md,
    color: Colors.textSubtle,
  },
  quickDial: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  quickBtnLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
