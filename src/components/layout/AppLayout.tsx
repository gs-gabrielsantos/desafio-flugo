import { ReactNode, useMemo, useState } from "react";
import flugoLogo from "../../assets/flugo.png";
import userIcon from "../../assets/user.png";

import { Box, IconButton, Stack, Typography } from "@mui/material";

import avatar from "../../assets/avatars/avatar.png";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { Menu, MenuItem } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useLocation, useNavigate } from "react-router-dom";

import LogoutIcon from "@mui/icons-material/Logout";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";

type AppLayoutProps = {
    children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();
    const location = useLocation();

    const isEmployeesRoute = useMemo(() => {
        return location.pathname.startsWith("/employees");
    }, [location.pathname]);

    const isDepartmentsRoute = useMemo(() => {
        return location.pathname.startsWith("/departments");
    }, [location.pathname]);

    function navItemStyles(isActive: boolean) {
        return {
            cursor: "pointer",
            borderRadius: 2,
            px: "10px",
            py: "10px",
            transition: "all 150ms ease",
            bgcolor: isActive ? "#F3F4F6" : "transparent",
            "&:hover": { bgcolor: "#F9FAFB" },
            width: "100%",
        } as const;
    }

    function navTextStyles(isActive: boolean) {
        return {
            fontSize: 18,
            fontWeight: 600,
            color: isActive ? "#111827" : "#6B7280",
            fontFamily: "Inter, sans-serif",
            whiteSpace: "nowrap",
        } as const;
    }

    function navChevronStyles(isActive: boolean) {
        return {
            fontSize: 28,
            color: isActive ? "#111827" : "#9CA3AF",
            transition: "all 150ms ease",
            flexShrink: 0,
        } as const;
    }

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
                    width: 300,
                    px: "6px",
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
                            height: 32,
                            display: "block",
                        }}
                    />
                </Stack>

                <Box
                    sx={{
                        mt: "60px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        width: "100%",
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={navItemStyles(isEmployeesRoute)}
                        onClick={() => navigate("/employees")}
                    >
                        <Stack direction="row" alignItems="center" spacing="16px">
                            <Box
                                component="img"
                                src={userIcon}
                                alt="Usuário"
                                sx={{
                                    width: 25,
                                    height: 25,
                                    display: "block",
                                    opacity: isEmployeesRoute ? 1 : 0.85,
                                    flexShrink: 0,
                                }}
                            />
                            <Typography sx={navTextStyles(isEmployeesRoute)}>
                                Colaboradores
                            </Typography>
                        </Stack>

                        <ChevronRightIcon
                            sx={{
                                ...navChevronStyles(isEmployeesRoute),
                                ml: "auto",
                            }}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={navItemStyles(isDepartmentsRoute)}
                        onClick={() => navigate("/departments")}
                    >
                        <Stack direction="row" alignItems="center" spacing="16px">
                            <ApartmentOutlinedIcon
                                sx={{
                                    fontSize: 26,
                                    color: isDepartmentsRoute ? "#111827" : "#6B7280",
                                    flexShrink: 0,
                                }}
                            />

                            <Typography sx={navTextStyles(isDepartmentsRoute)}>
                                Departamentos
                            </Typography>
                        </Stack>

                        <ChevronRightIcon
                            sx={{
                                ...navChevronStyles(isDepartmentsRoute),
                                ml: "auto",
                            }}
                        />
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
                                        cursor: "pointer",
                                    }}
                                    onClick={(e) => setAnchorEl(e.currentTarget)}
                                />
                            </Box>

                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={() => setAnchorEl(null)}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                PaperProps={{
                                    sx: {
                                        mt: 1,
                                        minWidth: 140,
                                        borderRadius: 2,
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                    },
                                }}
                                MenuListProps={{
                                    sx: {
                                        p: 0,
                                    },
                                }}
                            >
                                <MenuItem
                                    onClick={async () => {
                                        await signOut(auth);
                                        setAnchorEl(null);
                                        navigate("/login");
                                    }}
                                    sx={{
                                        color: "#DC2626",
                                        fontWeight: 600,
                                        fontSize: 14,
                                        gap: 1.5,
                                        py: 1.25,
                                        px: 2,
                                        "&:hover": {
                                            bgcolor: "#FEE2E2",
                                        },
                                    }}
                                >
                                    <LogoutIcon sx={{ fontSize: 18 }} />
                                    Sair
                                </MenuItem>
                            </Menu>
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