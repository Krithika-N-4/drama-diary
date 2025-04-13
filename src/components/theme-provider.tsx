'use client';

import * as React from 'react';
// import {Theme, ThemeProvider as NextThemesProvider} from 'next-themes';

interface ThemeProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  attribute,
  className,
  ...props
}: ThemeProviderProps) {
  return <div attribute={attribute} className={className}>{children}</div>;
}
