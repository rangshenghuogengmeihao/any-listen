/* eslint-disable @typescript-eslint/no-unnecessary-condition */
let audio: HTMLAudioElement | null = null
let audioContext: AudioContext | null = null
let mediaSource: MediaElementAudioSourceNode | null = null
let analyser: AnalyserNode | null = null
// https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext
// https://benzleung.gitbooks.io/web-audio-api-mini-guide/content/chapter5-1.html
export const freqs = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000] as const
type Freqs = (typeof freqs)[number]
let biquads: Map<`hz${Freqs}`, BiquadFilterNode> | null = null
export const freqsPreset = [
  { name: 'pop', hz31: 6, hz62: 5, hz125: -3, hz250: -2, hz500: 5, hz1000: 4, hz2000: -4, hz4000: -3, hz8000: 6, hz16000: 4 },
  { name: 'dance', hz31: 4, hz62: 3, hz125: -4, hz250: -6, hz500: 0, hz1000: 0, hz2000: 3, hz4000: 4, hz8000: 4, hz16000: 5 },
  { name: 'rock', hz31: 7, hz62: 6, hz125: 2, hz250: 1, hz500: -3, hz1000: -4, hz2000: 2, hz4000: 1, hz8000: 4, hz16000: 5 },
  {
    name: 'classical',
    hz31: 6,
    hz62: 7,
    hz125: 1,
    hz250: 2,
    hz500: -1,
    hz1000: 1,
    hz2000: -4,
    hz4000: -6,
    hz8000: -7,
    hz16000: -8,
  },
  { name: 'vocal', hz31: -5, hz62: -6, hz125: -4, hz250: -3, hz500: 3, hz1000: 4, hz2000: 5, hz4000: 4, hz8000: -3, hz16000: -3 },
  { name: 'slow', hz31: 5, hz62: 4, hz125: 2, hz250: 0, hz500: -2, hz1000: 0, hz2000: 3, hz4000: 6, hz8000: 7, hz16000: 8 },
  {
    name: 'electronic',
    hz31: 6,
    hz62: 5,
    hz125: 0,
    hz250: -5,
    hz500: -4,
    hz1000: 0,
    hz2000: 6,
    hz4000: 8,
    hz8000: 8,
    hz16000: 7,
  },
  { name: 'subwoofer', hz31: 8, hz62: 7, hz125: 5, hz250: 4, hz500: 0, hz1000: 0, hz2000: 0, hz4000: 0, hz8000: 0, hz16000: 0 },
  { name: 'soft', hz31: -5, hz62: -5, hz125: -4, hz250: -4, hz500: 3, hz1000: 2, hz2000: 4, hz4000: 4, hz8000: 0, hz16000: 0 },
] as const
export const convolutions = [
  { name: 'telephone', mainGain: 0.0, sendGain: 3.0, source: 'filter-telephone.wav' }, // 电话
  { name: 's2_r4_bd', mainGain: 1.8, sendGain: 0.9, source: 's2_r4_bd.wav' }, // 教堂
  { name: 'bright_hall', mainGain: 0.8, sendGain: 2.4, source: 'bright-hall.wav' },
  { name: 'cinema_diningroom', mainGain: 0.6, sendGain: 2.3, source: 'cinema-diningroom.wav' },
  { name: 'dining_living_true_stereo', mainGain: 0.6, sendGain: 1.8, source: 'dining-living-true-stereo.wav' },
  { name: 'living_bedroom_leveled', mainGain: 0.6, sendGain: 2.1, source: 'living-bedroom-leveled.wav' },
  { name: 'spreader50_65ms', mainGain: 1, sendGain: 2.5, source: 'spreader50-65ms.wav' },
  // { name: 'spreader25_125ms', mainGain: 1, sendGain: 2.5, source: 'spreader25-125ms.wav' },
  // { name: 'backslap', mainGain: 1.8, sendGain: 0.8, source: 'backslap1.wav' },
  { name: 's3_r1_bd', mainGain: 1.8, sendGain: 0.8, source: 's3_r1_bd.wav' },
  { name: 'matrix_1', mainGain: 1.5, sendGain: 0.9, source: 'matrix-reverb1.wav' },
  { name: 'matrix_2', mainGain: 1.3, sendGain: 1, source: 'matrix-reverb2.wav' },
  { name: 'cardiod_35_10_spread', mainGain: 1.8, sendGain: 0.6, source: 'cardiod-35-10-spread.wav' },
  { name: 'tim_omni_35_10_magnetic', mainGain: 1, sendGain: 0.2, source: 'tim-omni-35-10-magnetic.wav' },
  // { name: 'spatialized', mainGain: 1.8, sendGain: 0.8, source: 'spatialized8.wav' },
  // { name: 'zing_long_stereo', mainGain: 0.8, sendGain: 1.8, source: 'zing-long-stereo.wav' },
  { name: 'feedback_spring', mainGain: 1.8, sendGain: 0.8, source: 'feedback-spring.wav' },
  // { name: 'tim_omni_rear_blend', mainGain: 1.8, sendGain: 0.8, source: 'tim-omni-rear-blend.wav' },
] as const
// 半音
// export const semitones = [-1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] as const

