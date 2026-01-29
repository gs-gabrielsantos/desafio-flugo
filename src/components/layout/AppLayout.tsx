import { ReactNode } from "react";
import flugoLogo from "../../assets/flugo.png";
import userIcon from "../../assets/user.png";

import {
    Box,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import avatar from "../../assets/avatars/avatar.png";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type AppLayoutProps = {
    children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                bgcolor: "#FFFFFF",
                display: "flex",
                flexDirection: "row",
            }}
        >
            <Box
                component="aside"
                sx={{
                    width: 280,
                    px: "28px",
                    pt: "40px",
                    pb: "24px",
                    pl: "44px",
                    bgcolor: "#FFFFFF",
                }}
            >
                <Stack direction="row" alignItems="center" spacing="14px">
                    <Box
                        component="img"
                        src={flugoLogo}
                        alt="Flugo"
                        sx={{
                            height: 36,
                            display: "block",
                        }}
                    />

                </Stack>

                <Box sx={{ mt: "60px" }}>
                    <Stack direction="row" alignItems="center" spacing="16px">
                        <Box
                            component="img"
                            src={userIcon}
                            alt="Usuário"
                            sx={{
                                width: 25,
                                height: 25,
                                display: "block",
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 18,
                                fontWeight: 600,
                                color: "#6B7280",
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            Colaboradores
                        </Typography>

                        <Box sx={{ flex: 1 }} />

                        <ChevronRightIcon sx={{ fontSize: 28, color: "#9CA3AF" }} />
                    </Stack>
                </Box>
            </Box>

            <Box sx={{ width: 24, position: "relative" }}>
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: "12px",
                        width: "1px",
                        backgroundImage:
                            "repeating-linear-gradient(to bottom, #E5E7EB 0px, #E5E7EB 3px, transparent 3px, transparent 7px)",
                    }}
                />
            </Box>


            <Box component="main" sx={{ flex: 1, bgcolor: "#FFFFFF" }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        pt: "32px",
                        pr: "54px",
                    }}
                >
                    <IconButton
                        disableRipple
                        sx={{
                            p: 0,
                            "&:hover": { bgcolor: "transparent" },
                        }}
                        aria-label="Usuário"
                    >
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                backgroundColor: "#E5E7EB",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    backgroundColor: "#FFFFFF",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={avatar}
                                    alt="Avatar"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        display: "block",
                                    }}
                                />
                            </Box>
                        </Box>

                    </IconButton>
                </Box>

                <Box
                    sx={{
                        pl: "32px",
                        pr: "54px",
                        pt: "24px",
                        pb: "56px",
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default AppLayout;
