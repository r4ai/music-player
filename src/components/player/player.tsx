import { Card, CardContent } from "@/components/ui/card"
import { MainPlayer } from "./main-player"
import { PlayerControls } from "./player-controls"
import { PlayerProgressBar } from "./player-progress-bar"
import { PlayerVolumeControls } from "./player-volume-controls"

export const Player = () => {
  const formatTime = (seconds: number) => {
    if (Number.isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* モダンなカード型レイアウト - コンパクト版 */}
      <Card className="backdrop-blur-xl bg-card/50 border-border/50 shadow-2xl overflow-hidden">
        <div className="relative">
          {/* 背景グラデーション */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

          {/* メインコンテンツ - シングルカラム */}
          <CardContent className="relative p-6 lg:p-8">
            <div className="space-y-6">
              {/* メインプレーヤーエリア */}
              <MainPlayer />

              {/* プレーヤーコントロール統合エリア */}
              <div className="space-y-4">
                <PlayerProgressBar formatTime={formatTime} />
                <PlayerControls />
                <PlayerVolumeControls />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
