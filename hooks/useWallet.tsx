import { useState } from 'react';
import { MOCK_WALLET, MOCK_TRANSACTIONS, WalletTransaction } from '@/services/mockData';

export function useWallet() {
  const [wallet, setWallet] = useState(MOCK_WALLET);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(MOCK_TRANSACTIONS);
  const [isLocked, setIsLocked] = useState(false);

  const send = (amount: number, address: string, note?: string) => {
    if (amount > wallet.velBalance) return false;
    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      type: 'send',
      amount,
      address,
      timestamp: new Date(),
      status: 'confirmed',
      note,
    };
    setTransactions(prev => [tx, ...prev]);
    setWallet(prev => ({ ...prev, velBalance: prev.velBalance - amount }));
    return true;
  };

  const stake = (amount: number) => {
    if (amount > wallet.velBalance) return false;
    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      type: 'stake',
      amount,
      address: 'Staking Pool',
      timestamp: new Date(),
      status: 'confirmed',
      note: 'Стейкинг',
    };
    setTransactions(prev => [tx, ...prev]);
    setWallet(prev => ({
      ...prev,
      velBalance: prev.velBalance - amount,
      stakedAmount: prev.stakedAmount + amount,
    }));
    return true;
  };

  const burn = (amount: number) => {
    if (amount > wallet.velBalance) return false;
    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      type: 'burn',
      amount,
      address: '0x0000...0000',
      timestamp: new Date(),
      status: 'confirmed',
      note: 'Сжигание токенов',
    };
    setTransactions(prev => [tx, ...prev]);
    setWallet(prev => ({ ...prev, velBalance: prev.velBalance - amount }));
    return true;
  };

  return {
    wallet,
    transactions,
    isLocked,
    setIsLocked,
    send,
    stake,
    burn,
  };
}
