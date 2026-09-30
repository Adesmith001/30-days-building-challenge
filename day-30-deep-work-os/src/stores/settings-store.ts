import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode =
  | "system"
  | "light"
  | "dark";

export type SoundMode =
  | "none"
  | "brown"
  | "rain"
  | "cafe"
  | "air";

interface SettingsState {
  theme: ThemeMode;
  defaultDuration: number;
  reentryThreshold: number;
  keepScreenAwake: boolean;
  autoFullscreen: boolean;
  notifications: boolean;
  reducedMotion: boolean;
  sound: SoundMode;
  soundVolume: number;

  setTheme: (theme: ThemeMode) => void;
  setDefaultDuration: (value: number) => void;
  setReentryThreshold: (value: number) => void;
  setKeepScreenAwake: (value: boolean) => void;
  setAutoFullscreen: (value: boolean) => void;
  setNotifications: (value: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  setSound: (value: SoundMode) => void;
  setSoundVolume: (value: number) => void;
}

export const useSettingsStore =
  create<SettingsState>()(
    persist(
      (set) => ({
        theme: "system",
        defaultDuration: 50,
        reentryThreshold: 30,
        keepScreenAwake: true,
        autoFullscreen: false,
        notifications: false,
        reducedMotion: false,
        sound: "none",
        soundVolume: 0.3,

        setTheme: (theme) => set({ theme }),

        setDefaultDuration: (defaultDuration) =>
          set({ defaultDuration }),

        setReentryThreshold: (
          reentryThreshold,
        ) => set({ reentryThreshold }),

        setKeepScreenAwake: (
          keepScreenAwake,
        ) => set({ keepScreenAwake }),

        setAutoFullscreen: (
          autoFullscreen,
        ) => set({ autoFullscreen }),

        setNotifications: (notifications) =>
          set({ notifications }),

        setReducedMotion: (reducedMotion) =>
          set({ reducedMotion }),

        setSound: (sound) => set({ sound }),

        setSoundVolume: (soundVolume) =>
          set({ soundVolume }),
      }),
      {
        name: "deep-work-settings",
      },
    ),
  );