import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { THEMES } from '@/data/pages';
import type { RootStackParamList } from '@/navigation/types';
import { colors, radius, shadow, spacing, typography } from '@/theme';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNav>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroBlock}>
          <Text style={styles.brand}>🎨 Pop Color</Text>
          <Text style={styles.tagline}>Pick a page. Tap to color. Have fun!</Text>
        </View>

        <Text style={styles.sectionTitle}>Themes</Text>

        {THEMES.map((theme) => (
          <Pressable
            key={theme.id}
            onPress={() => navigation.navigate('Gallery', { themeId: theme.id })}
            accessibilityRole="button"
            accessibilityLabel={`${theme.title} theme, ${theme.pageIds.length} pages`}
            style={({ pressed }) => [
              styles.themeCard,
              { backgroundColor: theme.bgColor },
              pressed && styles.themeCardPressed,
            ]}
            testID={`theme-card-${theme.id}`}
          >
            <Text style={styles.themeEmoji}>{theme.emoji}</Text>
            <View style={styles.themeText}>
              <Text style={styles.themeTitle}>{theme.title}</Text>
              <Text style={styles.themeMeta}>{theme.pageIds.length} pages</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}

        <View style={styles.row}>
          <Pressable
            onPress={() => navigation.navigate('MyCreations')}
            accessibilityRole="button"
            accessibilityLabel="My Creations"
            style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
            testID="open-my-creations"
          >
            <Text style={styles.actionEmoji}>💖</Text>
            <Text style={styles.actionLabel}>My Creations</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Settings')}
            accessibilityRole="button"
            accessibilityLabel="Settings"
            style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
            testID="open-settings"
          >
            <Text style={styles.actionEmoji}>⚙️</Text>
            <Text style={styles.actionLabel}>Settings</Text>
          </Pressable>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  heroBlock: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  brand: {
    ...typography.display,
    color: colors.brandDeep,
  },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    minHeight: 88,
    ...shadow.card,
  },
  themeCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  themeEmoji: {
    fontSize: 44,
  },
  themeText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  themeTitle: {
    ...typography.title,
    color: colors.text,
  },
  themeMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 36,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    borderRadius: radius.xl,
    alignItems: 'center',
    ...shadow.card,
  },
  actionCardPressed: {
    transform: [{ scale: 0.97 }],
  },
  actionEmoji: {
    fontSize: 36,
  },
  actionLabel: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.xs,
  },
});
