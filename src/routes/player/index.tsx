import { Player } from "@/components/player"
import { Button } from "@/components/ui/button"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

const PlayerPage = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate({ to: "/" })
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

        <Player />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/player/")({
  component: PlayerPage,
})
