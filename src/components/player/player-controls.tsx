import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAudioPlayer } from "@/contexts/audio-player-context"
import {
  Loader2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react"

export const PlayerControls = () => {
  const { loaded, playing, play, pause, seek, duration } = useAudioPlayer()

  const handlePrevious = () => {
    seek(0)
  }

  const handleNext = () => {
    // 次の曲がないので、現在の曲の最後にシーク
    if (duration > 0) {
      seek(duration)
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* メインコントロール */}
        <div className="flex items-center justify-center space-x-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full hover:bg-accent/20 transition-all duration-200"
                disabled
              >
                <Shuffle className="h-5 w-5 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>シャッフル（未実装）</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full hover:bg-accent/20 transition-all duration-200"
                onClick={handlePrevious}
                disabled={!loaded}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>最初に戻る</p>
            </TooltipContent>
          </Tooltip>

          {/* メイン再生ボタン */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                onClick={playing ? pause : play}
                disabled={!loaded}
              >
                {!loaded ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
                ) : playing ? (
                  <Pause className="h-8 w-8 text-primary-foreground" />
                ) : (
                  <Play className="h-8 w-8 ml-1 text-primary-foreground" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{playing ? "一時停止" : "再生"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full hover:bg-accent/20 transition-all duration-200"
                onClick={handleNext}
                disabled={!loaded}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>次へ</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full hover:bg-accent/20 transition-all duration-200"
                disabled
              >
                <Repeat className="h-5 w-5 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>リピート（未実装）</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
