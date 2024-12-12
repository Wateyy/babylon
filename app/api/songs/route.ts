import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Define a type for the song info
type SongInfo = {
  [key: string]: { artist: string; duration: string }
}

// This is a mock database of song information
const songInfo: SongInfo = {
  'Quantum Mechanics.mp3': { artist: 'Ludwig', duration: '3:00' },
}

export async function GET() {
  const musicDir = path.join(process.cwd(), 'public', 'music')
  const files = fs.readdirSync(musicDir)
  
  const songs = files
    .filter(file => file.endsWith('.mp3'))
    .map((file, index) => {
      const info = songInfo[file] || { artist: 'Unknown Artist', duration: '0:00' }
      return {
        id: index + 1,
        title: file.replace('.mp3', '').replace(/_/g, ' '),
        artist: info.artist,
        duration: info.duration,
        file: `/music/${file}`
      }
    })

  return NextResponse.json(songs)
}

