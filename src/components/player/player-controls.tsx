import { Button } from "@/components/ui/button"
import { useAudioPlayer } from "@/contexts/audio-player-context"
import { Loader2, Pause, Play, SkipBack } from "lucide-react"

export const PlayerControls = () => {
  const { loaded, playing, play, pause, seek } = useAudioPlayer()

  return (
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
  )
}
