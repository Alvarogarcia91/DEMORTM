import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemePreset = 'rtm' | 'navy' | 'graphite' | 'emerald';
export type ThemeMode = 'light' | 'dark' | 'system';
export type SidebarStyle = 'default' | 'light' | 'dark';
export type ThemeDensity = 'comfortable' | 'compact';

export interface ThemeConfig {
  preset: ThemePreset;
  mode: ThemeMode;
  sidebarStyle: SidebarStyle;
  density: ThemeDensity;
}

export interface ThemePresetDetails {
  id: ThemePreset;
  name: string;
  description: string;
  colors: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryText: string;
    accent: string;
    lightBg: string;
    darkBg: string;
    cardBg: string;
    sidebarBg: string;
  };
}

export const THEME_PRESETS: Record<ThemePreset, ThemePresetDetails> = {
  rtm: {
    id: 'rtm',
    name: 'Impresos RTM Oficial',
    description: 'Azul marino industrial, cyan de precisión y acabados gráficos',
    colors: {
      primary: '#1E3A8A',
      primaryHover: '#172554',
      primaryLight: '#E0F2FE',
      primaryText: '#FFFFFF',
      accent: '#0284C7',
      lightBg: '#F8FAFC',
      darkBg: '#0B1120',
      cardBg: '#FFFFFF',
      sidebarBg: '#FFFFFF',
    },
  },
  navy: {
    id: 'navy',
    name: 'Navy Corporativo',
    description: 'Azul marino industrial, azul acero y fondo despejado',
    colors: {
      primary: '#0F172A',
      primaryHover: '#020617',
      primaryLight: '#F1F5F9',
      primaryText: '#FFFFFF',
      accent: '#2563EB',
      lightBg: '#F8FAFC',
      darkBg: '#0A1128',
      cardBg: '#FFFFFF',
      sidebarBg: '#FFFFFF',
    },
  },
  graphite: {
    id: 'graphite',
    name: 'Graphite / Slate',
    description: 'Gris pizarra ejecutivo, zinc de alto contraste estilo Linear',
    colors: {
      primary: '#27272A',
      primaryHover: '#18181B',
      primaryLight: '#F4F4F5',
      primaryText: '#FFFFFF',
      accent: '#52525B',
      lightBg: '#F8FAFC',
      darkBg: '#09090B',
      cardBg: '#FFFFFF',
      sidebarBg: '#F8FAFC',
    },
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Logística',
    description: 'Verde esmeralda sobrio, gris neutro y acentos operativos',
    colors: {
      primary: '#047857',
      primaryHover: '#064E3B',
      primaryLight: '#ECFDF5',
      primaryText: '#FFFFFF',
      accent: '#059669',
      lightBg: '#F7F9F8',
      darkBg: '#0A1510',
      cardBg: '#FFFFFF',
      sidebarBg: '#FFFFFF',
    },
  },
};

const DEFAULT_CONFIG: ThemeConfig = {
  preset: 'rtm',
  mode: 'light',
  sidebarStyle: 'default',
  density: 'comfortable',
};

interface ThemeContextType {
  config: ThemeConfig;
  setPreset: (preset: ThemePreset) => void;
  setMode: (mode: ThemeMode) => void;
  setSidebarStyle: (style: SidebarStyle) => void;
  setDensity: (density: ThemeDensity) => void;
  isDark: boolean;
  currentPreset: ThemePresetDetails;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('rtm_theme_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.preset !== 'rtm' && parsed.preset !== 'ocean' && parsed.preset !== 'emerald' && parsed.preset !== 'sunset' && parsed.preset !== 'corporate') {
          parsed.preset = 'rtm';
        }
        return { ...DEFAULT_CONFIG, ...parsed };
      } catch {
        return DEFAULT_CONFIG;
      }
    }

    return DEFAULT_CONFIG;
  });

  const [isSystemDark, setIsSystemDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const isDark = config.mode === 'dark' || (config.mode === 'system' && isSystemDark);

  useEffect(() => {
    localStorage.setItem('rtm_theme_config', JSON.stringify(config));
    const preset = THEME_PRESETS[config.preset] || THEME_PRESETS.rtm;
    const root = document.documentElement;

    root.style.setProperty('--color-primary', preset.colors.primary);
    root.style.setProperty('--color-primary-hover', preset.colors.primaryHover);
    root.style.setProperty('--color-primary-light', preset.colors.primaryLight);
    root.style.setProperty('--color-primary-text', preset.colors.primaryText);
    root.style.setProperty('--color-accent', preset.colors.accent);

    if (isDark) {
      root.classList.add('dark');
      root.style.setProperty('--color-bg-base', preset.colors.darkBg);
      root.style.setProperty('--color-bg-surface', '#18181B');
      root.style.setProperty('--color-bg-elevated', '#27272A');
      root.style.setProperty('--color-bg-muted', '#27272A');
      root.style.setProperty('--color-text-main', '#F4F4F5');
      root.style.setProperty('--color-text-muted', '#A1A1AA');
      root.style.setProperty('--color-border-subtle', '#27272A');
      root.style.setProperty('--color-border-strong', '#3F3F46');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--color-bg-base', preset.colors.lightBg);
      root.style.setProperty('--color-bg-surface', '#FFFFFF');
      root.style.setProperty('--color-bg-elevated', '#FFFFFF');
      root.style.setProperty('--color-bg-muted', '#F4F4F5');
      root.style.setProperty('--color-text-main', '#18181B');
      root.style.setProperty('--color-text-muted', '#71717A');
      root.style.setProperty('--color-border-subtle', '#E4E4E7');
      root.style.setProperty('--color-border-strong', '#D4D4D8');
    }
  }, [config, isDark]);

  const setPreset = (preset: ThemePreset) => setConfig((c) => ({ ...c, preset }));
  const setMode = (mode: ThemeMode) => setConfig((c) => ({ ...c, mode }));
  const setSidebarStyle = (sidebarStyle: SidebarStyle) => setConfig((c) => ({ ...c, sidebarStyle }));
  const setDensity = (density: ThemeDensity) => setConfig((c) => ({ ...c, density }));

  const currentPreset = THEME_PRESETS[config.preset] || THEME_PRESETS.rtm;

  return (
    <ThemeContext.Provider
      value={{
        config,
        setPreset,
        setMode,
        setSidebarStyle,
        setDensity,
        isDark,
        currentPreset,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
