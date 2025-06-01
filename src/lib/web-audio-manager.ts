export interface AudioState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
}

export interface AudioStateListener {
  onStateChange: (state: AudioState) => void
  onTimeUpdate: (currentTime: number) => void
  onEnded: () => void
  onError: (error: Error) => void
}

export class WebAudioManager {
  private audioContext: AudioContext | null = null
  private audioBuffer: AudioBuffer | null = null
  private sourceNode: AudioBufferSourceNode | null = null
  private gainNode: GainNode | null = null
  private analyserNode: AnalyserNode | null = null
  
  private startTime: number = 0
  private pauseTime: number = 0
  private isPlaying: boolean = false
  private volume: number = 1
  private listeners: AudioStateListener[] = []
  private animationFrameId: number | null = null

  constructor() {
    this.initializeAudioContext()
  }

  private initializeAudioContext = () => {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.gainNode = this.audioContext.createGain()
      this.analyserNode = this.audioContext.createAnalyser()
      
      this.gainNode.connect(this.analyserNode)
      this.analyserNode.connect(this.audioContext.destination)
      
      this.gainNode.gain.value = this.volume
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error)
      throw new Error('Web Audio API is not supported in this browser')
    }
  }

  public addListener = (listener: AudioStateListener) => {
    this.listeners.push(listener)
  }

  public removeListener = (listener: AudioStateListener) => {
    const index = this.listeners.indexOf(listener)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  private notifyStateChange = () => {
    const state: AudioState = {
      isPlaying: this.isPlaying,
      currentTime: this.getCurrentTime(),
      duration: this.getDuration(),
      volume: this.volume
    }
    
    this.listeners.forEach(listener => {
      listener.onStateChange(state)
    })
  }

  private notifyTimeUpdate = () => {
    const currentTime = this.getCurrentTime()
    this.listeners.forEach(listener => {
      listener.onTimeUpdate(currentTime)
    })
  }

  private startTimeTracking = () => {
    const updateTime = () => {
      if (this.isPlaying) {
        this.notifyTimeUpdate()
        
        // Check if audio has ended
        if (this.getCurrentTime() >= this.getDuration()) {
          this.stop()
          this.listeners.forEach(listener => listener.onEnded())
          return
        }
        
        this.animationFrameId = requestAnimationFrame(updateTime)
      }
    }
    
    this.animationFrameId = requestAnimationFrame(updateTime)
  }

  private stopTimeTracking = () => {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  public async loadAudio(file: File): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioContext is not initialized')
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      this.pauseTime = 0
      this.notifyStateChange()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      const audioError = new Error(`Failed to load audio: ${errorMessage}`)
      this.listeners.forEach(listener => listener.onError(audioError))
      throw audioError
    }
  }
  public play = async () => {
    if (!this.audioContext || !this.audioBuffer) {
      throw new Error('Audio is not loaded')
    }

    // If already playing, do nothing
    if (this.isPlaying) {
      return
    }

    // Resume AudioContext if suspended (required for user interaction)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    // Stop current playback only if there's an active source node
    if (this.sourceNode) {
      this.sourceNode.stop()
      this.sourceNode.disconnect()
      this.sourceNode = null
    }

    // Create new source node
    this.sourceNode = this.audioContext.createBufferSource()
    this.sourceNode.buffer = this.audioBuffer
    this.sourceNode.connect(this.gainNode!)

    // Set up event handlers
    this.sourceNode.onended = () => {
      if (this.isPlaying) {
        this.stop()
        this.listeners.forEach(listener => listener.onEnded())
      }
    }

    // Start playback from the paused position
    this.sourceNode.start(0, this.pauseTime)
    this.startTime = this.audioContext.currentTime - this.pauseTime
    this.isPlaying = true
    
    this.startTimeTracking()
    this.notifyStateChange()
  }

  public pause = () => {
    if (this.sourceNode && this.isPlaying) {
      this.pauseTime = this.getCurrentTime()
      this.sourceNode.stop()
      this.sourceNode = null
      this.isPlaying = false
      
      this.stopTimeTracking()
      this.notifyStateChange()
    }
  }

  public stop = () => {
    if (this.sourceNode) {
      this.sourceNode.stop()
      this.sourceNode = null
    }
    
    this.isPlaying = false
    this.pauseTime = 0
    this.startTime = 0
    
    this.stopTimeTracking()
    this.notifyStateChange()
  }

  public seekTo = (time: number) => {
    const wasPlaying = this.isPlaying
    this.pauseTime = Math.max(0, Math.min(time, this.getDuration()))
    
    if (wasPlaying) {
      this.pause()
      this.play()
    } else {
      this.notifyStateChange()
    }
  }

  public setVolume = (volume: number) => {
    this.volume = Math.max(0, Math.min(1, volume))
    
    if (this.gainNode) {
      // Use exponential ramping for smoother volume changes
      const currentTime = this.audioContext?.currentTime || 0
      this.gainNode.gain.setTargetAtTime(this.volume, currentTime, 0.1)
    }
    
    this.notifyStateChange()
  }

  public getCurrentTime = (): number => {
    if (!this.audioContext) return 0
    
    if (this.isPlaying && this.sourceNode) {
      return this.audioContext.currentTime - this.startTime
    }
    
    return this.pauseTime
  }

  public getDuration = (): number => {
    return this.audioBuffer?.duration || 0
  }

  public getIsPlaying = (): boolean => {
    return this.isPlaying
  }

  public getVolume = (): number => {
    return this.volume
  }

  public getFrequencyData = (): Uint8Array => {
    if (!this.analyserNode) {
      return new Uint8Array(0)
    }
    
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount)
    this.analyserNode.getByteFrequencyData(dataArray)
    return dataArray
  }

  public getWaveformData = (): Uint8Array => {
    if (!this.analyserNode) {
      return new Uint8Array(0)
    }
    
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount)
    this.analyserNode.getByteTimeDomainData(dataArray)
    return dataArray
  }

  public dispose = () => {
    this.stop()
    this.stopTimeTracking()
    
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    
    this.audioBuffer = null
    this.gainNode = null
    this.analyserNode = null
    this.listeners = []
  }
}
