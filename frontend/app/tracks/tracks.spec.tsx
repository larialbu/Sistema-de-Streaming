import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import TracksPage from "@/app/tracks/page"
import * as trackService from "@/service/tracks"
import * as playlistService from "@/service/playlist"

jest.mock("@/service/tracks")
jest.mock("@/service/playlist")

const mockTracks = [
    {
        id: "1",
        title: "Shake It Off",
        artist: "Taylor Swift",
        duration: 242,
        album_cover: "/taylor.jpg",
        created_at: "2024-01-01",
    },
    {
        id: "2",
        title: "Bad Blood",
        artist: "Taylor Swift",
        duration: 200,
        album_cover: "",
        created_at: "2024-01-01",
    },
]

const mockPlaylists = [
    {
        id: "10",
        name: "Favorites",
        user_id: "user-1",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
    },
]

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        "node_modules/(?!(jose)/)"
    ],
}


describe("TracksPage", () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it("deve exibir faixas após o carregamento", async () => {
        (trackService.fetchTracks as jest.Mock).mockResolvedValue(mockTracks)

        render(<TracksPage />)

        expect(screen.queryByText("Carregando faixas...")).not.toBeNull()

        await waitFor(() => {
            expect(screen.queryByText("Shake It Off")).not.toBeNull()
            expect(screen.queryByText("Bad Blood")).not.toBeNull()
        })
    })

    it("deve filtrar faixas com base na pesquisa", async () => {
        (trackService.fetchTracks as jest.Mock).mockResolvedValue(mockTracks)

        render(<TracksPage />)

        await waitFor(() => {
            expect(screen.queryByText("Shake It Off")).not.toBeNull()
        })

        fireEvent.change(screen.getByPlaceholderText(/buscar/i), {
            target: { value: "bad" },
        })

        expect(screen.queryByText("Shake It Off")).toBeNull()
        expect(screen.queryByText("Bad Blood")).not.toBeNull()
    })

    it("deve abrir o modal ao clicar no botão de adicionar", async () => {
        (trackService.fetchTracks as jest.Mock).mockResolvedValue(mockTracks)
            (playlistService.fetchPlaylists as jest.Mock).mockResolvedValue(mockPlaylists)

        render(<TracksPage />)

        await waitFor(() => {
            expect(screen.queryByText("Shake It Off")).not.toBeNull()
        })

        const addButton = screen.getAllByTitle("Adicionar à playlist")[0]
        fireEvent.click(addButton)

        await waitFor(() => {
            expect(screen.queryByText("Selecione a playlist")).not.toBeNull()
            expect(screen.queryByText("Favorites")).not.toBeNull()
        })
    })

    it("deve adicionar uma faixa à playlist", async () => {
        (trackService.fetchTracks as jest.Mock).mockResolvedValue(mockTracks)
            (playlistService.fetchPlaylists as jest.Mock).mockResolvedValue(mockPlaylists)
        const addTrackSpy = jest
            .spyOn(playlistService, "addTrackToPlaylist")
            .mockResolvedValue(undefined)

        window.alert = jest.fn()

        render(<TracksPage />)

        await waitFor(() => {
            expect(screen.queryByText("Shake It Off")).not.toBeNull()
        })

        fireEvent.click(screen.getAllByTitle("Adicionar à playlist")[0])

        await waitFor(() => {
            expect(screen.queryByText("Favorites")).not.toBeNull()
        })

        fireEvent.click(screen.getByText("Favorites"))
        fireEvent.click(screen.getByText("Adicionar"))

        await waitFor(() => {
            expect(addTrackSpy).toHaveBeenCalledWith("10", "1")
            expect(window.alert).toHaveBeenCalledWith(
                "Música adicionada à playlist com sucesso"
            )
        })
    })
})
