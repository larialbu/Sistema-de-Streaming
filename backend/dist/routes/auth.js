"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("../server");
const router = express_1.default.Router();
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Email e senha são obrigatórios",
            });
        }
        const { data, error } = await server_1.supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            throw error;
        }
        const response = {
            success: true,
            data: {
                user: data.user,
                session: data.session,
            },
            message: "Usuário registrado com sucesso",
        };
        return res.status(201).json(response);
    }
    catch (error) {
        console.error("Erro ao registrar usuário:", error);
        return res.status(400).json({
            success: false,
            error: "Erro ao registrar usuário",
            message: error.message,
        });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Email e senha são obrigatórios",
            });
        }
        const { data, error } = await server_1.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw error;
        }
        const response = {
            success: true,
            data: {
                user: data.user,
                session: data.session,
            },
            message: "Login realizado com sucesso",
        };
        return res.json(response);
    }
    catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(401).json({
            success: false,
            error: "Credenciais inválidas",
            message: error.message,
        });
    }
});
router.post("/logout", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (token) {
            await server_1.supabase.auth.signOut();
        }
        const response = {
            success: true,
            message: "Logout realizado com sucesso",
        };
        return res.json(response);
    }
    catch (error) {
        console.error("Erro ao fazer logout:", error);
        return res.status(500).json({
            success: false,
            error: "Erro ao fazer logout",
            message: error.message,
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map