let convolver: ConvolverNode | null = null
let convolverSourceGainNode: GainNode | null = null
let convolverOutputGainNode: GainNode | null = null
let convolverDynamicsCompressor: DynamicsCompressorNode | null = null
let gainNode: GainNode | null = null
let panner: PannerNode | null = null
let pitchShifterNode: AudioWorkletNode | null = null
let pitchShifterNodePitchFactor: AudioParam | null = null
let pitchShifterNodeLoadStatus: 'none' | 'loading' | 'unconnect' | 'connected' = 'none'
let pitchShifterNodeTempValue = 1
export const soundR = 0.5

export const createAudio = () => {
  if (audio) return
  audio = new window.Audio()
  audio.controls = false
  audio.autoplay = true
  audio.preload = 'auto'
  audio.crossOrigin = 'anonymous'

  // https://developer.chrome.com/blog/autoplay
  audio.addEventListener(
    'playing',
    () => {
      if (audioContext?.state == 'suspended') void audioContext.resume()
    },
    { once: true }
  )
}
export const releasePlayer = async () => {
  if (!audio) return
  setStop()
  audio = null

  if (audioContext) {
    await audioContext.close()
    // eslint-disable-next-line require-atomic-updates
    audioContext = null
    convolver!.disconnect()
    convolver = null
    convolverSourceGainNode!.disconnect()
    convolverSourceGainNode = null
    convolverOutputGainNode!.disconnect()
    convolverOutputGainNode = null
    convolverDynamicsCompressor!.disconnect()
    convolverDynamicsCompressor = null
    gainNode!.disconnect()
    gainNode = null
    panner!.disconnect()
    panner = null
    pitchShifterNode?.disconnect()
    pitchShifterNode = null
    for (const filter of biquads!.values()) {
      filter.disconnect()
    }
    biquads = null
    pitchShifterNodePitchFactor = null
    pitchShifterNodeLoadStatus = 'none'
    pitchShifterNodeTempValue = 1
  }
}

const initAnalyser = () => {
  analyser = audioContext!.createAnalyser()
  analyser.fftSize = 256
}

const initBiquadFilter = () => {
  biquads = new Map()
  let i

  for (const item of freqs) {
    const filter = audioContext!.createBiquadFilter()
    biquads.set(`hz${item}`, filter)
    filter.type = 'peaking'
    filter.frequency.value = item
    filter.Q.value = 1.4
    filter.gain.value = 0
  }

  for (i = 1; i < freqs.length; i++) {
    biquads.get(`hz${freqs[i - 1]}`)!.connect(biquads.get(`hz${freqs[i]}`)!)
  }
}

