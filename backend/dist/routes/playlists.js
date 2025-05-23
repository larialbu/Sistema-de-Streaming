"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("../server");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { data: playlists, error } = await server_1.supabase
            .from("playlists")
            .select(`
        *,
        playlist_tracks (
          track_id,
          added_at,
          tracks (*)
        )
      `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
        if (error) {
            throw error;
        }
        const response = {
            success: true,
            data: playlists || [],
        };
        return res.json(response);
    }
    catch (error) {
        console.error("Erro ao buscar playlists:", error);
        return res.status(500).json({
            success: false,
            error: "Erro ao buscar playlists",
            message: error.message,
        });
    }
});
router.post("/", auth_1.authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;
        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: "Nome da playlist é obrigatório",
            });
        }
        const { data: playlist, error } = await server_1.supabase
            .from("playlists")
            .insert([
            {
                name: name.trim(),
                user_id: userId,
            },
        ])
            .select()
            .single();
        if (error) {
            throw error;
        }
        const response = {
            success: true,
            data: playlist,
            message: "Playlist criada com sucesso",
        };
        return res.status(201).json(response);
    }
    catch (error) {
        console.error("Erro ao criar playlist:", error);
        return res.status(500).json({
            success: false,
            error: "Erro ao criar playlist",
            message: error.message,
        });
    }
});
router.post("/:id/tracks", auth_1.authenticateToken, async (req, res) => {
    try {
        const { id: playlistId } = req.params;
        const { track_id } = req.body;
        const userId = req.user.id;
        if (!track_id) {
            return res.status(400).json({
                success: false,
                error: "ID da faixa é obrigatório",
            });
        }
        const { data: playlist, error: playlistError } = await server_1.supabase
            .from("playlists")
            .select("id")
            .eq("id", playlistId)
            .eq("user_id", userId)
            .single();
        if (playlistError || !playlist) {
            return res.status(404).json({
                success: false,
                error: "Playlist não encontrada",
            });
        }
        const { data: track, error: trackError } = await server_1.supabase
            .from("tracks")
            .select("id")
            .eq("id", track_id)
            .single();
        if (trackError || !track) {
            return res.status(404).json({
                success: false,
                error: "Faixa não encontrada",
            });
        }
        const { data: playlistTrack, error } = await server_1.supabase
            .from("playlist_tracks")
            .insert([
            {
                playlist_id: playlistId,
                track_id: track_id,
            },
        ])
            .select()
            .single();
        if (error) {
            if (error.code === "23505") {
                return res.status(409).json({
                    success: false,
                    error: "Faixa já está na playlist",
                });
            }
            throw error;
        }
        const response = {
            success: true,
            data: playlistTrack,
            message: "Faixa adicionada à playlist com sucesso",
        };
        return res.status(201).json(response);
    }
    catch (error) {
        console.error("Erro ao adicionar faixa à playlist:", error);
        return res.status(500).json({
            success: false,
            error: "Erro ao adicionar faixa à playlist",
            message: error.message,
        });
    }
});
router.delete("/:id/tracks/:trackId", auth_1.authenticateToken, async (req, res) => {
    try {
        const { id: playlistId, trackId } = req.params;
        const userId = req.user.id;
        const { data: playlist, error: playlistError } = await server_1.supabase
            .from("playlists")
            .select("id")
            .eq("id", playlistId)
            .eq("user_id", userId)
            .single();
        if (playlistError || !playlist) {
            return res.status(404).json({
                success: false,
                error: "Playlist não encontrada",
            });
        }
        const { error } = await server_1.supabase
            .from("playlist_tracks")
            .delete()
            .eq("playlist_id", playlistId)
            .eq("track_id", trackId);
        if (error) {
            throw error;
        }
        const response = {
            success: true,
            message: "Faixa removida da playlist com sucesso",
        };
        return res.json(response);
    }
    catch (error) {
        console.error("Erro ao remover faixa da playlist:", error);
        return res.status(500).json({
            success: false,
            error: "Erro ao remover faixa da playlist",
            message: error.message,
        });
    }
});
router.delete("/:id", auth_1.authenticateToken, async (req, res) => {
    try {
        const { id: playlistId } = req.params;
        const userId = req.user.id;
        const { error } = await server_1.supabase
            .from("playlists")
            .delete()
            .eq("id", playlistId)
            .eq("user_id", userId);
        if (error) {
            throw error;
        }
        const response = {
            success: true,
            message: "Playlist deletada com sucesso",
        };
        return res.json(response);
    }
    catch (error) {
        console.error("Erro ao deletar playlist:", error);
        return res.status(500).json({
            success: false,
            error: "Erro ao deletar playlist",
            message: error.message,
        });
    }
});
exports.default = router;
//# sourceMappingURL=playlists.js.map