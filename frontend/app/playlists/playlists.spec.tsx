import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import * as playlistService from "@/service/playlist"
import { useToast } from "@/components/ui/use-toast"
import PlaylistsPage from "./page"

jest.mock("@/components/ui/use-toast", () => ({
    useToast: () => ({
        toast: jest.fn(),
    }),
}))

jest.mock("@/service/playlist", () => ({
    fetchPlaylists: jest.fn(),
    createPlaylist: jest.fn(),
    addTrackToPlaylist: jest.fn(),
    removeTrackFromPlaylist: jest.fn(),
}))

describe("PlaylistsPage", () => {
    const playlistsMock = [
        {
            id: "1",
            name: "Playlist 1",
            playlist_tracks: [
                { track_id: "t1", tracks: { id: "t1", title: "Track 1", artist: "Artist 1" } },
            ],
        },
        {
            id: "2",
            name: "Playlist 2",
            playlist_tracks: [],
        },
    ]

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("renders playlists fetched from API", async () => {
        (playlistService.fetchPlaylists as jest.Mock).mockResolvedValue(playlistsMock)

        render(<PlaylistsPage />)

        await waitFor(() => {
            expect(screen.getByText("Playlist 1")).toBeInTheDocument()
            expect(screen.getByText("Playlist 2")).toBeInTheDocument()
        })

        expect(screen.getByText("Track 1")).toBeInTheDocument()
        expect(screen.getByText("Artist 1")).toBeInTheDocument()
    })

    it("shows message when no playlists", async () => {
        (playlistService.fetchPlaylists as jest.Mock).mockResolvedValue([])

        render(<PlaylistsPage />)

        await waitFor(() => {
            expect(screen.getByText("Você ainda não tem playlists")).toBeInTheDocument()
        })
    })

    it("allows creating a new playlist", async () => {
        (playlistService.fetchPlaylists as jest.Mock).mockResolvedValue([])
            (playlistService.createPlaylist as jest.Mock).mockResolvedValue({
                id: "3",
                name: "Nova Playlist",
                playlist_tracks: [],
            })
        const toastMock = jest.fn()
            ; (useToast as jest.Mock).mockReturnValue({ toast: toastMock })

        render(<PlaylistsPage />)

        fireEvent.click(screen.getByText("Criar Playlist"))

        fireEvent.change(screen.getByPlaceholderText("Nome da playlist"), {
            target: { value: "Nova Playlist" },
        })

        fireEvent.click(screen.getByText("Criar"))

        await waitFor(() => {
            expect(playlistService.createPlaylist).toHaveBeenCalledWith("Nova Playlist")
            expect(toastMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Playlist criada",
                    description: expect.stringContaining("Nova Playlist"),
                }),
            )
        })
    })

    it("allows removing a track from playlist", async () => {
        (playlistService.fetchPlaylists as jest.Mock).mockResolvedValue(playlistsMock)
            (playlistService.removeTrackFromPlaylist as jest.Mock).mockResolvedValue(null)
        const toastMock = jest.fn()
            ; (useToast as jest.Mock).mockReturnValue({ toast: toastMock })

        render(<PlaylistsPage />)

        await waitFor(() => {
            expect(screen.getByText("Track 1")).toBeInTheDocument()
        })

        fireEvent.click(screen.getByLabelText("Remover faixa"))

        await waitFor(() => {
            expect(playlistService.removeTrackFromPlaylist).toHaveBeenCalledWith("1", "t1")
            expect(toastMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Faixa removida",
                }),
            )
        })
    })
})