const initConvolver = () => {
  convolverSourceGainNode = audioContext!.createGain()
  convolverOutputGainNode = audioContext!.createGain()
  convolverDynamicsCompressor = audioContext!.createDynamicsCompressor()
  convolver = audioContext!.createConvolver()
  convolver.connect(convolverOutputGainNode)
  convolverSourceGainNode.connect(convolverDynamicsCompressor)
  convolverOutputGainNode.connect(convolverDynamicsCompressor)
}

const initPanner = () => {
  panner = audioContext!.createPanner()
}

const initGain = () => {
  gainNode = audioContext!.createGain()
}

const initAdvancedAudioFeatures = () => {
  if (audioContext) return
  if (!audio) throw new Error('audio not defined')
  audioContext = new window.AudioContext({ latencyHint: 'playback' })

  initAnalyser()
  initBiquadFilter()
  initConvolver()
  initPanner()
  initGain()
  // source -> analyser -> biquadFilter -> [(convolver & convolverSource)->convolverDynamicsCompressor] -> panner -> gain
  mediaSource = audioContext.createMediaElementSource(audio)
  mediaSource.connect(analyser!)
  analyser!.connect(biquads!.get(`hz${freqs[0]}`)!)
  const lastBiquadFilter = biquads!.get(`hz${freqs.at(-1)!}`)!
  lastBiquadFilter.connect(convolverSourceGainNode!)
  lastBiquadFilter.connect(convolver!)
  convolverDynamicsCompressor!.connect(panner!)
  panner!.connect(gainNode!)
  gainNode!.connect(audioContext.destination)
}

export const getAudioContext = () => {
  initAdvancedAudioFeatures()
  return audioContext
}

export const getAnalyser = (): AnalyserNode | null => {
  initAdvancedAudioFeatures()
  return analyser
}

export const getBiquadFilter = () => {
  initAdvancedAudioFeatures()
  return biquads
}

// let isConvolverConnected = false
export const setConvolver = (buffer: AudioBuffer | null, mainGain: number, sendGain: number) => {
  initAdvancedAudioFeatures()
  convolver!.buffer = buffer
  // console.log(mainGain, sendGain)
  if (buffer) {
    convolverSourceGainNode!.gain.value = mainGain
    convolverOutputGainNode!.gain.value = sendGain
  } else {
    convolverSourceGainNode!.gain.value = 1
    convolverOutputGainNode!.gain.value = 0
  }
}

export const setConvolverMainGain = (gain: number) => {
  if (!convolverSourceGainNode || convolverSourceGainNode.gain.value == gain) return
  // console.log(gain)
  convolverSourceGainNode.gain.value = gain
}

export const setConvolverSendGain = (gain: number) => {
  if (!convolverSourceGainNode || convolverOutputGainNode!.gain.value == gain) return
  // console.log(gain)
  convolverOutputGainNode!.gain.value = gain
}

export const MAX_SPEED = 101
let pannerInfo = {
  x: 0,
  y: 0,
  z: 0,
  soundR: 0.5,
  rad: 0,
  speed: 1,
  intv: null as number | null,
}
const setPannerXYZ = (nx: number, ny: number, nz: number) => {
  pannerInfo.x = nx
  pannerInfo.y = ny
  pannerInfo.z = nz
  // console.log(pannerInfo)
  panner!.positionX.value = nx * pannerInfo.soundR
  panner!.positionY.value = ny * pannerInfo.soundR
  panner!.positionZ.value = nz * pannerInfo.soundR
}
export const setPannerSoundR = (r: number) => {
  pannerInfo.soundR = r
}

export const setPannerSpeed = (speed: number) => {
  pannerInfo.speed = MAX_SPEED - speed
  if (pannerInfo.speed < 1) pannerInfo.speed = 1
  if (pannerInfo.intv != null) startPanner()
}
export const stopPanner = () => {
  if (pannerInfo.intv) {
    clearInterval(pannerInfo.intv)
    pannerInfo.intv = null
    pannerInfo.rad = 0
  }
  panner!.positionX.value = 0
  panner!.positionY.value = 0
  panner!.positionZ.value = 0
}

