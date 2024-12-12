'use client'

import { useState, useEffect, useRef } from 'react'
import { Inter } from 'next/font/google'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

interface Song {
  id: number
  title: string
  artist: string
  duration: string
  file: string
}

export default function EnhancedPlaylistInterface() {
  const [songs, setSongs] = useState<Song[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Fetch songs from the API route
    fetch('/api/songs')
      .then(response => response.json())
      .then(data => setSongs(data))
  }, [])

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.file
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentSong, isPlaying])

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const playSong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
    setCurrentTime(0)
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const nextSong = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id)
      const nextIndex = (currentIndex + 1) % songs.length
      setCurrentSong(songs[nextIndex])
      setCurrentTime(0)
    }
  }

  const prevSong = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id)
      const prevIndex = (currentIndex - 1 + songs.length) % songs.length
      setCurrentSong(songs[prevIndex])
      setCurrentTime(0)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const updateTime = () => setCurrentTime(Math.floor(audio.currentTime))
      audio.addEventListener('timeupdate', updateTime)
      return () => audio.removeEventListener('timeupdate', updateTime)
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 10px;
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: #333;
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: #333 #000;
        }
      `}</style>
      
      <div className={`min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 ${inter.className}`}>
        <div className="w-full max-w-2xl rounded-lg overflow-hidden border border-zinc-800 bg-black flex flex-col" style={{ height: '80vh' }}>
          {/* Window chrome */}
          <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="bg-zinc-800 px-6 py-1 rounded-md text-sm text-zinc-400 min-w-[120px] text-center">
              gg99.vercel.app
            </div>
            <div className="w-[52px]"></div>
          </div>
          
          <div className="flex-grow flex flex-col overflow-hidden">
            <div className="p-4">
              <Input
                type="text"
                placeholder="Search songs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-800 text-white border-zinc-700"
              />
            </div>
            <div className="flex-grow overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-zinc-800">
                    <TableHead className="bg-black sticky top-0 z-10 w-16 text-zinc-400 py-1 text-xs font-medium">#</TableHead>
                    <TableHead className="bg-black sticky top-0 z-10 text-zinc-400 py-1 text-xs font-medium">Title</TableHead>
                    <TableHead className="bg-black sticky top-0 z-10 text-zinc-400 py-1 text-xs font-medium">Artist</TableHead>
                    <TableHead className="bg-black sticky top-0 z-10 text-zinc-400 py-1 text-xs font-medium">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSongs.map((song) => (
                    <TableRow 
                      key={song.id} 
                      className={`hover:bg-zinc-900 border-b border-zinc-900 cursor-pointer ${currentSong?.id === song.id ? 'bg-zinc-800' : ''}`}
                      onClick={() => playSong(song)}
                    >
                      <TableCell className="text-zinc-400 py-1.5">{song.id}</TableCell>
                      <TableCell className="text-white py-1.5">{song.title}</TableCell>
                      <TableCell className="text-zinc-400 py-1.5">{song.artist}</TableCell>
                      <TableCell className="text-zinc-400 py-1.5">{song.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="bg-zinc-900 p-3 border-t border-zinc-800">
            <div className="flex justify-between items-center mb-2">
              <div className="text-white">{currentSong ? `${currentSong.title} - ${currentSong.artist}` : 'No song selected'}</div>
              <div className="text-zinc-400">
                {currentSong ? 
                  `${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')} / ${currentSong.duration}` 
                  : '0:00 / 0:00'}
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => {}}>
                <Shuffle className="h-4 w-4 text-zinc-400" />
              </Button>
              <Button variant="ghost" size="icon" onClick={prevSong}>
                <SkipBack className="h-4 w-4 text-zinc-400" />
              </Button>
              <Button variant="ghost" size="icon" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 text-white" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={nextSong}>
                <SkipForward className="h-4 w-4 text-zinc-400" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => {}}>
                <Repeat className="h-4 w-4 text-zinc-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <audio ref={audioRef} onEnded={nextSong} />
    </>
  )
}

