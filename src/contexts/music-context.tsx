import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  type AudioStateListener,
  WebAudioManager,
} from "../lib/web-audio-manager"

interface MusicFile {
  file: File
  url: string
  name: string
  duration: number
}

interface MusicContextType {
  currentMusic: MusicFile | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isLoading: boolean
  error: string | null
  setCurrentMusic: (music: MusicFile | null) => void
  togglePlay: () => Promise<void>
  setVolume: (volume: number) => void
  seekTo: (time: number) => void
  getFrequencyData: () => Uint8Array
  getWaveformData: () => Uint8Array
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export const useMusicContext = () => {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error("useMusicContext must be used within a MusicProvider")
  }
  return context
}

interface MusicProviderProps {
  children: ReactNode
}

export const MusicProvider = ({ children }: MusicProviderProps) => {
  const [currentMusic, setCurrentMusicState] = useState<MusicFile | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const audioManagerRef = useRef<WebAudioManager | null>(null)

  // Initialize Web Audio Manager
  useEffect(() => {
    try {
      audioManagerRef.current = new WebAudioManager()

      const listener: AudioStateListener = {
        onStateChange: (state) => {
          setIsPlaying(state.isPlaying)
          setCurrentTime(state.currentTime)
          setDuration(state.duration)
          setVolumeState(state.volume)
        },
        onTimeUpdate: (time) => {
          setCurrentTime(time)
        },
        onEnded: () => {
          setIsPlaying(false)
          setCurrentTime(0)
        },
        onError: (err) => {
          setError(err.message)
          setIsLoading(false)
        },
      }

      audioManagerRef.current.addListener(listener)

      return () => {
        if (audioManagerRef.current) {
          audioManagerRef.current.removeListener(listener)
          audioManagerRef.current.dispose()
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initialize audio"
      setError(errorMessage)
    }
  }, [])

  const setCurrentMusic = async (music: MusicFile | null) => {
    setError(null)

    if (!music) {
      setCurrentMusicState(null)
      if (audioManagerRef.current) {
        audioManagerRef.current.stop()
      }
      return
    }

    try {
      setIsLoading(true)
      setCurrentMusicState(music)

      if (audioManagerRef.current) {
        await audioManagerRef.current.loadAudio(music.file)
        setDuration(audioManagerRef.current.getDuration())
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load audio"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePlay = async () => {
    if (!audioManagerRef.current || !currentMusic) return

    try {
      if (isPlaying) {
        audioManagerRef.current.pause()
      } else {
        await audioManagerRef.current.play()
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Playback failed"
      setError(errorMessage)
    }
  }

  const setVolume = (newVolume: number) => {
    if (audioManagerRef.current) {
      audioManagerRef.current.setVolume(newVolume)
    }
  }

  const seekTo = (time: number) => {
    if (audioManagerRef.current) {
      audioManagerRef.current.seekTo(time)
    }
  }

  const getFrequencyData = (): Uint8Array => {
    return audioManagerRef.current?.getFrequencyData() || new Uint8Array(0)
  }

  const getWaveformData = (): Uint8Array => {
    return audioManagerRef.current?.getWaveformData() || new Uint8Array(0)
  }

  const value: MusicContextType = {
    currentMusic,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    error,
    setCurrentMusic,
    togglePlay,
    setVolume,
    seekTo,
    getFrequencyData,
    getWaveformData,
  }

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}