export const startPanner = () => {
  initAdvancedAudioFeatures()
  if (pannerInfo.intv) {
    clearInterval(pannerInfo.intv)
    pannerInfo.intv = null
    pannerInfo.rad = 0
  }
  pannerInfo.intv = setInterval(() => {
    pannerInfo.rad += 1
    if (pannerInfo.rad > 360) pannerInfo.rad -= 360
    setPannerXYZ(
      Math.sin((pannerInfo.rad * Math.PI) / 180),
      Math.cos((pannerInfo.rad * Math.PI) / 180),
      Math.cos((pannerInfo.rad * Math.PI) / 180)
    )
  }, pannerInfo.speed)
}

let isConnected = true
const connectNode = () => {
  if (isConnected) return
  console.log('connect Node')
  analyser?.connect(biquads!.get(`hz${freqs[0]}`)!)
  isConnected = true
  if (pitchShifterNodeTempValue == 1 && pitchShifterNodeLoadStatus == 'connected') {
    disconnectPitchShifterNode()
  }
}
const disconnectNode = () => {
  if (!isConnected) return
  console.log('disconnect Node')
  analyser?.disconnect()
  isConnected = false
  if (pitchShifterNodeTempValue == 1 && pitchShifterNodeLoadStatus == 'connected') {
    disconnectPitchShifterNode()
  }
}
const connectPitchShifterNode = () => {
  console.log('connect Pitch Shifter Node')
  audio!.addEventListener('playing', connectNode)
  audio!.addEventListener('pause', disconnectNode)
  audio!.addEventListener('waiting', disconnectNode)
  audio!.addEventListener('emptied', disconnectNode)
  if (audio!.paused) disconnectNode()

  const lastBiquadFilter = biquads!.get(`hz${freqs.at(-1)!}`)!
  lastBiquadFilter.disconnect()
  lastBiquadFilter.connect(pitchShifterNode!)

  pitchShifterNode!.connect(convolver!)
  pitchShifterNode!.connect(convolverSourceGainNode!)
  // convolverDynamicsCompressor.disconnect(panner)
  // convolverDynamicsCompressor.connect(pitchShifterNode)
  // pitchShifterNode.connect(panner)
  pitchShifterNodeLoadStatus = 'connected'
  pitchShifterNodePitchFactor!.value = pitchShifterNodeTempValue
}
const disconnectPitchShifterNode = () => {
  console.log('disconnect Pitch Shifter Node')
  const lastBiquadFilter = biquads!.get(`hz${freqs.at(-1)!}`)!
  lastBiquadFilter.disconnect()
  lastBiquadFilter.connect(convolver!)
  lastBiquadFilter.connect(convolverSourceGainNode!)
  pitchShifterNodeLoadStatus = 'unconnect'

  audio!.removeEventListener('playing', connectNode)
  audio!.removeEventListener('pause', disconnectNode)
  audio!.removeEventListener('waiting', disconnectNode)
  audio!.removeEventListener('emptied', disconnectNode)
  connectNode()
}
const loadPitchShifterNode = () => {
  pitchShifterNodeLoadStatus = 'loading'
  initAdvancedAudioFeatures()
  // source -> analyser -> biquadFilter -> audioWorklet(pitch shifter) -> [(convolver & convolverSource)->convolverDynamicsCompressor] -> panner -> gain
  void import('./pitch-shifter/phase-vocoder?worker&url').then(({ default: url }) => {
    void audioContext!.audioWorklet?.addModule(url).then(() => {
      console.log('pitch shifter audio worklet loaded')
      // https://github.com/olvb/phaze/issues/26#issuecomment-1574629971
      pitchShifterNode = new AudioWorkletNode(audioContext!, 'phase-vocoder-processor', { outputChannelCount: [2] })
      let pitchFactorParam = pitchShifterNode.parameters.get('pitchFactor')
      if (!pitchFactorParam) return
      pitchShifterNodePitchFactor = pitchFactorParam
      pitchShifterNodeLoadStatus = 'unconnect'
      if (pitchShifterNodeTempValue == 1) return

      connectPitchShifterNode()
    })
  })
}

