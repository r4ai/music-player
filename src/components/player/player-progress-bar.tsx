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
    <div className="space-y-3">
      {/* プログレスバー */}
      <div className="relative">
        <Slider
          value={[currentTime]}
          maxValue={duration}
          onChange={handleProgressChange}
          className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-background [&_[role=slider]]:shadow-md [&_[role=slider]]:transition-all [&_[role=slider]]:hover:scale-110"
          isDisabled={!loaded}
        />
      </div>

      {/* 時間表示 */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground font-medium tabular-nums">
          {formatTime(currentTime)}
        </span>
        <span className="text-muted-foreground/60 font-medium tabular-nums">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  )
}
