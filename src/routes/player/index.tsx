import { createFileRoute, useNavigate } from "@tanstack/react-router"
import {
  ArrowLeft,
  Loader2,
  Music,
  Pause,
  Play,
  SkipBack,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Equalizer } from "../../components/equalizer"
import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Slider } from "../../components/ui/slider"
import { useAudioPlayer } from "../../contexts/audio-player-context"

const Player = () => {
  const {
    playing,
    currentTime,
    duration,
    volume,
    pan,
    loaded,
    metadata,
    pause,
    play,
    setVolume,
    setPan,
    seek,
  } = useAudioPlayer()
  const navigate = useNavigate()

  const formatTime = (seconds: number) => {
    if (Number.isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleProgressChange = (value: number[]) => {
    seek(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100)
  }

  const handlePanChange = (value: number[]) => {
    setPan(value[0] / 100)
  }

  const handleGoBack = () => {
    navigate({ to: "/" })
  }

  if (!loaded) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="mb-4 hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            ホームに戻る
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* メインプレーヤー */}
          <Card className="shadow-xl border-primary/10">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  {loaded ? (
                    <Music className="h-12 w-12 text-white" />
                  ) : (
                    <Loader2 className="h-12 w-12 text-white animate-spin" />
                  )}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold truncate">
                {metadata?.title}
              </CardTitle>
              <p className="text-muted-foreground">
                {loaded ? (playing ? "再生中" : "一時停止中") : "読み込み中..."}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 進捗バー */}
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

              {/* 再生コントロール */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => seek(0)}
                  disabled={!loaded}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  size="icon"
                  className="h-16 w-16 bg-primary hover:bg-primary/90"
                  onClick={playing ? pause : play}
                  disabled={!loaded}
                >
                  {!loaded ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : playing ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>
              </div>

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
                    <span className="text-sm text-muted-foreground">
                      バランス
                    </span>
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
            </CardContent>
          </Card>

          {/* イコライザ */}
          <Equalizer />
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/player/")({
  component: Player,
})