export const setPitchShifter = (val: number) => {
  // console.log('setPitchShifter', val)
  pitchShifterNodeTempValue = val
  switch (pitchShifterNodeLoadStatus) {
    case 'loading':
      break
    case 'none':
      loadPitchShifterNode()
      break
    case 'connected':
      // a: 1 = 半音
      // value = 2 ** (a / 12)
      pitchShifterNodePitchFactor!.value = val
      break
    case 'unconnect':
      connectPitchShifterNode()
      break
  }
}

export const hasInitedAdvancedAudioFeatures = (): boolean => audioContext != null

export const setResource = (src: string) => {
  if (!audio) return
  audio.src = src
}

export const setPlay = () => {
  void audio?.play()
}

export const setPause = () => {
  audio?.pause()
}

export const setStop = () => {
  if (audio) {
    audio.src = ''
    audio.removeAttribute('src')
  }
}

export const isEmpty = (): boolean => !audio?.src

export const setLoopPlay = (isLoop: boolean) => {
  if (audio) audio.loop = isLoop
}

export const getPlaybackRate = (): number => {
  return audio?.defaultPlaybackRate ?? 1
}

export const setPlaybackRate = (rate: number) => {
  if (!audio) return
  audio.defaultPlaybackRate = rate
  audio.playbackRate = rate
}

export const setPreservesPitch = (preservesPitch: boolean) => {
  if (!audio) return
  audio.preservesPitch = preservesPitch
}

export const getMute = (): boolean => {
  return audio?.muted ?? false
}

export const setMute = (isMute: boolean) => {
  if (audio) audio.muted = isMute
}

export const getCurrentTime = () => {
  return audio?.currentTime ?? 0
}

export const setCurrentTime = (time: number) => {
  if (audio) audio.currentTime = time
}

export const setMediaDeviceId = async (mediaDeviceId: string) => {
  return audio ? audio.setSinkId(mediaDeviceId) : Promise.resolve()
}

export const setVolume = (volume: number) => {
  if (audio) audio.volume = volume
}

export const getDuration = () => {
  return audio?.duration ?? 0
}

// export const getPlaybackRate = () => {
//   return audio?.playbackRate ?? 1
// }

type Noop = () => void

export const onPlaying = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('playing', callback)
  return () => {
    audio?.removeEventListener('playing', callback)
  }
}

export const onPause = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio?.addEventListener('pause', callback)
  return () => {
    audio?.removeEventListener('pause', callback)
  }
}

export const onEnded = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('ended', callback)
  return () => {
    audio?.removeEventListener('ended', callback)
  }
}

export const onError = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('error', callback)
  return () => {
    audio?.removeEventListener('error', callback)
  }
}

export const onLoadeddata = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('loadeddata', callback)
  return () => {
    audio?.removeEventListener('loadeddata', callback)
  }
}

export const onLoadstart = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('loadstart', callback)
  return () => {
    audio?.removeEventListener('loadstart', callback)
  }
}

export const onCanplay = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('canplay', callback)
  return () => {
    audio?.removeEventListener('canplay', callback)
  }
}

export const onEmptied = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('emptied', callback)
  return () => {
    audio?.removeEventListener('emptied', callback)
  }
}

export const onTimeupdate = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('timeupdate', callback)
  return () => {
    audio?.removeEventListener('timeupdate', callback)
  }
}

// 缓冲中
export const onWaiting = (callback: Noop) => {
  if (!audio) throw new Error('audio not defined')

  audio.addEventListener('waiting', callback)
  return () => {
    audio?.removeEventListener('waiting', callback)
  }
}

export const getErrorCode = () => {
  if (audio?.error) console.error(audio?.error)
  return audio?.error?.code
}
