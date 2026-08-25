import { createVideoPlayer, type VideoPlayer } from "expo-video";
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { useAppState } from "@/lib/state/app-state";

export type QuranAudioTrack = { uri: string; reciterName: string; chapter: number; chapterName: string; durationMs?: number };
export type AudioPlaybackState = { track: QuranAudioTrack | null; playing: boolean; positionMs: number; durationMs: number; speed: number; error: string | null };
type QuranAudioApi = {
  playback: AudioPlaybackState;
  playTrack: (track: QuranAudioTrack, startMs?: number) => Promise<void>;
  togglePlayback: () => void;
  seekBy: (deltaMs: number) => Promise<void>;
  seekTo: (positionMs: number) => Promise<void>;
  setSpeed: (speed: number) => void;
  stop: () => void;
};
type Subscription = { remove: () => void };

const defaultPlayback: AudioPlaybackState = { track: null, playing: false, positionMs: 0, durationMs: 0, speed: 1, error: null };
const QuranAudioContext = createContext<QuranAudioApi | null>(null);
const PLAYBACK_START_TIMEOUT_MS = 3000;

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

export function QuranAudioProvider({ children }: PropsWithChildren) {
  const { state, updateAudioSettings } = useAppState();
  const playerRef = useRef<VideoPlayer | null>(null);
  const subscriptionsRef = useRef<Subscription[]>([]);
  const [playback, setPlayback] = useState<AudioPlaybackState>(() => ({ ...defaultPlayback, speed: state.audio.playbackSpeed }));

  const releasePlayer = useCallback(() => {
    subscriptionsRef.current.forEach((subscription) => subscription.remove());
    subscriptionsRef.current = [];
    const player = playerRef.current;
    if (!player) return;
    player.pause();
    player.release();
    playerRef.current = null;
  }, []);

  useEffect(() => {
    setPlayback((current) => current.track ? current : { ...current, speed: state.audio.playbackSpeed });
  }, [state.audio.playbackSpeed]);

  useEffect(() => releasePlayer, [releasePlayer]);

  const syncState = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    setPlayback((current) => ({
      ...current,
      playing: player.playing,
      positionMs: Math.round(player.currentTime * 1000),
      durationMs: Math.round(player.duration * 1000) || current.durationMs,
    }));
  }, []);

  useEffect(() => {
    const timer = setInterval(syncState, 400);
    return () => clearInterval(timer);
  }, [syncState]);

  const waitForPlaybackStart = useCallback(async (player: VideoPlayer) => {
    const deadline = Date.now() + PLAYBACK_START_TIMEOUT_MS;
    while (Date.now() < deadline) {
      if (player.playing || player.currentTime > 0) return;
      await wait(120);
    }
    throw new Error("video_player_start_timeout");
  }, []);

  const playTrack = useCallback(async (track: QuranAudioTrack, startMs = 0) => {
    try {
      releasePlayer();
      const player = createVideoPlayer(track.uri);
      player.audioMixingMode = "doNotMix";
      player.staysActiveInBackground = true;
      player.showNowPlayingNotification = true;
      player.muted = false;
      player.volume = 1;
      player.playbackRate = playback.speed;
      player.preservesPitch = true;
      player.timeUpdateEventInterval = 0.4;
      playerRef.current = player;
      subscriptionsRef.current = [
        player.addListener("playingChange", ({ isPlaying }) => setPlayback((current) => ({ ...current, playing: isPlaying }))),
        player.addListener("timeUpdate", ({ currentTime }) => setPlayback((current) => ({ ...current, positionMs: Math.round(currentTime * 1000) }))),
        player.addListener("statusChange", ({ status, error }) => {
          if (status === "error") setPlayback((current) => ({ ...current, playing: false, error: error?.message || "تعذر تشغيل ملف التلاوة." }));
        }),
      ];
      if (startMs > 0) player.currentTime = startMs / 1000;
      player.play();
      await waitForPlaybackStart(player);
      setPlayback((current) => ({ ...current, track, playing: true, positionMs: startMs, durationMs: track.durationMs ?? current.durationMs, error: null }));
    } catch (error) {
      releasePlayer();
      setPlayback((current) => ({ ...current, playing: false, error: "تعذر بدء التلاوة. احذف التنزيل ثم أعد تنزيله." }));
      throw error;
    }
  }, [playback.speed, releasePlayer, waitForPlaybackStart]);

  const togglePlayback = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (player.playing) player.pause(); else player.play();
    syncState();
  }, [syncState]);

  const seekTo = useCallback(async (positionMs: number) => {
    const player = playerRef.current;
    if (!player) return;
    const maximum = Math.max(0, Math.round(player.duration * 1000));
    player.currentTime = Math.min(Math.max(positionMs, 0), maximum || positionMs) / 1000;
    syncState();
  }, [syncState]);

  const seekBy = useCallback(async (deltaMs: number) => seekTo(playback.positionMs + deltaMs), [playback.positionMs, seekTo]);

  const setSpeed = useCallback((speed: number) => {
    const normalized = Math.min(Math.max(speed, 0.5), 2);
    if (playerRef.current) playerRef.current.playbackRate = normalized;
    setPlayback((current) => ({ ...current, speed: normalized }));
    updateAudioSettings({ playbackSpeed: normalized });
  }, [updateAudioSettings]);

  const stop = useCallback(() => {
    const player = playerRef.current;
    if (player) { player.pause(); player.currentTime = 0; }
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
