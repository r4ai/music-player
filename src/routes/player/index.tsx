import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Slider } from '../../components/ui/slider'
import { useMusicContext } from '../../contexts/music-context'
import { Play, Pause, Volume2, VolumeX, SkipBack, ArrowLeft, Music, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '../../components/ui/alert'

const Player = () => {
  const {
    currentMusic,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    error,
    togglePlay,
    setVolume,
    seekTo,
  } = useMusicContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentMusic) {
      navigate({ to: '/' })
    }
  }, [currentMusic, navigate])

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleTogglePlay = async () => {
    try {
      await togglePlay()
    } catch (err) {
      console.error('Playback error:', err)
    }
  }

  const handleProgressChange = (value: number[]) => {
    seekTo(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100)
  }

  const handleGoBack = () => {
    navigate({ to: '/' })
  }

  if (!currentMusic) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
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

        <Card className="shadow-xl border-primary/10">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                {isLoading ? (
                  <Loader2 className="h-12 w-12 text-white animate-spin" />
                ) : (
                  <Music className="h-12 w-12 text-white" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold truncate">
              {currentMusic.name.replace(/\.[^/.]+$/, '')}
            </CardTitle>
            <p className="text-muted-foreground">
              {isLoading ? '読み込み中...' : isPlaying ? '再生中' : '一時停止中'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 進捗バー */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleProgressChange}
                className="w-full"
                disabled={isLoading}
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
                onClick={() => seekTo(0)}
                disabled={isLoading}
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                size="icon"
                className="h-16 w-16 bg-primary hover:bg-primary/90"
                onClick={handleTogglePlay}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : isPlaying ? (
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
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground min-w-[3ch]">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/player/')({
  component: Player,
})
