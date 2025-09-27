
import { BookText, TestTube2, Scale, Globe, Landmark, Atom, Sigma, Dna, TrendingUp, FlaskConical, HelpCircle } from 'lucide-react';
import React from 'react';

const iconMap: { [key: string]: React.ReactNode } = {
  Sigma: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
  TestTube2: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
  Landmark: <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
  BookText: <BookText className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
  Atom: <Atom className="w-8 h-8 text-sky-600 dark:text-sky-400" />,
  FlaskConical: <FlaskConical className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
  Dna: <Dna className="w-8 h-8 text-lime-600 dark:text-lime-400" />,
  Globe: <Globe className="w-8 h-8 text-orange-600 dark:text-orange-400" />,
  Scale: <Scale className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
  TrendingUp: <TrendingUp className="w-8 h-8 text-pink-600 dark:text-pink-400" />,
  HelpCircle: <HelpCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />,
};

const gradientMap: { [key: string]: string } = {
  green: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30',
  blue: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
  amber: 'from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30',
  purple: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
  sky: 'from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30',
  lime: 'from-lime-50 to-lime-100 dark:from-lime-900/30 dark:to-lime-800/30',
  red: 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30',
  orange: 'from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30',
  indigo: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30',
  pink: 'from-pink-50 to-rose-100 dark:from-pink-900/30 dark:to-rose-800/30',
  default: 'from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30',
};

export const getDynamicIcon = (iconName?: string, className?: string) => {
  const icon = iconName ? iconMap[iconName] : iconMap['HelpCircle'];
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon, { className });
  }
  return React.cloneElement(iconMap['HelpCircle'], { className });
};

export const getDynamicGradient = (theme?: string) => {
    return theme ? gradientMap[theme] : gradientMap['default'];
};

export const iconOptions = Object.keys(iconMap);
export const themeOptions = Object.keys(gradientMap);
