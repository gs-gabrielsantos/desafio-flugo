import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Chip,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";

import { listEmployees, EmployeeWithId } from "../../firebase/employees";

import avatar1 from "../../assets/avatars/avatar1.png";
import avatar2 from "../../assets/avatars/avatar2.png";
import avatar3 from "../../assets/avatars/avatar3.png";
import avatar4 from "../../assets/avatars/avatar4.png";
import avatar5 from "../../assets/avatars/avatar5.png";
import avatar6 from "../../assets/avatars/avatar6.png";
import avatar7 from "../../assets/avatars/avatar7.png";

const avatars = [
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
];


const SortLabel = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
            <span>{children}</span>
            <ArrowDownIcon sx={{ fontSize: 20, color: "#6B7280" }} />
        </Box>
    );
};

const StatusPill = ({ status }: { status: "Ativo" | "Inativo" }) => {
    const isActive = status === "Ativo";

    return (
        <Chip
            label={status}
            sx={{
                fontWeight: 700,
                borderRadius: 2,
                bgcolor: isActive ? "#DCFCE7" : "#FEE2E2",
                color: isActive ? "#16A34A" : "#DC2626",
                "& .MuiChip-label": {
                    px: 1,
                },
            }}
        />
    );
};


const EmployeesPage = () => {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState<EmployeeWithId[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await listEmployees();
                setEmployees(data);
            } catch (err) {
                console.error(err);
                setEmployees([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <Box sx={{ fontFamily: "Inter, sans-serif" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 5,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 33,
                        fontWeight: 600,
                        color: "#111827",
                    }}
                >
                    Colaboradores
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => navigate("/employees/new")}
                    sx={{
                        bgcolor: "#22C55E",
                        color: "#FFFFFF",
                        fontWeight: 650,
                        fontSize: 16,
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                        "&:hover": {
                            bgcolor: "#16A34A",
                        },
                    }}
                >
                    Novo Colaborador
                </Button>
            </Box>

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    bgcolor: "#F9FAFB",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.025)",
                    border: "1px solid #EEF2F7",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#F3F4F6" }}>
                            <TableCell
                                sx={{
                                    py: 2.25,
                                    px: 1.5,
                                    color: "#6B7280",
                                    fontWeight: 550,
                                    fontSize: 16,
                                    borderBottom: "none",
                                }}
                            >
                                <SortLabel>Nome</SortLabel>
                            </TableCell>

                            <TableCell
                                sx={{
                                    py: 2.25,
                                    px: 3.5,
                                    color: "#6B7280",
                                    fontWeight: 550,
                                    fontSize: 16,
                                    borderBottom: "none",
                                }}
                            >
                                <SortLabel>Email</SortLabel>
                            </TableCell>

                            <TableCell
                                sx={{
                                    py: 2.25,
                                    px: 3.5,
                                    color: "#6B7280",
                                    fontWeight: 550,
                                    fontSize: 16,
                                    borderBottom: "none",
                                }}
                            >
                                <SortLabel>Departamento</SortLabel>
                            </TableCell>

                            <TableCell
                                align="right"
                                sx={{
                                    py: 2.25,
                                    px: 3.5,
                                    color: "#6B7280",
                                    fontWeight: 550,
                                    fontSize: 16,
                                    borderBottom: "none",
                                }}
                            >
                                <SortLabel>Status</SortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            Array.from({ length: 4 }).map((_, idx) => (
                                <TableRow key={idx} sx={{ bgcolor: "#FFFFFF" }}>
                                    <TableCell sx={{ px: 3.5, py: 2.5, borderTop: "1px solid #E5E7EB" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Skeleton variant="circular" width={44} height={44} />
                                            <Skeleton variant="text" width={180} height={28} />
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ px: 3.5, py: 2.5, borderTop: "1px solid #E5E7EB" }}>
                                        <Skeleton variant="text" width={240} height={28} />
                                    </TableCell>

                                    <TableCell sx={{ px: 3.5, py: 2.5, borderTop: "1px solid #E5E7EB" }}>
                                        <Skeleton variant="text" width={140} height={28} />
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                        sx={{ px: 3.5, py: 2.5, borderTop: "1px solid #E5E7EB" }}
                                    >
                                        <Skeleton variant="rounded" width={70} height={30} sx={{ ml: "auto" }} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : employees.length === 0 ? (
                            <TableRow sx={{ bgcolor: "#FFFFFF" }}>
                                <TableCell
                                    colSpan={4}
                                    sx={{
                                        px: 3.5,
                                        py: 3,
                                        borderTop: "1px solid #E5E7EB",
                                        color: "#6B7280",
                                        fontWeight: 600,
                                    }}
                                >
                                    Nenhum colaborador cadastrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            employees.slice().reverse().map((emp, index) => (
                                <TableRow key={emp.id} sx={{ bgcolor: "#FFFFFF" }}>
                                    <TableCell
                                        sx={{
                                            px: 1.5,
                                            py: 2.75,
                                            borderTop: "1px solid #E5E7EB",
                                            color: "#111827",
                                            fontWeight: 500,
                                            fontSize: 16,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={avatars[index % avatars.length]}
                                                alt="Avatar"
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                    display: "block",
                                                }}
                                            />

                                            <Box
                                                sx={{
                                                    maxWidth: 280,
                                                    whiteSpace: "normal",
                                                    wordBreak: "break-word",
                                                    lineHeight: 1.4,
                                                }}
                                            >
                                                {emp.name}
                                            </Box>
                                        </Box>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            px: 3.5,
                                            py: 2.75,
                                            borderTop: "1px solid #E5E7EB",
                                            color: "#111827",
                                            fontSize: 16,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                maxWidth: 360,
                                                whiteSpace: "normal",
                                                wordBreak: "break-word",
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {emp.email}
                                        </Box>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            px: 3.5,
                                            py: 2.75,
                                            borderTop: "1px solid #E5E7EB",
                                            color: "#111827",
                                            fontSize: 16,
                                        }}
                                    >
                                        {emp.department}
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                        sx={{
                                            px: 3.5,
                                            py: 2.75,
                                            borderTop: "1px solid #E5E7EB",
                                        }}
                                    >
                                        <StatusPill status={emp.status} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default EmployeesPage;
