import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useAudioPlayer } from "@/contexts/audio-player-context"
import { Loader2, Music } from "lucide-react"

export const MainPlayer = () => {
  const { loaded, metadata, playing } = useAudioPlayer()

  return (
    <div className="space-y-4">
      {/* コンパクトなアルバムアートワーク */}
      <div className="max-w-xs mx-auto">
        <AspectRatio
          ratio={1}
          className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl overflow-hidden shadow-lg"
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
              {loaded ? (
                <Music className="h-12 w-12 text-white drop-shadow-lg" />
              ) : (
                <Loader2 className="h-12 w-12 text-white animate-spin drop-shadow-lg" />
              )}
            </div>
          </div>
        </AspectRatio>
      </div>

      {/* 楽曲情報 */}
      <div className="text-center space-y-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground leading-tight truncate">
            {metadata?.title || "楽曲を選択してください"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {metadata?.artist || "アーティスト不明"}
          </p>
          <p className="text-base text-muted-foreground/80">
            {metadata?.album || "アルバム不明"}
          </p>
        </div>

        {/* 再生状態 */}
        <div className="flex items-center justify-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${playing ? "bg-green-500" : "bg-muted-foreground/50"}`}
          />
          <span className="text-sm text-muted-foreground">
            {loaded ? (playing ? "再生中" : "一時停止中") : "読み込み中..."}
          </span>
        </div>

        {/* 追加のメタデータ */}
        {metadata && (metadata.year > 0 || metadata.genre) && (
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground/80">
            {metadata.year > 0 && <span>{metadata.year}</span>}
            {metadata.genre && (
              <>
                {metadata.year > 0 && <span>•</span>}
                <span>{metadata.genre}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
