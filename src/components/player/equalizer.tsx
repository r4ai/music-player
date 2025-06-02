import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  type EqualizerBands,
  useAudioPlayer,
} from "@/contexts/audio-player-context"
import { Sliders } from "lucide-react"

const EQ_BANDS: { key: keyof EqualizerBands; label: string; freq: string }[] = [
  { key: 400, label: "低音", freq: "400Hz" },
  { key: 1000, label: "低中音", freq: "1kHz" },
  { key: 2500, label: "中音", freq: "2.5kHz" },
  { key: 6300, label: "高中音", freq: "6.3kHz" },
  { key: 16000, label: "高音", freq: "16kHz" },
]

export const Equalizer = () => {
  const { equalizer, setEqualizerBand, loaded } = useAudioPlayer()

  const handleBandChange = (band: keyof EqualizerBands, value: number[]) => {
    setEqualizerBand(band, value[0])
  }

  const resetEqualizer = () => {
    for (const band of EQ_BANDS) {
      setEqualizerBand(band.key, 0)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sliders className="h-5 w-5" />
          イコライザ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-5 gap-4">
          {EQ_BANDS.map(({ key, label, freq }) => (
            <div
              key={String(key)}
              className="flex flex-col items-center space-y-3"
            >
              <div className="text-center">
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{freq}</div>
              </div>{" "}
              <div className="flex flex-col items-center h-36">
                <div className="text-xs text-muted-foreground mb-1">
                  {equalizer[key] > 0 ? "+" : ""}
                  {equalizer[key].toFixed(1)}dB
                </div>
                <Slider
                  orientation="vertical"
                  value={[equalizer[key]]}
                  min={-20}
                  max={20}
                  step={0.5}
                  onValueChange={(value: number[]) =>
                    handleBandChange(key, value)
                  }
                  className="h-28 w-4"
                  disabled={!loaded}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={resetEqualizer}
            disabled={!loaded}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            リセット
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
