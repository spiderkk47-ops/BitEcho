import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAlert } from '@/template';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/constants/theme';
import { useWallet } from '@/hooks/useWallet';
import { WalletTransaction } from '@/services/mockData';

type TxAction = 'send' | 'stake' | 'burn' | null;

function TxIcon({ type }: { type: WalletTransaction['type'] }) {
  const map = {
    receive: { icon: 'call-received', color: Colors.success },
    send: { icon: 'call-made', color: Colors.error },
    stake: { icon: 'lock-clock', color: Colors.primary },
    burn: { icon: 'local-fire-department', color: Colors.warning },
    reward: { icon: 'star', color: Colors.secondary },
  } as const;
  const { icon, color } = map[type];
  return (
    <View style={[styles.txIcon, { backgroundColor: color + '22' }]}>
      <MaterialIcons name={icon as any} size={18} color={color} />
    </View>
  );
}

function TxLabel({ type }: { type: WalletTransaction['type'] }) {
  const labels = {
    receive: 'Получено',
    send: 'Отправлено',
    stake: 'Стейкинг',
    burn: 'Сжигание',
    reward: 'Награда',
  };
  return <>{labels[type]}</>;
}

export default function WalletScreen() {
  const { wallet, transactions, send, stake, burn } = useWallet();
  const { showAlert } = useAlert();
  const [activeAction, setActiveAction] = useState<TxAction>(null);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [showAddress, setShowAddress] = useState(false);

  const totalVelValue = (wallet.velBalance * wallet.velUsd).toFixed(2);
  const stakedValue = (wallet.stakedAmount * wallet.velUsd).toFixed(2);

  const handleAction = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      showAlert('Ошибка', 'Введите корректную сумму');
      return;
    }
    if (activeAction === 'send') {
      if (!address.trim()) {
        showAlert('Ошибка', 'Введите адрес получателя');
        return;
      }
      const ok = send(num, address, 'Перевод');
      if (ok) {
        showAlert('Успешно', `${num} VEL отправлено на ${address}`);
      } else {
        showAlert('Ошибка', 'Недостаточно VEL на балансе');
      }
    } else if (activeAction === 'stake') {
      const ok = stake(num);
      if (ok) {
        showAlert('Стейкинг', `${num} VEL переведено в стейкинг. APY: ${wallet.stakingApy}%`);
      } else {
        showAlert('Ошибка', 'Недостаточно VEL');
      }
    } else if (activeAction === 'burn') {
      const ok = burn(num);
      if (ok) {
        showAlert('Сжигание', `${num} VEL сожжено безвозвратно`);
      } else {
        showAlert('Ошибка', 'Недостаточно VEL');
      }
    }
    setAmount('');
    setAddress('');
    setActiveAction(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>VEL Кошелёк</Text>
          <Pressable
            style={styles.addressBtn}
            onPress={() => setShowAddress(!showAddress)}
          >
            <MaterialIcons name="account-balance-wallet" size={14} color={Colors.primary} />
            <Text style={styles.addressText}>{showAddress ? wallet.address : '0xF4a9...3E7C'}</Text>
          </Pressable>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <Text style={styles.velLabel}>VEL</Text>
            <View style={styles.velPriceBadge}>
              <Text style={styles.velPrice}>${wallet.velUsd}</Text>
            </View>
          </View>
          <Text style={styles.balanceAmount}>{wallet.velBalance.toLocaleString('ru')}</Text>
          <Text style={styles.balanceUsd}>${totalVelValue} USD</Text>
          <View style={styles.divider} />
          <View style={styles.balanceStats}>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>Застейкано</Text>
              <Text style={styles.balanceStatValue}>{wallet.stakedAmount} VEL</Text>
              <Text style={styles.balanceStatSub}>${stakedValue}</Text>
            </View>
            <View style={styles.balanceStatDivider} />
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>APY</Text>
              <Text style={[styles.balanceStatValue, { color: Colors.success }]}>
                {wallet.stakingApy}%
              </Text>
              <Text style={styles.balanceStatSub}>Годовая доходность</Text>
            </View>
            <View style={styles.balanceStatDivider} />
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatLabel}>Награды</Text>
              <Text style={[styles.balanceStatValue, { color: Colors.warning }]}>
                +{wallet.stakingRewards} VEL
              </Text>
              <Text style={styles.balanceStatSub}>Начислено</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {[
            { id: 'send' as TxAction, icon: 'send', label: 'Отправить', color: Colors.primary },
            { id: 'stake' as TxAction, icon: 'lock-clock', label: 'Стейкинг', color: Colors.success },
            { id: 'burn' as TxAction, icon: 'local-fire-department', label: 'Сжечь', color: Colors.warning },
          ].map(btn => (
            <Pressable
              key={btn.id}
              style={({ pressed }) => [
                styles.actionBtn,
                { borderColor: btn.color + '44' },
                activeAction === btn.id && { backgroundColor: btn.color + '22', borderColor: btn.color },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => setActiveAction(activeAction === btn.id ? null : btn.id)}
            >
              <MaterialIcons name={btn.icon as any} size={22} color={btn.color} />
              <Text style={[styles.actionLabel, { color: btn.color }]}>{btn.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Action Input Panel */}
        {activeAction && (
          <View style={styles.inputPanel}>
            <Text style={styles.inputTitle}>
              {activeAction === 'send' ? 'Отправить VEL' : activeAction === 'stake' ? 'Стейкинг VEL' : 'Сжечь VEL'}
            </Text>
            {activeAction === 'send' && (
              <TextInput
                style={styles.txInput}
                placeholder="Адрес получателя (0x...)"
                placeholderTextColor={Colors.textSubtle}
                value={address}
                onChangeText={setAddress}
              />
            )}
            <View style={styles.amountRow}>
              <TextInput
                style={[styles.txInput, { flex: 1 }]}
                placeholder="Сумма VEL"
                placeholderTextColor={Colors.textSubtle}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <Pressable
                onPress={() => setAmount(wallet.velBalance.toString())}
                style={styles.maxBtn}
              >
                <Text style={styles.maxLabel}>MAX</Text>
              </Pressable>
            </View>
            <Pressable style={styles.confirmBtn} onPress={handleAction}>
              <Text style={styles.confirmLabel}>
                {activeAction === 'send' ? 'Отправить' : activeAction === 'stake' ? 'Застейкать' : 'Сжечь токены'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Transactions */}
        <View style={styles.txSection}>
          <Text style={styles.sectionTitle}>Транзакции</Text>
          {transactions.map(tx => (
            <View key={tx.id} style={styles.txItem}>
              <TxIcon type={tx.type} />
              <View style={styles.txInfo}>
                <Text style={styles.txNote}>{tx.note || tx.address}</Text>
                <Text style={styles.txAddress}>{tx.address}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={[
                  styles.txAmount,
                  { color: tx.type === 'receive' || tx.type === 'reward' ? Colors.success : tx.type === 'burn' ? Colors.warning : Colors.error }
                ]}>
                  {tx.type === 'receive' || tx.type === 'reward' ? '+' : '-'}{tx.amount} VEL
                </Text>
                <View style={[styles.txStatus, { backgroundColor: Colors.successDim }]}>
                  <Text style={styles.txStatusText}>✓</Text>
                </View>
              </View>
            </View>
          ))}
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
    gap: 4,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  addressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontFamily: 'monospace',
  },
  balanceCard: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '33',
    ...Shadow.md,
    shadowColor: Colors.primary,
  },
  balanceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  velLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textSubtle,
    letterSpacing: 2,
  },
  velPriceBadge: {
    backgroundColor: Colors.primaryDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  velPrice: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  balanceAmount: {
    fontSize: FontSize.xxxl + 6,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  balanceUsd: {
    fontSize: FontSize.lg,
    color: Colors.textSubtle,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },
  balanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceStat: {
    flex: 1,
    gap: 2,
  },
  balanceStatLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
    marginBottom: 2,
  },
  balanceStatValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  balanceStatSub: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
  },
  balanceStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginTop: 16,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: Radius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
  },
  actionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  inputPanel: {
    marginHorizontal: Spacing.md,
    marginTop: 12,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  txInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  amountRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  maxBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.primaryDim,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  maxLabel: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  confirmLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
  },
  txSection: {
    paddingHorizontal: Spacing.md,
    marginTop: 24,
    gap: 2,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: {
    flex: 1,
    gap: 3,
  },
  txNote: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  txAddress: {
    fontSize: FontSize.xs,
    color: Colors.textSubtle,
    fontFamily: 'monospace',
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txAmount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  txStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  txStatusText: {
    fontSize: FontSize.xs,
    color: Colors.success,
    fontWeight: FontWeight.bold,
  },
});
