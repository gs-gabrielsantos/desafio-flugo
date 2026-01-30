import { Box, Paper, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFoundPage = () => {

    return (
        <Box sx={{ fontFamily: "Inter, sans-serif", px: { xs: 2, md: 0 } }}>
            <Paper
                elevation={0}
                sx={{
                    bgcolor: "#F9FAFB",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.025)",
                    border: "1px solid #EEF2F7",
                    p: { xs: 3, md: 5 },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 3,
                        flexWrap: "wrap",
                    }}
                >
                    <Box sx={{ maxWidth: 640 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                            <ErrorOutlineIcon sx={{ fontSize: 26, color: "#6B7280" }} />
                            <Typography sx={{ fontSize: 14, fontWeight: 800, color: "#6B7280" }}>
                                Erro 404
                            </Typography>
                        </Box>

                        <Typography sx={{ mt: 1.5, fontSize: 36, fontWeight: 900, color: "#111827", lineHeight: 1.1 }}>
                            Página não encontrada
                        </Typography>

                        <Typography sx={{ mt: 1.25, color: "#6B7280", fontWeight: 600, fontSize: 16, lineHeight: 1.5 }}>
                            O endereço que você tentou acessar não existe ou foi movido.
                        </Typography>


                    </Box>

                    {/* “Card” decorativo à direita */}
                    <Box
                        sx={{
                            width: { xs: "100%", md: 280 },
                            p: 2.5,
                            borderRadius: 3,
                            border: "1px solid #E5E7EB",
                            bgcolor: "#FFFFFF",
                        }}
                    >
                        <Typography sx={{ fontWeight: 900, color: "#111827", fontSize: 14 }}>
                            Dicas rápidas
                        </Typography>

                        <Box sx={{ mt: 1.25 }}>
                            <Typography sx={{ color: "#6B7280", fontWeight: 600, fontSize: 13, lineHeight: 1.5 }}>
                                • Verifique se o link digitado está correto.
                            </Typography>
                            <Typography sx={{ color: "#6B7280", fontWeight: 600, fontSize: 13, lineHeight: 1.5, mt: 0.75 }}>
                                • Use o menu lateral para navegar.
                            </Typography>
                            <Typography sx={{ color: "#6B7280", fontWeight: 600, fontSize: 13, lineHeight: 1.5, mt: 0.75 }}>
                                • Se o problema persistir, contate o administrador do sistema.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default NotFoundPage;