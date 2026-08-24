import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type QuranBookmark = {
  surah: number;
  ayah: number;
  updatedAt: string;
} | null;

export type AppState = {
  schemaVersion: 1;
  settings: {
    theme: "system" | "light" | "dark";
    tasbeehTarget: number;
  };
  daily: {
    dateKey: string;
    tasbeehCount: number;
    completedAzkarIds: string[];
  };
  quranBookmark: QuranBookmark;
  azkarRepeats: Record<string, number>;
  favoriteDuaIds: string[];
  readStoryIds: string[];
  tasks: Task[];
};

type AppStateApi = {
  state: AppState;
  hydrated: boolean;
  incrementTasbeeh: () => void;
  resetTasbeeh: () => void;
  setAzkarRepeat: (id: string, count: number, target: number) => void;
  saveBookmark: (surah: number, ayah: number) => void;
  toggleFavoriteDua: (id: string | number) => void;
  markStoryRead: (id: string | number) => void;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateSettings: (patch: Partial<AppState["settings"]>) => void;
  resetAllProgress: () => void;
};

const STORAGE_KEY = "dalil-almuslim:offline-state:v1";

function todayKey(date = new Date()): string {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

export function createDefaultAppState(date = new Date()): AppState {
  return {
    schemaVersion: 1,
    settings: { theme: "system", tasbeehTarget: 100 },
    daily: { dateKey: todayKey(date), tasbeehCount: 0, completedAzkarIds: [] },
    quranBookmark: null,
    azkarRepeats: {},
    favoriteDuaIds: [],
    readStoryIds: [],
    tasks: [
      { id: "morning-azkar", title: "قراءة أذكار الصباح", completed: false, createdAt: "seed" },
      { id: "evening-azkar", title: "قراءة أذكار المساء", completed: false, createdAt: "seed" },
      { id: "quran-wird", title: "ورد القرآن الكريم", completed: false, createdAt: "seed" },
    ],
  };
}

export function normalizeAppState(input: unknown, date = new Date()): AppState {
  const fallback = createDefaultAppState(date);
  if (!input || typeof input !== "object") return fallback;
  const value = input as Partial<AppState>;
  const dayChanged = value.daily?.dateKey !== todayKey(date);
  return {
    ...fallback,
    ...value,
    settings: { ...fallback.settings, ...value.settings },
    daily: dayChanged
      ? fallback.daily
      : { ...fallback.daily, ...value.daily, completedAzkarIds: Array.isArray(value.daily?.completedAzkarIds) ? value.daily.completedAzkarIds : [] },
    azkarRepeats: value.azkarRepeats && typeof value.azkarRepeats === "object" ? value.azkarRepeats : {},
    favoriteDuaIds: Array.isArray(value.favoriteDuaIds) ? value.favoriteDuaIds : [],
    readStoryIds: Array.isArray(value.readStoryIds) ? value.readStoryIds : [],
    tasks: Array.isArray(value.tasks) ? value.tasks.filter((task): task is Task => Boolean(task?.id && task?.title)) : fallback.tasks,
    quranBookmark: value.quranBookmark && typeof value.quranBookmark.surah === "number" ? value.quranBookmark : null,
    schemaVersion: 1,
  };
}

const AppStateContext = createContext<AppStateApi | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AppState>(() => createDefaultAppState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setState(normalizeAppState(raw ? JSON.parse(raw) : null)))
      .catch(() => setState(createDefaultAppState()))
      .finally(() => setHydrated(true));
  }, []);

  const update = useCallback((recipe: (current: AppState) => AppState) => {
    setState((current) => {
      const next = normalizeAppState(recipe(current));
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const api = useMemo<AppStateApi>(() => ({
    state,
    hydrated,
    incrementTasbeeh: () => update((current) => ({ ...current, daily: { ...current.daily, tasbeehCount: current.daily.tasbeehCount + 1 } })),
    resetTasbeeh: () => update((current) => ({ ...current, daily: { ...current.daily, tasbeehCount: 0 } })),
    setAzkarRepeat: (id, count, target) => update((current) => ({
      ...current,
      azkarRepeats: { ...current.azkarRepeats, [id]: count },
      daily: {
        ...current.daily,
        completedAzkarIds: count >= target
          ? [...new Set([...current.daily.completedAzkarIds, id])]
          : current.daily.completedAzkarIds.filter((item) => item !== id),
      },
    })),
    saveBookmark: (surah, ayah) => update((current) => ({ ...current, quranBookmark: { surah, ayah, updatedAt: new Date().toISOString() } })),
    toggleFavoriteDua: (id) => update((current) => {
      const key = String(id);
      return { ...current, favoriteDuaIds: current.favoriteDuaIds.includes(key) ? current.favoriteDuaIds.filter((item) => item !== key) : [...current.favoriteDuaIds, key] };
    }),
    markStoryRead: (id) => update((current) => ({ ...current, readStoryIds: [...new Set([...current.readStoryIds, String(id)])] })),
    addTask: (title) => update((current) => ({ ...current, tasks: [...current.tasks, { id: `task-${Date.now()}`, title: title.trim(), completed: false, createdAt: new Date().toISOString() }] })),
    toggleTask: (id) => update((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task) })),
    deleteTask: (id) => update((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== id) })),
    updateSettings: (patch) => update((current) => ({ ...current, settings: { ...current.settings, ...patch } })),
    resetAllProgress: () => update(() => createDefaultAppState()),
  }), [hydrated, state, update]);

  return <AppStateContext.Provider value={api}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateApi {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used inside AppStateProvider");
  return context;
}
