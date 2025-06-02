import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAudioPlayer } from "@/contexts/audio-player-context"
import { Sliders, Volume1, Volume2, VolumeX } from "lucide-react"
import { Equalizer } from "./equalizer"

export const PlayerVolumeControls = () => {
  const { volume, pan, loaded, setVolume, setPan } = useAudioPlayer()

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100)
  }

  const handlePanChange = (value: number[]) => {
    setPan(value[0] / 100)
  }

  const toggleMute = () => {
    setVolume(volume === 0 ? 0.5 : 0)
  }

  const getVolumeIcon = () => {
    if (volume === 0) return VolumeX
    if (volume < 0.5) return Volume1
    return Volume2
  }

  const VolumeIcon = getVolumeIcon()

  return (
    <>
      <div className="flex items-center justify-center space-x-6">
        {/* 音量コントロール */}
        <div className="flex items-center space-x-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-accent/20 transition-all duration-200"
                onClick={toggleMute}
                disabled={!loaded}
              >
                <VolumeIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{volume === 0 ? "ミュート解除" : "ミュート"}</p>
            </TooltipContent>
          </Tooltip>

          <div className="w-24">
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-background [&_[role=slider]]:shadow-sm"
              disabled={!loaded}
            />
          </div>

          <span className="text-xs text-muted-foreground min-w-[2.5rem] tabular-nums">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* 左右バランス（Pan）コントロール */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-10 px-4 rounded-full hover:bg-accent/20 transition-all duration-200 border-border/50"
              disabled={!loaded}
            >
              <span className="text-xs font-medium">
                {pan === 0
                  ? "中央"
                  : pan < 0
                    ? `L${Math.abs(Math.round(pan * 100))}`
                    : `R${Math.round(pan * 100)}`}
              </span>
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-72 p-4" align="center">
            <div className="space-y-4">
              <div className="text-sm font-medium text-center">
                左右バランス調整
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground font-medium min-w-[1rem]">
                  L
                </span>
                <Slider
                  value={[pan * 100]}
                  min={-100}
                  max={100}
                  step={1}
                  onValueChange={handlePanChange}
                  className="flex-1 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-background [&_[role=slider]]:shadow-md"
                  disabled={!loaded}
                />
                <span className="text-sm text-muted-foreground font-medium min-w-[1rem]">
                  R
                </span>
              </div>
              <div className="text-center text-xs text-muted-foreground">
                現在:{" "}
                {pan === 0
                  ? "中央"
                  : pan < 0
                    ? `左に${Math.abs(Math.round(pan * 100))}%`
                    : `右に${Math.round(pan * 100)}%`}
              </div>
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPan(0)}
                  disabled={!loaded || pan === 0}
                  className="text-xs"
                >
                  中央にリセット
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* イコライザボタン */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-accent/20 transition-all duration-200"
              disabled={!loaded}
            >
              <Sliders className="h-5 w-5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5" />
                イコライザ
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <Equalizer />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
