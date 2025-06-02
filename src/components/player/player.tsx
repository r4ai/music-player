import { Card, CardContent } from "@/components/ui/card"
import { useAudioPlayer } from "@/contexts/audio-player-context"
import { Equalizer } from "./equalizer"
import { MainPlayer } from "./main-player"
import { PlayerControls } from "./player-controls"
import { PlayerProgressBar } from "./player-progress-bar"
import { PlayerVolumeControls } from "./player-volume-controls"

export const Player = () => {
  const { loaded } = useAudioPlayer()

  const formatTime = (seconds: number) => {
    if (Number.isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!loaded) {
    return null
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* メインプレーヤー */}
      <div className="space-y-6">
        <MainPlayer />

        <Card className="shadow-xl border-primary/10">
          <CardContent className="space-y-6 pt-6">
            {/* 進捗バー */}
            <PlayerProgressBar formatTime={formatTime} />

            {/* 再生コントロール */}
            <PlayerControls />

            {/* 音量・パンコントロール */}
            <PlayerVolumeControls />
          </CardContent>
        </Card>
      </div>

      {/* イコライザ */}
      <Equalizer />
    </div>
  )
}
