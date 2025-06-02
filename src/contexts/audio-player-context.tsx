import { parseBlob } from "music-metadata"
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

export type AudioMetadata = {
  title: string
  artist: string
  album: string
  year: number
  genre: string
  trackNumber: number
}

export type AudioPlayerContextType = {
  // state
  loaded: boolean
  metadata?: AudioMetadata
  playing: boolean
  duration: number
  currentTime: number
  volume: number
  pan: number
  bass: number
  mid: number
  treble: number

  // actions
  loadFile: (file: File) => Promise<void>
  play: () => Promise<void>
  pause: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  setPan: (pan: number) => void
  setBass: (freq: number) => void
  setMid: (freq: number) => void
  setTreble: (freq: number) => void
}

const MusicPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined,
)

export const useAudioPlayer = () => {
  const context = useContext(MusicPlayerContext)
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider")
  }
  return context
}

type AudioPlayerProviderProps = {
  children: ReactNode
}

export const AudioPlayerProvider = ({ children }: AudioPlayerProviderProps) => {
  // audio graph refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const panRef = useRef<StereoPannerNode | null>(null)
  const eqRef = useRef<{
    bass: BiquadFilterNode
    mid: BiquadFilterNode
    treble: BiquadFilterNode
  } | null>(null)

  // states
  const [loaded, setLoaded] = useState(false)
  const [metadata, setMetadata] = useState<AudioMetadata | undefined>(undefined)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [pan, setPan] = useState(0)
  const [bass, setBass] = useState(0)
  const [mid, setMid] = useState(0)
  const [treble, setTreble] = useState(0)

  // initialization
  useEffect(() => {
    ctxRef.current =
      new // biome-ignore lint/suspicious/noExplicitAny: webkitAudioContext is needed for old browsers
      (window.AudioContext || (window as any).webkitAudioContext)({
        latencyHint: "interactive",
      })
    gainRef.current = ctxRef.current.createGain()
    panRef.current = ctxRef.current.createStereoPanner()

    // EQ
    const ctx = ctxRef.current
    eqRef.current = {
      bass: ctx.createBiquadFilter(),
      mid: ctx.createBiquadFilter(),
      treble: ctx.createBiquadFilter(),
    }
    eqRef.current.bass.type = "lowshelf"
    eqRef.current.mid.type = "peaking"
    eqRef.current.treble.type = "highshelf"
    eqRef.current.bass.frequency.value = 100
    eqRef.current.mid.frequency.value = 1000
    eqRef.current.treble.frequency.value = 6000
  }, [])

  // helpers
  const resumeCtx = async () => {
    const ctx = ctxRef.current
    if (ctx?.state === "suspended") await ctx.resume()
  }

  const buildGraph = () => {
    if (
      !ctxRef.current ||
      !sourceRef.current ||
      !gainRef.current ||
      !panRef.current ||
      !eqRef.current
    ) {
      throw new Error("Audio graph is not properly initialized")
    }

    const ctx = ctxRef.current
    sourceRef.current
      .connect(gainRef.current)
      .connect(panRef.current)
      .connect(eqRef.current.bass)
      .connect(eqRef.current.mid)
      .connect(eqRef.current.treble)
      .connect(ctx.destination)
  }

  // actions
  const loadFile = async (file: File) => {
    if (!audioRef.current) audioRef.current = new Audio()
    else URL.revokeObjectURL(audioRef.current.src)
    const audio = audioRef.current

    // cleanup old graph
    sourceRef.current?.disconnect()

    audio.src = URL.createObjectURL(file)
    audio.preload = "auto"

    const { common } = await parseBlob(file)
    setMetadata({
      title: common.title ?? "Unknown Title",
      artist: common.artist ?? "Unknown Artist",
      album: common.album ?? "Unknown Album",
      year: common.year ?? 0,
      genre: common.genre?.[0] ?? "",
      trackNumber: common.track.no ?? 0,
    })

    audio.onloadedmetadata = () => {
      setDuration(audio.duration)
      setLoaded(true)
      seek(0)
    }

    const ctx = ctxRef.current
    if (!ctx) {
      throw new Error("AudioContext is not initialized")
    }
    sourceRef.current = ctx.createMediaElementSource(audio)
    buildGraph()
  }

  const play = async () => {
    if (!loaded) return
    if (!audioRef.current) {
      throw new Error("Audio element is not initialized")
    }
    await resumeCtx()
    await audioRef.current.play()
    setPlaying(true)
  }
  const pause = () => {
    if (!audioRef.current) {
      throw new Error("Audio element is not initialized")
    }
    audioRef.current.pause()
    setPlaying(false)
  }
  const stop = () => {
    if (!audioRef.current) {
      throw new Error("Audio element is not initialized")
    }
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setPlaying(false)
  }
  const seek = (time: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  // event listeners on demand
  // biome-ignore lint/correctness/useExhaustiveDependencies: subscribe to audio events when loaded
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const timeUpdate = () => setCurrentTime(audio.currentTime)
    const ended = () => setPlaying(false)
    audio.addEventListener("timeupdate", timeUpdate)
    audio.addEventListener("ended", ended)
    return () => {
      audio.removeEventListener("timeupdate", timeUpdate)
      audio.removeEventListener("ended", ended)
    }
  }, [loaded])

  // node param reactions
  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume
  }, [volume])
  useEffect(() => {
    if (panRef.current) panRef.current.pan.value = pan
  }, [pan])
  useEffect(() => {
    if (eqRef.current) eqRef.current.bass.gain.value = bass
  }, [bass])
  useEffect(() => {
    if (eqRef.current) eqRef.current.mid.gain.value = mid
  }, [mid])
  useEffect(() => {
    if (eqRef.current) eqRef.current.treble.gain.value = treble
  }, [treble])

  return (
    <MusicPlayerContext.Provider
      value={{
        loaded,
        playing,
        duration,
        currentTime,
        volume,
        pan,
        bass,
        mid,
        treble,
        loadFile,
        play,
        pause,
        stop,
        seek,
        setVolume,
        setPan,
        setBass,
        setMid,
        setTreble,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  )
}
