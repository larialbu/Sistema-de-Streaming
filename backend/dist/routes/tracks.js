"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("../server");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    try {
        const { search, limit = 50, offset = 0 } = req.query;
        let query = server_1.supabase
            .from("tracks")
            .select("*")
            .range(Number(offset), Number(offset) + Number(limit) - 1);
        if (search) {
            query = query.or(`title.ilike.%${search}%,artist.ilike.%${search}%`);
        }
        const { data: tracks, error } = await query;
        if (error) {
            throw error;
        }
        const response = {
            success: true,
            data: tracks || [],
        };
        res.json(response);
    }
    catch (error) {
        console.error("Erro ao buscar faixas:", error);
        res.status(500).json({
            success: false,
            error: "Erro ao buscar faixas",
            message: error.message,
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { data: track, error } = await server_1.supabase.from("tracks").select("*").eq("id", id).single();
        if (error) {
            throw error;
        }
        if (!track) {
            return res.status(404).json({
                success: false,
                error: "Faixa não encontrada",
            });
        }
        const response = {
            success: true,
            data: track,
        };
        return res.json(response);
    }
    catch (error) {
        console.error("Erro ao buscar faixa:", error);
        return res.status(500).json({
            success: false,
            error: "Erro ao buscar faixa",
            message: error.message,
        });
    }
});
router.post("/", auth_1.authenticateToken, async (req, res) => {
    try {
        const { title, artist, duration, album_cover } = req.body;
        if (!title || !artist || !duration) {
            return res.status(400).json({
                success: false,
                error: "Título, artista e duração são obrigatórios",
            });
        }
        const { data: track, error } = await server_1.supabase
            .from("tracks")
            .insert([
            {
                title,
                artist,
                duration: Number(duration),
                album_cover,
            },
        ])
            .select()
            .single();
        if (error) {
            throw error;
        }
        const response = {
            success: true,
            data: track,
            message: "Faixa criada com sucesso",
        };
        return res.status(201).json(response);
    }
    catch (error) {
        console.error("Erro ao criar faixa:", error);
        return res.status(500).json({
            success: false,
            error: "Erro ao criar faixa",
            message: error.message,
        });
    }
});
exports.default = router;
//# sourceMappingURL=tracks.js.map