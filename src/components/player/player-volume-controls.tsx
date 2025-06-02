import { Slider } from "@/components/ui/slider"
import { useAudioPlayer } from "@/contexts/audio-player-context"
import { Volume2, VolumeX } from "lucide-react"

export const PlayerVolumeControls = () => {
  const { volume, pan, loaded, setVolume, setPan } = useAudioPlayer()

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100)
  }

  const handlePanChange = (value: number[]) => {
    setPan(value[0] / 100)
  }

  return (
    <div className="space-y-4">
      {/* 音量コントロール */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 min-w-0">
            {volume === 0 ? (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Volume2 className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">音量</span>
          </div>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="flex-1"
            disabled={!loaded}
          />
          <span className="text-sm text-muted-foreground min-w-[3ch]">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* 左右バランス（Pan）コントロール */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="text-lg text-muted-foreground">L</span>
            <span className="text-sm text-muted-foreground">バランス</span>
            <span className="text-lg text-muted-foreground">R</span>
          </div>
          <Slider
            value={[pan * 100]}
            min={-100}
            max={100}
            step={1}
            onValueChange={handlePanChange}
            className="flex-1"
            disabled={!loaded}
          />
          <span className="text-sm text-muted-foreground min-w-[4ch]">
            {pan === 0
              ? "中央"
              : pan < 0
                ? `L${Math.abs(Math.round(pan * 100))}`
                : `R${Math.round(pan * 100)}`}
          </span>
        </div>
      </div>
    </div>
  )
}
