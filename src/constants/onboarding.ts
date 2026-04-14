import type { ComponentProps } from 'react';

import { Ionicons } from '@expo/vector-icons';

export type OnboardingSlide = {
  id: string;
  title: string;
  subtitle: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  eyebrow: string;
  highlights: string[];
};

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'track',
    eyebrow: 'Capture every spend',
    title: 'Track your daily expenses easily',
    subtitle:
      'Keep small purchases, bills, and quick cash movements in one clean routine.',
    icon: 'wallet-outline',
    highlights: ['Fast entry', 'Clear categories', 'Daily rhythm'],
  },
  {
    id: 'insights',
    eyebrow: 'Spot patterns sooner',
    title: 'Understand your spending with insights',
    subtitle:
      'Use simple visual summaries to see where your money goes and what needs attention.',
    icon: 'pie-chart-outline',
    highlights: ['Smart summaries', 'Weekly signals', 'Less guesswork'],
  },
  {
    id: 'budget',
    eyebrow: 'Stay steady each month',
    title: 'Stay in control of your monthly budget',
    subtitle:
      'Build confidence with a calmer view of how much you spend, save, and keep.',
    icon: 'shield-checkmark-outline',
    highlights: ['Budget focus', 'Better habits', 'More control'],
  },
];
