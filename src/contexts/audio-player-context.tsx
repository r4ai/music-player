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

export type EqualizerBands = {
  400: number
  1000: number
  2500: number
  6300: number
  16000: number
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
  equalizer: EqualizerBands

  // actions
  loadFile: (file: File) => Promise<void>
  play: () => Promise<void>
  pause: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  setPan: (pan: number) => void
  setEqualizerBand: (band: keyof EqualizerBands, gain: number) => void
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
    400: BiquadFilterNode
    1000: BiquadFilterNode
    2500: BiquadFilterNode
    6300: BiquadFilterNode
    16000: BiquadFilterNode
  } | null>(null)

  // states
  const [loaded, setLoaded] = useState(false)
  const [metadata, setMetadata] = useState<AudioMetadata | undefined>(undefined)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [pan, setPan] = useState(0)
  const [equalizer, setEqualizer] = useState<EqualizerBands>({
    400: 0,
    1000: 0,
    2500: 0,
    6300: 0,
    16000: 0,
  })

  // initialization
  useEffect(() => {
    ctxRef.current =
      new // biome-ignore lint/suspicious/noExplicitAny: webkitAudioContext is needed for old browsers
      (window.AudioContext || (window as any).webkitAudioContext)({
        latencyHint: "interactive",
      })
    gainRef.current = ctxRef.current.createGain()
    panRef.current = ctxRef.current.createStereoPanner()

    // EQ with 5 bands
    const ctx = ctxRef.current
    eqRef.current = {
      400: ctx.createBiquadFilter(),
      1000: ctx.createBiquadFilter(),
      2500: ctx.createBiquadFilter(),
      6300: ctx.createBiquadFilter(),
      16000: ctx.createBiquadFilter(),
    }

    // Configure filter types and frequencies
    eqRef.current[400].type = "lowshelf"
    eqRef.current[400].frequency.value = 400

    eqRef.current[1000].type = "peaking"
    eqRef.current[1000].frequency.value = 1000
    eqRef.current[1000].Q.value = 1

    eqRef.current[2500].type = "peaking"
    eqRef.current[2500].frequency.value = 2500
    eqRef.current[2500].Q.value = 1

    eqRef.current[6300].type = "peaking"
    eqRef.current[6300].frequency.value = 6300
    eqRef.current[6300].Q.value = 1

    eqRef.current[16000].type = "highshelf"
    eqRef.current[16000].frequency.value = 16000
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
      .connect(eqRef.current[400])
      .connect(eqRef.current[1000])
      .connect(eqRef.current[2500])
      .connect(eqRef.current[6300])
      .connect(eqRef.current[16000])
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
      title:
        common.title ?? file.name.replace(/\.[^/.]+$/, "") ?? "Unknown Title",
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

  const setEqualizerBand = (band: keyof EqualizerBands, gain: number) => {
    setEqualizer((prev) => ({ ...prev, [band]: gain }))
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

  // Update equalizer bands
  useEffect(() => {
    if (eqRef.current) {
      for (const [band, gain] of Object.entries(equalizer)) {
        const bandKey = Number(band) as keyof EqualizerBands
        const filter = eqRef.current[bandKey]
        if (filter) {
          filter.gain.value = gain
        }
      }
    }
  }, [equalizer])

  return (
    <MusicPlayerContext.Provider
      value={{
        loaded,
        metadata,
        playing,
        duration,
        currentTime,
        volume,
        pan,
        equalizer,
        loadFile,
        play,
        pause,
        stop,
        seek,
        setVolume,
        setPan,
        setEqualizerBand,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  )
}
