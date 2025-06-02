import { Slider } from "@/components/ui/slider"
import { useAudioPlayer } from "@/contexts/audio-player-context"

type PlayerProgressBarProps = {
  formatTime: (seconds: number) => string
}

export const PlayerProgressBar = ({ formatTime }: PlayerProgressBarProps) => {
  const { currentTime, duration, loaded, seek } = useAudioPlayer()

  const handleProgressChange = (value: number[]) => {
    seek(value[0])
  }

  return (
    <div className="space-y-2">
      <Slider
        value={[currentTime]}
        max={duration || 100}
        step={1}
        onValueChange={handleProgressChange}
        className="w-full"
        disabled={!loaded}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
