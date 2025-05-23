export interface Track {
  id: string
  title: string
  artist: string
  duration: number // in seconds
  albumCover: string
}

export interface Playlist {
  id: string
  name: string
  userId: string
  tracks: Track[]
}

// Mock data for tracks
export const mockTracks: Track[] = [
  {
    id: "1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    duration: 354,
    albumCover: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "2",
    title: "Imagine",
    artist: "John Lennon",
    duration: 183,
    albumCover: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "3",
    title: "Billie Jean",
    artist: "Michael Jackson",
    duration: 294,
    albumCover: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "4",
    title: "Like a Rolling Stone",
    artist: "Bob Dylan",
    duration: 372,
    albumCover: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "5",
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    duration: 301,
    albumCover: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "6",
    title: "Yesterday",
    artist: "The Beatles",
    duration: 125,
    albumCover: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "7",
    title: "Respect",
    artist: "Aretha Franklin",
    duration: 147,
    albumCover: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "8",
    title: "Like a Prayer",
    artist: "Madonna",
    duration: 340,
    albumCover: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "9",
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    duration: 356,
    albumCover: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "10",
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    duration: 482,
    albumCover: "/placeholder.svg?height=80&width=80",
  },
]

// Mock data for playlists
export const mockPlaylists: Playlist[] = [
  {
    id: "1",
    name: "Rock Clássico",
    userId: "user-1",
    tracks: [mockTracks[0], mockTracks[3], mockTracks[8], mockTracks[9]],
  },
  {
    id: "2",
    name: "Pop Hits",
    userId: "user-1",
    tracks: [mockTracks[1], mockTracks[2], mockTracks[6], mockTracks[7]],
  },
]

// Helper function to format duration
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}
