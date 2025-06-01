import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { useMusicContext } from '../contexts/music-context'
import { Upload, Music } from 'lucide-react'

const Home = () => {
  const [isDragOver, setIsDragOver] = useState(false)
  const { setCurrentMusic } = useMusicContext()
  const navigate = useNavigate()

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('音楽ファイルを選択してください')
      return
    }

    const url = URL.createObjectURL(file)
    const audio = new Audio(url)
    
    const duration = await new Promise<number>((resolve) => {
      audio.onloadedmetadata = () => resolve(audio.duration)
    })

    const musicFile = {
      file,
      url,
      name: file.name,
      duration,
    }

    setCurrentMusic(musicFile)
    navigate({ to: '/player' })
  }, [setCurrentMusic, navigate])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Music className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              Music Player
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            音楽ファイルをドラッグ&ドロップして再生を開始
          </p>
        </div>

        <Card 
          className={`
            transition-all duration-300 ease-in-out cursor-pointer
            ${isDragOver 
              ? 'border-primary bg-primary/5 scale-105 shadow-lg' 
              : 'border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-accent/5'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-16 px-8">
            <Upload className={`h-16 w-16 mb-6 transition-colors ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
            <h3 className="text-xl font-semibold mb-2">
              {isDragOver ? '音楽ファイルをドロップ' : '音楽ファイルを選択'}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              MP3, WAV, M4A, OGG などの音楽ファイルをサポート
            </p>
            <p className="text-sm text-muted-foreground">
              ファイルをドラッグ&ドロップするか、クリックして選択
            </p>
            <input
              id="file-input"
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            シンプルで美しい音楽再生体験をお楽しみください
          </p>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
})
