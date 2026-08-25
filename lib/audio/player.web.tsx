import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";

import { useAppState } from "@/lib/state/app-state";
import { hasPlaybackStarted } from "@/lib/audio/playback-guard";

export type QuranAudioTrack = {
  uri: string;
  reciterName: string;
  chapter: number;
  chapterName: string;
  durationMs?: number;
};

export type AudioPlaybackState = {
  track: QuranAudioTrack | null;
  playing: boolean;
  positionMs: number;
  durationMs: number;
  speed: number;
  error: string | null;
};

type QuranAudioApi = {
  playback: AudioPlaybackState;
  playTrack: (track: QuranAudioTrack, startMs?: number) => Promise<void>;
  togglePlayback: () => void;
  seekBy: (deltaMs: number) => Promise<void>;
  seekTo: (positionMs: number) => Promise<void>;
  setSpeed: (speed: number) => void;
  stop: () => void;
};

const defaultPlayback: AudioPlaybackState = {
  track: null,
  playing: false,
  positionMs: 0,
  durationMs: 0,
  speed: 1,
  error: null,
};

const QuranAudioContext = createContext<QuranAudioApi | null>(null);

const PLAYBACK_START_TIMEOUT_MS = 1800;
const PLAYBACK_POLL_INTERVAL_MS = 150;

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForPlaybackStart(player: AudioPlayer) {
  const deadline = Date.now() + PLAYBACK_START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (hasPlaybackStarted(player.currentStatus)) return;
    await wait(PLAYBACK_POLL_INTERVAL_MS);
  }
  throw new Error("playback_start_timeout");
}

export function QuranAudioProvider({ children }: PropsWithChildren) {
  const { state, updateAudioSettings } = useAppState();
  const playerRef = useRef<AudioPlayer | null>(null);
  const [playback, setPlayback] = useState<AudioPlaybackState>(() => ({ ...defaultPlayback, speed: state.audio.playbackSpeed }));

  useEffect(() => {
    setPlayback((current) => current.track ? current : { ...current, speed: state.audio.playbackSpeed });
  }, [state.audio.playbackSpeed]);

  const syncState = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    setPlayback((current) => ({
      ...current,
      playing: player.playing,
      positionMs: Math.round(player.currentTime * 1000),
      durationMs: Math.round((player.duration || 0) * 1000),
    }));
  }, []);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: "doNotMix" }).catch(() => undefined);
    const timer = setInterval(syncState, 400);
    return () => {
      clearInterval(timer);
      playerRef.current?.remove();
      playerRef.current = null;
    };
  }, [syncState]);

  const playTrack = useCallback(async (track: QuranAudioTrack, startMs = 0) => {
    try {
      await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: "doNotMix" });
      playerRef.current?.remove();
      const player = createAudioPlayer(track.uri, { updateInterval: 250 });
      player.muted = false;
      player.volume = 1;
      player.playbackRate = playback.speed;
      player.shouldCorrectPitch = true;
      playerRef.current = player;
      if (startMs > 0) await player.seekTo(startMs / 1000);
      player.play();
      await waitForPlaybackStart(player);
      if (Platform.OS !== "web") {
        player.setActiveForLockScreen(true, {
          title: `سورة ${track.chapterName}`,
          artist: track.reciterName,
          albumTitle: "دليل المسلم",
        });
      }
      setPlayback((current) => ({
        ...current,
        track,
        playing: true,
        positionMs: startMs,
        durationMs: track.durationMs ?? 0,
        error: null,
      }));
    } catch (error) {
      playerRef.current?.remove();
      playerRef.current = null;
      setPlayback((current) => ({ ...current, playing: false, error: "تعذر بدء التلاوة. تحقق من الملف أو أعد تنزيله." }));
      throw error;
    }
  }, [playback.speed]);

  const togglePlayback = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (player.playing) player.pause();
    else player.play();
    syncState();
  }, [syncState]);

  const seekTo = useCallback(async (positionMs: number) => {
    const player = playerRef.current;
    if (!player) return;
    const maxMs = Math.max(0, Math.round((player.duration || 0) * 1000));
    const next = Math.min(Math.max(positionMs, 0), maxMs || positionMs);
    await player.seekTo(next / 1000);
    syncState();
  }, [syncState]);

  const seekBy = useCallback(async (deltaMs: number) => {
    await seekTo(playback.positionMs + deltaMs);
  }, [playback.positionMs, seekTo]);

  const setSpeed = useCallback((speed: number) => {
    const normalized = Math.min(Math.max(speed, 0.5), 2);
    if (playerRef.current) playerRef.current.playbackRate = normalized;
    setPlayback((current) => ({ ...current, speed: normalized }));
    updateAudioSettings({ playbackSpeed: normalized });
  }, [updateAudioSettings]);

  const stop = useCallback(() => {
    playerRef.current?.pause();
    playerRef.current?.seekTo(0).catch(() => undefined);
    setPlayback((current) => ({ ...current, playing: false, positionMs: 0 }));
  }, []);

  const api = useMemo<QuranAudioApi>(() => ({ playback, playTrack, togglePlayback, seekBy, seekTo, setSpeed, stop }), [playback, playTrack, seekBy, seekTo, setSpeed, stop, togglePlayback]);

  return <QuranAudioContext.Provider value={api}>{children}</QuranAudioContext.Provider>;
}

export function useQuranAudio(): QuranAudioApi {
  const context = useContext(QuranAudioContext);
  if (!context) throw new Error("useQuranAudio must be used within QuranAudioProvider");
  return context;
}
