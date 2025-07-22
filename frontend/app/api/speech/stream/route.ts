import speech from '@google-cloud/speech'
import { NextRequest, NextResponse } from 'next/server'

const client = new speech.SpeechClient()

// 전역 스트림 관리
interface StreamData {
  stream: ReturnType<typeof client.streamingRecognize>
  lastResult: {
    transcript: string
    isFinal: boolean
    timestamp: number
  } | null
  audioBuffer: Buffer[]
}

const activeStreams = new Map<string, StreamData>()

export async function POST(request: NextRequest) {
  try {
    const { action, sessionId, audioData } = await request.json()

    if (action === 'start') {
      return startRecognition(sessionId)
    } else if (action === 'audio') {
      return processAudio(sessionId, audioData)
    } else if (action === 'stop') {
      return stopRecognition(sessionId)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

function startRecognition(sessionId: string) {
  const config = {
    encoding: 'WEBM_OPUS' as const,
    sampleRateHertz: 48000,
    languageCode: 'ko-KR',
    enableAutomaticPunctuation: true,
    model: 'latest_long',
  }

  const request = {
    config,
    interimResults: true,
  }

  const recognizeStream = client
    .streamingRecognize(request)
    .on('error', (err) => {
      console.error('Speech API Error:', err)
      activeStreams.delete(sessionId)
    })
    .on('data', (data) => {
      // 스트림 데이터를 저장하여 클라이언트가 polling으로 가져갈 수 있도록 함
      const streamData = activeStreams.get(sessionId)
      if (streamData) {
        streamData.lastResult = {
          transcript: data.results[0]?.alternatives[0]?.transcript || '',
          isFinal: data.results[0]?.isFinal || false,
          timestamp: Date.now()
        }
      }
    })

  activeStreams.set(sessionId, {
    stream: recognizeStream,
    lastResult: null,
    audioBuffer: []
  })

  return NextResponse.json({ status: 'started', sessionId })
}

function processAudio(sessionId: string, audioData: string) {
  const streamData = activeStreams.get(sessionId)
  if (!streamData || !streamData.stream) {
    return NextResponse.json({ error: 'No active stream' }, { status: 400 })
  }

  try {
    const audioBuffer = Buffer.from(audioData, 'base64')
    streamData.stream.write(audioBuffer)
    
    // 최신 결과 반환
    const result = streamData.lastResult
    streamData.lastResult = null // 읽은 후 초기화
    
    return NextResponse.json({ 
      status: 'processing',
      result: result
    })
  } catch (error) {
    console.error('Audio processing error:', error)
    return NextResponse.json({ error: 'Audio processing failed' }, { status: 500 })
  }
}

function stopRecognition(sessionId: string) {
  const streamData = activeStreams.get(sessionId)
  if (streamData && streamData.stream) {
    streamData.stream.end()
    activeStreams.delete(sessionId)
  }

  return NextResponse.json({ status: 'stopped' })
}

// GET 요청으로 최신 결과 polling
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }

  const streamData = activeStreams.get(sessionId)
  if (!streamData) {
    return NextResponse.json({ error: 'No active stream' }, { status: 404 })
  }

  const result = streamData.lastResult
  streamData.lastResult = null // 읽은 후 초기화

  return NextResponse.json({ 
    result: result
  })
} 