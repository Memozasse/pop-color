import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ScreenHeader';
import type { RootStackParamList } from '@/navigation/types';
import { useAudienceStore } from '@/state/audienceStore';
import { useSettingsStore } from '@/state/settingsStore';
import { colors, radius, shadow, spacing, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingRowProps {
  emoji: string;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  testID?: string;
}

const SettingRow: React.FC<SettingRowProps> = ({
  emoji,
  title,
  description,
  value,
  onValueChange,
  testID,
}) => (
  <View style={styles.row} accessibilityRole="switch" accessibilityState={{ checked: value }}>
    <Text style={styles.emoji}>{emoji}</Text>
    <View style={styles.text}>
      <Text style={styles.rowTitle}>{title}</Text>
      {description ? <Text style={styles.rowDescription}>{description}</Text> : null}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.border, true: colors.brandSoft }}
      thumbColor={value ? colors.brand : colors.surface}
      testID={testID}
    />
  </View>
);

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const setHapticsEnabled = useSettingsStore((s) => s.setHapticsEnabled);
  const audience = useAudienceStore((s) => s.audience);
  const clearAudience = useAudienceStore((s) => s.clearAudience);

  const handleChangeAudience = () => {
    clearAudience();
    navigation.reset({ index: 0, routes: [{ name: 'Audience' }] });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>Library</Text>
        <View style={styles.card}>
          <Pressable
            onPress={handleChangeAudience}
            accessibilityRole="button"
            accessibilityLabel="Change audience"
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            testID="setting-change-audience"
          >
            <Text style={styles.emoji}>{audience === 'adults' ? '\uD83C\uDF38' : '\uD83E\uDDF8'}</Text>
            <View style={styles.text}>
              <Text style={styles.rowTitle}>Audience</Text>
              <Text style={styles.rowDescription}>
                {audience === 'adults'
                  ? 'Adults — Women & Flowers'
                  : audience === 'kids'
                    ? 'Kids — Animals, Fruits, Vehicles & Shapes'
                    : 'Not set yet'}
              </Text>
            </View>
            <Text style={styles.chevron}>{'\u203A'}</Text>
          </Pressable>
        </View>

        <Text style={styles.section}>Feedback</Text>
        <View style={styles.card}>
          <SettingRow
            emoji="🔊"
            title="Pop sound"
            description="Play a soft pop when you fill a region."
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            testID="setting-sound"
          />
          <View style={styles.divider} />
          <SettingRow
            emoji="📳"
            title="Haptic buzz"
            description="Tiny vibration on tap (mobile only)."
            value={hapticsEnabled}
            onValueChange={setHapticsEnabled}
            testID="setting-haptics"
          />
        </View>

        <Text style={styles.section}>About</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.emoji}>🎨</Text>
            <View style={styles.text}>
              <Text style={styles.rowTitle}>Pop Color</Text>
              <Text style={styles.rowDescription}>
                A relaxing coloring app for everyone.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  section: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: spacing.xs,
    ...shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 64,
  },
  emoji: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  text: {
    flex: 1,
  },
  rowTitle: {
    ...typography.heading,
    color: colors.text,
  },
  rowDescription: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  rowPressed: {
    opacity: 0.85,
  },
  chevron: {
    ...typography.heading,
    color: colors.textMuted,
    fontSize: 24,
    marginLeft: spacing.sm,
  },
});
