"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_js_1 = require("@supabase/supabase-js");
const tracks_1 = __importDefault(require("./routes/tracks"));
const playlists_1 = __importDefault(require("./routes/playlists"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
exports.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use((0, morgan_1.default)("combined"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/auth", auth_1.default);
app.use("/api/tracks", tracks_1.default);
app.use("/api/playlists", playlists_1.default);
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Algo deu errado!",
        message: process.env.NODE_ENV === "development" ? err.message : "Erro interno do servidor",
    });
});
app.use("*", (req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Frontend: ${process.env.FRONTEND_URL || "http://localhost:3000/"}`);
    console.log(`🔗 API: http://localhost:${PORT}/`);
});
exports.default = app;
//# sourceMappingURL=server.js.map