import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton, AppLogo, ScreenWrapper } from '../../components/common';
import { onboardingSlides } from '../../constants';
import { theme } from '../../theme';
import type { RootStackScreenProps } from '../../types';

export function OnboardingScreen({
  navigation,
}: RootStackScreenProps<'Onboarding'>) {
  const { height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slide = onboardingSlides[currentIndex];
  const isLastSlide = currentIndex === onboardingSlides.length - 1;
  const currentVisual = slideVisuals[currentIndex];
  const isCompact = height < 820;
  const isShort = height < 740;

  const previewLabels = useMemo(
    () => ['Track', 'Understand', 'Control'],
    []
  );
  const layout = useMemo(
    () => ({
      screenPaddingBottom: isShort ? theme.spacing.lg : theme.spacing.xl,
      topMarginBottom: isShort ? theme.spacing.lg : theme.spacing['2xl'],
      bodyGap: isShort ? theme.spacing.lg : theme.spacing.xl,
      panelPadding: isShort ? theme.spacing.lg : theme.spacing.xl,
      panelGap: isShort ? theme.spacing.lg : theme.spacing.xl,
      illustrationPadding: isShort ? theme.spacing.md : theme.spacing.lg,
      chartHeight: isShort ? 68 : isCompact ? 76 : 92,
      detailPadding: isShort ? theme.spacing.md : theme.spacing.lg,
      detailGap: isShort ? theme.spacing.md : theme.spacing.lg,
      copyGap: isShort ? theme.spacing.sm : theme.spacing.md,
      footerGap: isShort ? theme.spacing.md : theme.spacing.lg,
      chipVerticalPadding: isShort ? theme.spacing.xs : theme.spacing.sm,
      chipHorizontalPadding: isShort ? theme.spacing.sm : theme.spacing.md,
      headerBadgePadding: isShort ? theme.spacing.xs : theme.spacing.sm,
      metricRowGap: isShort ? theme.spacing.sm : theme.spacing.md,
      showFooterHint: !isShort,
    }),
    [isCompact, isShort]
  );

  const handleNext = () => {
    if (isLastSlide) {
      navigation.replace('Login');
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  return (
    <ScreenWrapper
      contentContainerStyle={[
        styles.screen,
        { paddingBottom: layout.screenPaddingBottom },
      ]}
    >
      <View
        style={[
          styles.topRow,
          { marginBottom: layout.topMarginBottom },
        ]}
      >
        <AppLogo compact />
        <Pressable
          hitSlop={8}
          onPress={() => navigation.replace('Login')}
          style={({ pressed }) => [
            styles.skipButton,
            pressed ? styles.skipButtonPressed : null,
          ]}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { gap: layout.bodyGap, paddingBottom: theme.spacing.md },
        ]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.scrollArea}
      >
        <View
          style={[
            styles.illustrationPanel,
            {
              gap: layout.panelGap,
              padding: layout.panelPadding,
            },
          ]}
        >
          <View style={styles.previewHeader}>
            <View style={styles.previewHeaderCopy}>
              <Text style={styles.previewEyebrow}>{slide.eyebrow}</Text>
              <Text
                style={[
                  styles.previewTitle,
                  isShort ? styles.previewTitleCompact : null,
                ]}
              >
                {currentVisual.panelTitle}
              </Text>
            </View>
            <View
              style={[
                styles.previewHeaderBadge,
                {
                  paddingVertical: layout.headerBadgePadding,
                },
              ]}
            >
              <Text style={styles.previewHeaderBadgeText}>
                {currentVisual.badge}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.illustrationCard,
              { padding: layout.illustrationPadding },
            ]}
          >
            <View style={styles.illustrationTopRow}>
              <View
                style={[
                  styles.illustrationIconWrap,
                  isShort ? styles.illustrationIconWrapCompact : null,
                ]}
              >
                <Ionicons
                  name={slide.icon}
                  size={isShort ? 24 : 28}
                  color={theme.colors.primaryDark}
                />
              </View>
              <View style={styles.illustrationSummary}>
                <Text style={styles.illustrationSummaryLabel}>
                  {currentVisual.figureLabel}
                </Text>
                <Text style={styles.illustrationSummaryValue}>
                  {currentVisual.figureValue}
                </Text>
              </View>
            </View>

            <View style={styles.chartShell}>
              <View style={[styles.chartRow, { height: layout.chartHeight }]}>
                {currentVisual.bars.map((height, index) => (
                  <View
                    key={index}
                    style={[
                      styles.chartBar,
                      {
                        height: Math.max(
                          height * (isShort ? 0.74 : isCompact ? 0.84 : 1),
                          isShort ? 22 : 26
                        ),
                        opacity: index === currentIndex + 1 ? 1 : 0.75,
                      },
                    ]}
                  />
                ))}
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${currentVisual.progress}%` },
                  ]}
                />
              </View>
            </View>
          </View>

          <View
            style={[
              styles.detailBand,
              {
                gap: layout.detailGap,
                padding: layout.detailPadding,
              },
            ]}
          >
            <View style={[styles.metricRow, { gap: layout.metricRowGap }]}>
              {previewLabels.map((label, index) => (
                <View key={label} style={styles.metricItem}>
                  <Text style={styles.metricTileLabel}>{label}</Text>
                  <Text
                    style={[
                      styles.metricTileValue,
                      isShort ? styles.metricTileValueCompact : null,
                    ]}
                  >
                    {index === currentIndex ? 'Active' : 'Ready'}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.chipRow}>
              {slide.highlights.map((item) => (
                <View
                  key={item}
                  style={[
                    styles.highlightChip,
                    {
                      paddingHorizontal: layout.chipHorizontalPadding,
                      paddingVertical: layout.chipVerticalPadding,
                    },
                  ]}
                >
                  <Text style={styles.highlightText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.copyBlock, { gap: layout.copyGap }]}>
          <Text style={styles.stepLabel}>
            Step {currentIndex + 1} of {onboardingSlides.length}
          </Text>
          <Text style={[styles.title, isShort ? styles.titleCompact : null]}>
            {slide.title}
          </Text>
          <Text
            style={[styles.subtitle, isShort ? styles.subtitleCompact : null]}
          >
            {slide.subtitle}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footerBlock, { gap: layout.footerGap }]}>
        <View style={styles.paginationRow}>
          {onboardingSlides.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.paginationDot,
                index === currentIndex ? styles.paginationDotActive : null,
              ]}
            />
          ))}
        </View>

        {layout.showFooterHint ? (
          <Text style={styles.footerHint}>
            {isLastSlide
              ? 'Your setup starts here.'
              : 'A quick first look before login.'}
          </Text>
        ) : null}

        <View style={styles.actionBlock}>
          <AppButton
            onPress={handleNext}
            title={isLastSlide ? 'Get Started' : 'Next'}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const slideVisuals = [
  {
    panelTitle: 'Daily overview',
    badge: 'Fast setup',
    figureLabel: 'Entries this week',
    figureValue: '12',
    bars: [32, 54, 46, 68, 58],
    progress: 62,
  },
  {
    panelTitle: 'Spending signals',
    badge: 'Clear patterns',
    figureLabel: 'Insight score',
    figureValue: '84%',
    bars: [40, 64, 78, 52, 88],
    progress: 74,
  },
  {
    panelTitle: 'Budget focus',
    badge: 'Stay ready',
    figureLabel: 'Month on track',
    figureValue: '88%',
    bars: [26, 48, 66, 82, 92],
    progress: 88,
  },
] as const;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadows.subtle,
  },
  skipButtonPressed: {
    opacity: 0.9,
  },
  skipText: {
    ...theme.typography.label,
    color: theme.colors.primaryDark,
  },
  illustrationPanel: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    ...theme.shadows.card,
  },
  previewHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewHeaderCopy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  previewEyebrow: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  previewTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  previewTitleCompact: {
    ...theme.typography.label,
  },
  previewHeaderBadge: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
  },
  previewHeaderBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  illustrationCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radii.md,
    gap: theme.spacing.md,
  },
  illustrationTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  illustrationIconWrap: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  illustrationIconWrapCompact: {
    height: 48,
    width: 48,
  },
  illustrationSummary: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  illustrationSummaryLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  illustrationSummaryValue: {
    ...theme.typography.title,
    color: theme.colors.text,
  },
  chartShell: {
    gap: theme.spacing.md,
  },
  chartRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  chartBar: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.sm,
    flex: 1,
  },
  progressTrack: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: theme.colors.primaryDark,
    borderRadius: theme.radii.pill,
    height: '100%',
  },
  detailBand: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.md,
  },
  metricRow: {
    flexDirection: 'row',
  },
  metricItem: {
    flex: 1,
  },
  metricTileLabel: {
    ...theme.typography.tiny,
    color: theme.colors.primaryDark,
  },
  metricTileValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text,
  },
  metricTileValueCompact: {
    ...theme.typography.label,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  highlightChip: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.pill,
  },
  highlightText: {
    ...theme.typography.caption,
    color: theme.colors.primaryDark,
  },
  copyBlock: {
  },
  stepLabel: {
    ...theme.typography.label,
    color: theme.colors.primaryDark,
  },
  title: {
    ...theme.typography.heading,
    color: theme.colors.text,
  },
  titleCompact: {
    fontSize: 24,
    lineHeight: 30,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  subtitleCompact: {
    lineHeight: 22,
  },
  footerBlock: {
    paddingTop: theme.spacing.sm,
  },
  paginationRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  paginationDot: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    height: 10,
    width: 10,
  },
  paginationDotActive: {
    backgroundColor: theme.colors.primary,
    width: 28,
  },
  footerHint: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  actionBlock: {},
});
