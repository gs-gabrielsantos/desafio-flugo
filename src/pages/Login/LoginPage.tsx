import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import flugoLogo from "../../assets/flugo.png";

import {
    Alert,
    Box,
    Button,
    Divider,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const ADMIN_EMAIL = "";
const ADMIN_PASSWORD = "";

const LoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState(ADMIN_EMAIL);
    const [password, setPassword] = useState(ADMIN_PASSWORD);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const canSubmit = useMemo(() => {
        return email.trim().length > 0 && password.trim().length > 0 && !loading;
    }, [email, password, loading]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);

            await signInWithEmailAndPassword(
                auth,
                email.trim().toLowerCase(),
                password
            );

            navigate("/employees", { replace: true });
        } catch (err: any) {
            setError("Não foi possível autenticar. Verifique o Firebase Authentication.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#ffffff",
                display: "grid",
                placeItems: "center",
                px: 2,
                py: 4,
            }}
        ><Box
                component="img"
                src={flugoLogo}
                alt="Flugo"
                sx={{ height: 92, display: "block" }}
            />
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 980,
                    borderRadius: 5,
                    overflow: "hidden",
                    border: "1px solid #EEF2F7",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.06)",
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
                    bgcolor: "#FFFFFF",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        p: { xs: 3, md: 6 },
                        bgcolor: "#111827",
                        color: "#FFFFFF",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "radial-gradient(600px circle at 15% 10%, rgba(34,197,94,0.45), transparent 55%), radial-gradient(500px circle at 85% 85%, rgba(34,197,94,0.25), transparent 60%)",
                            pointerEvents: "none",
                        }}
                    />

                    <Box sx={{ position: "relative", zIndex: 1 }}>

                        <Typography sx={{ mt: 4, fontSize: 30, fontWeight: 900, lineHeight: 1.1 }}>
                            Painel Administrativo
                        </Typography>

                        <Typography sx={{ mt: 1.5, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
                            Acesse com sua conta de administrador para gerenciar colaboradores e departamentos.
                        </Typography>

                        <Box
                            sx={{
                                mt: 4,
                                p: 2.5,
                                borderRadius: 3,
                                border: "1px solid rgba(255,255,255,0.12)",
                                bgcolor: "rgba(255,255,255,0.06)",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            <Typography sx={{ fontWeight: 800 }}>
                                Bem-vindo 👋
                            </Typography>
                            <Typography sx={{ mt: 0.75, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                                Utilize suas credenciais de administrador para acessar o sistema.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ p: { xs: 3, md: 6 } }}>
                    <Typography sx={{ fontSize: 28, fontWeight: 900, color: "#ffffff" }}>
                        Entrar
                    </Typography>

                    <Typography sx={{ mt: 1, color: "#6B7280", fontWeight: 600 }}>
                        Informe seu e-mail e senha para continuar.
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    {error && (
                        <Alert sx={{ mb: 2 }} severity="error">
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={onSubmit}>
                        <TextField
                            fullWidth
                            label="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlinedIcon sx={{ color: "#9CA3AF" }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                    height: 56,
                                    borderRadius: 3,
                                    bgcolor: "#FFFFFF",
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Senha"
                            type={showPass ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon sx={{ color: "#9CA3AF" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPass((v) => !v)}
                                            edge="end"
                                            sx={{ color: "#9CA3AF" }}
                                        >
                                            {showPass ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    height: 56,
                                    borderRadius: 3,
                                    bgcolor: "#FFFFFF",
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={!canSubmit}
                            sx={{
                                mt: 3,
                                bgcolor: "#22C55E",
                                color: "#FFFFFF",
                                borderRadius: 3,
                                py: 1.6,
                                fontWeight: 900,
                                textTransform: "none",
                                boxShadow: "0 18px 40px rgba(34,197,94,0.25)",
                                "&:hover": { bgcolor: "#16A34A", color: "#FFFFFF" },
                                "&.Mui-disabled": {
                                    bgcolor: "#A7F3D0",
                                    color: "#FFFFFF",
                                },
                            }}
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>

                        <Typography
                            sx={{
                                mt: 2.5,
                                color: "#9CA3AF",
                                fontWeight: 600,
                                fontSize: 13,
                                textAlign: "center",
                            }}
                        >
                            Acesso restrito • Somente administradores
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;