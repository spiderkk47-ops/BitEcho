import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize } from '@/constants/theme';

interface P2PIndicatorProps {
  active?: boolean;
  compact?: boolean;
}

export function P2PIndicator({ active = true, compact = false }: P2PIndicatorProps) {
  return (
    <View style={[styles.container, active ? styles.active : styles.inactive]}>
      <View style={[styles.dot, active ? styles.dotActive : styles.dotInactive]} />
      {!compact && (
        <Text style={[styles.text, { color: active ? Colors.primary : Colors.textSubtle }]}>
          P2P
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  active: {
    backgroundColor: Colors.primaryDim,
  },
  inactive: {
    backgroundColor: 'transparent',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    backgroundColor: Colors.textSubtle,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
