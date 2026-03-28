import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight } from '@/constants/theme';

interface AvatarProps {
  initials: string;
  color: string;
  size?: number;
  isOnline?: boolean;
  isEncrypted?: boolean;
}

export function Avatar({ initials, color, size = 46, isOnline, isEncrypted }: AvatarProps) {
  const fontSize = size * 0.35;
  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color + '22',
            borderColor: color + '66',
          },
        ]}
      >
        <Text style={[styles.initials, { fontSize, color }]}>{initials}</Text>
      </View>
      {isOnline && (
        <View style={[styles.onlineDot, { borderColor: Colors.surface }]} />
      )}
      {isEncrypted && (
        <View style={styles.encryptedBadge}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  initials: {
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
  },
  encryptedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 8,
  },
});
