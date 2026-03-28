import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAlert } from '@/template';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';
import { Avatar } from '@/components/ui/Avatar';

interface SettingRowProps {
  icon: string;
  label: string;
  subtitle?: string;
  value?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  color?: string;
  danger?: boolean;
}

function SettingRow({
  icon, label, subtitle, value, toggle, toggleValue, onToggle, onPress, color = Colors.primary, danger
}: SettingRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.settingRow, pressed && !toggle && styles.rowPressed]}
      onPress={onPress}
      disabled={toggle && !onPress}
    >
      <View style={[styles.settingIcon, { backgroundColor: color + '22' }]}>
        <MaterialIcons name={icon as any} size={20} color={danger ? Colors.error : color} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, danger && { color: Colors.error }]}>{label}</Text>
        {subtitle ? <Text style={styles.settingSubtitle}>{subtitle}</Text> : null}
      </View>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: Colors.border, true: Colors.primary + '66' }}
          thumbColor={toggleValue ? Colors.primary : Colors.textSubtle}
        />
      ) : value ? (
        <Text style={styles.settingValue}>{value}</Text>
      ) : (
        <MaterialIcons name="chevron-right" size={20} color={Colors.textSubtle} />
      )}
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

export default function SettingsScreen() {
  const { showAlert } = useAlert();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [autoDelete, setAutoDelete] = useState(false);
  const [proxy, setProxy] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Настройки</Text>
        </View>

        {/* Profile card */}
        <Pressable
          style={({ pressed }) => [styles.profileCard, pressed && { opacity: 0.9 }]}
          onPress={() => showAlert('Профиль', 'Редактирование профиля будет добавлено в следующей версии')}
        >
          <Avatar initials="ME" color={Colors.primary} size={58} isOnline />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Мой аккаунт</Text>
            <Text style={styles.profileId}>@bitecho_user · ID: 4829301</Text>
            <View style={styles.profileBadge}>
              <MaterialIcons name="lock" size={10} color={Colors.primary} />
              <Text style={styles.profileBadgeText}>Без телефона · Анонимно</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={Colors.textSubtle} />
        </Pressable>

        {/* P2P Status */}
        <View style={styles.p2pCard}>
          <View style={styles.p2pRow}>
            <View style={styles.p2pDot} />
            <Text style={styles.p2pLabel}>P2P сеть активна</Text>
          </View>
          <View style={styles.p2pStats}>
            <View style={styles.p2pStat}>
              <Text style={styles.p2pStatVal}>12</Text>
              <Text style={styles.p2pStatLabel}>Узлов</Text>
            </View>
            <View style={styles.p2pStat}>
              <Text style={styles.p2pStatVal}>14ms</Text>
              <Text style={styles.p2pStatLabel}>Задержка</Text>
            </View>
            <View style={styles.p2pStat}>
              <Text style={styles.p2pStatVal}>EU</Text>
              <Text style={styles.p2pStatLabel}>Регион</Text>
            </View>
          </View>
        </View>

        <SectionHeader title="БЕЗОПАСНОСТЬ" />
        <View style={styles.section}>
          <SettingRow
            icon="fingerprint"
            label="Блокировка по отпечатку"
            subtitle="Используйте биометрию для разблокировки"
            toggle
            toggleValue={biometric}
            onToggle={setBiometric}
            color={Colors.success}
          />
          <SettingRow
            icon="lock"
            label="PIN-код"
            subtitle="Установить или изменить PIN"
            onPress={() => showAlert('PIN-код', 'Установите 6-значный PIN для защиты приложения')}
          />
          <SettingRow
            icon="verified-user"
            label="Двухфакторная аутентификация"
            toggle
            toggleValue={twoFA}
            onToggle={setTwoFA}
            color={Colors.primary}
          />
          <SettingRow
            icon="timer"
            label="Автоудаление сообщений"
            subtitle="Удалять сообщения через заданное время"
            toggle
            toggleValue={autoDelete}
            onToggle={setAutoDelete}
            color={Colors.warning}
          />
        </View>

        <SectionHeader title="КОНФИДЕНЦИАЛЬНОСТЬ" />
        <View style={styles.section}>
          <SettingRow
            icon="device-hub"
            label="Прокси / Tor"
            subtitle="Дополнительная анонимность"
            toggle
            toggleValue={proxy}
            onToggle={setProxy}
            color={Colors.secondary}
          />
          <SettingRow
            icon="visibility-off"
            label="Статус онлайн"
            value="Никто не видит"
            onPress={() => showAlert('Статус', 'Управляйте кто видит ваш статус')}
          />
          <SettingRow
            icon="phone-disabled"
            label="Без номера телефона"
            subtitle="Аккаунт не привязан к телефону"
            color={Colors.success}
          />
        </View>

        <SectionHeader title="УВЕДОМЛЕНИЯ" />
        <View style={styles.section}>
          <SettingRow
            icon="notifications"
            label="Push-уведомления"
            toggle
            toggleValue={notifications}
            onToggle={setNotifications}
            color={Colors.primary}
          />
          <SettingRow
            icon="vibration"
            label="Вибрация"
            value="Всегда"
            onPress={() => showAlert('Вибрация', 'Выберите режим вибрации')}
          />
        </View>

        <SectionHeader title="ВНЕШНИЙ ВИД" />
        <View style={styles.section}>
          <SettingRow
            icon="dark-mode"
            label="Тёмная тема"
            toggle
            toggleValue={darkMode}
            onToggle={setDarkMode}
            color={Colors.textSubtle}
          />
          <SettingRow
            icon="palette"
            label="Темы и обои"
            onPress={() => showAlert('Темы', 'Коллекция тем будет добавлена скоро')}
          />
          <SettingRow
            icon="emoji-emotions"
            label="Стикеры и эмодзи"
            onPress={() => showAlert('Стикеры', 'Магазин стикеров')}
          />
        </View>

        <SectionHeader title="РАЗРАБОТЧИКИ" />
        <View style={styles.section}>
          <SettingRow
            icon="code"
            label="API и боты"
            subtitle="BitEcho Bot API документация"
            onPress={() => showAlert('API', 'Документация BitEcho Bot API')}
            color={Colors.secondary}
          />
          <SettingRow
            icon="bug-report"
            label="Версия приложения"
            value="v1.0.0 Beta"
          />
        </View>

        <SectionHeader title="АККАУНТ" />
        <View style={styles.section}>
          <SettingRow
            icon="delete-forever"
            label="Удалить аккаунт"
            danger
            onPress={() =>
              showAlert(
                'Удалить аккаунт?',
                'Все данные будут удалены безвозвратно. Это действие нельзя отменить.',
                [
                  { text: 'Отмена', style: 'cancel' },
                  { text: 'Удалить', style: 'destructive' },
                ]
              )
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: 16,
    gap: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  profileId: {
    fontSize: FontSize.sm,
    color: Colors.textSubtle,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  profileBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  p2pCard: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.successDim,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.success + '33',
    gap: 10,
  },
  p2pRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  p2pDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  p2pLabel: {
    fontSize: FontSize.sm,
    color: Colors.success,
    fontWeight: FontWeight.semibold,
  },
  p2pStats: {
    flexDirection: 'row',
    gap: 24,
  },
  p2pStat: {
    gap: 2,
  },
  p2pStatVal: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  p2pStatLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
  },
  sectionHeader: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textSubtle,
    letterSpacing: 1,
    paddingHorizontal: Spacing.md,
    marginBottom: 4,
    marginTop: 8,
  },
  section: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowPressed: {
    backgroundColor: Colors.cardElevated,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  settingSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
  },
  settingValue: {
    fontSize: FontSize.sm,
    color: Colors.textSubtle,
  },
});
