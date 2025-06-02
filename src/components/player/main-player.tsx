import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAudioPlayer } from "@/contexts/audio-player-context"
import { Loader2, Music } from "lucide-react"

export const MainPlayer = () => {
  const { loaded, metadata, playing } = useAudioPlayer()

  return (
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
      <CardContent>
        {metadata && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">アーティスト: </span>
              {metadata.artist}
            </div>
            <div>
              <span className="font-medium">アルバム: </span>
              {metadata.album}
            </div>
            {metadata.year > 0 && (
              <div>
                <span className="font-medium">年: </span>
                {metadata.year}
              </div>
            )}
            {metadata.genre && (
              <div>
                <span className="font-medium">ジャンル: </span>
                {metadata.genre}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
