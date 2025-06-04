import { Player } from "@/components/player"
import { Button } from "@heroui/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

const PlayerPage = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate({ to: "/" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* ヘッダー */}
      <div className="fixed top-0 left-0 right-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="hover:bg-accent/20 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            ホームに戻る
          </Button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="pt-20 pb-8 px-6">
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-7rem)]">
          <Player />
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/player/")({
  component: PlayerPage,
})
