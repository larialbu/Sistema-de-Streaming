"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const server_1 = require("../server");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Token de acesso requerido" });
        }
        const { data: { user }, error, } = await server_1.supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(403).json({ error: "Token inválido" });
        }
        req.user = {
            id: user.id,
            email: user.email,
        };
        return next();
    }
    catch (error) {
        console.error("Erro na autenticação:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map