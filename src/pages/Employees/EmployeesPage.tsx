import { useEffect, useMemo, useState } from "react";
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
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
    TextField,
    Pagination,
    InputAdornment
} from "@mui/material";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import { listEmployees, EmployeeWithId, deleteEmployee } from "../../firebase/employees";

import avatar1 from "../../assets/avatars/avatar1.png";
import avatar2 from "../../assets/avatars/avatar2.png";
import avatar3 from "../../assets/avatars/avatar3.png";
import avatar4 from "../../assets/avatars/avatar4.png";
import avatar5 from "../../assets/avatars/avatar5.png";
import avatar6 from "../../assets/avatars/avatar6.png";
import avatar7 from "../../assets/avatars/avatar7.png";
import avatar8 from "../../assets/avatars/avatar8.png";
import avatar9 from "../../assets/avatars/avatar9.png";
import avatar10 from "../../assets/avatars/avatar10.png";
import avatar11 from "../../assets/avatars/avatar11.png";
import avatar12 from "../../assets/avatars/avatar12.png";


import { DepartmentWithId, listDepartments } from "../../firebase/department";
import { AppDeleteDialog } from "../../components/dialog/AppDeleteDialog";

const avatarMap: Record<string, string> = {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    avatar9,
    avatar10,
    avatar11,
    avatar12,
};


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

    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [openMassDelete, setOpenMassDelete] = useState(false);
    const [openSingleDelete, setOpenSingleDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const [departments, setDepartments] = useState<DepartmentWithId[]>([]);

    const menuOpen = Boolean(menuAnchor);

    const deleteEmployeeName = useMemo(() => {
        if (!deleteId) return "";
        return employees.find((e) => e.id === deleteId)?.name ?? "";
    }, [deleteId, employees]);

    function openRowMenu(e: React.MouseEvent<HTMLElement>, id: string) {
        setMenuAnchor(e.currentTarget);
        setSelectedEmployeeId(id);
    }

    function closeRowMenu() {
        setMenuAnchor(null);
        setSelectedEmployeeId(null);
    }

    function handleEdit() {
        if (!selectedEmployeeId) return;
        closeRowMenu();
        navigate(`/employees/${selectedEmployeeId}/edit`);
    }

    function handleDelete() {
        setDeleteId(selectedEmployeeId);
        setOpenSingleDelete(true);
        closeRowMenu();
    }

    function toggleSelect(id: string) {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    }

    async function confirmSingleDelete() {
        if (!deleteId) return;

        await deleteEmployee(deleteId);
        setEmployees((prev) => prev.filter((e) => e.id !== deleteId));
        setOpenSingleDelete(false);
        setDeleteId(null);
    }

    async function confirmMassDelete() {
        await Promise.all(
            selectedIds.map((id) => deleteEmployee(id))
        );

        setEmployees((prev) =>
            prev.filter((e) => !selectedIds.includes(e.id))
        );

        clearSelection();
        setOpenMassDelete(false);
    }


    function isSelected(id: string) {
        return selectedIds.includes(id);
    }

    function clearSelection() {
        setSelectedIds([]);
    }

    const base = employees.slice().reverse();

    const departmentsById = useMemo(() => {
        const map = new Map<string, string>();
        for (const d of departments) map.set(d.id, d.name);
        return map;
    }, [departments]);

    const filtered = base.filter((emp) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;

        const name = (emp.name ?? "").toLowerCase();
        const email = (emp.email ?? "").toLowerCase();
        const deptName = (departmentsById.get(emp.departmentId ?? "") ?? "").toLowerCase();

        return name.includes(q) || email.includes(q) || deptName.includes(q);
    });

    const perPage = 3;
    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const start = (page - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);
    const pageIds = paginated.map((e) => e.id);
    const selectedOnPage = pageIds.filter((id) => selectedIds.includes(id));

    useEffect(() => {
        (async () => {
            try {
                const [emps, depts] = await Promise.all([listEmployees(), listDepartments()]);
                setEmployees(emps);
                setDepartments(depts);
            } catch (err) {
                console.error(err);
                setEmployees([]);
                setDepartments([]);
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
            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Box sx={{ maxWidth: 520, flex: 1 }}>
                    <TextField
                        fullWidth
                        placeholder="Pesquisar por nome, e-mail ou departamento"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "#9CA3AF" }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                height: 54,
                                borderRadius: 2,
                                bgcolor: "#FFFFFF",
                            },
                        }}
                    />
                </Box>

                {selectedIds.length > 0 && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setOpenMassDelete(true);
                        }}
                        sx={{
                            height: 54,
                            px: 3,
                            borderRadius: 2,
                            fontWeight: 700,
                            textTransform: "none",
                            boxShadow: "0 10px 24px rgba(220,38,38,0.25)",
                            "&:hover": {
                                bgcolor: "#B91C1C",
                            },
                        }}
                        startIcon={<DeleteOutlineIcon />}
                    >
                        Excluir ({selectedIds.length})
                    </Button>
                )}
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
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={pageIds.length > 0 && selectedOnPage.length === pageIds.length}
                                    indeterminate={selectedOnPage.length > 0 && selectedOnPage.length < pageIds.length}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedIds((prev) => {
                                                const idsToAdd = paginated.map((e) => e.id);
                                                return Array.from(new Set([...prev, ...idsToAdd]));
                                            });
                                        } else {
                                            setSelectedIds((prev) => {
                                                const idsToRemove = new Set(paginated.map((e) => e.id));
                                                return prev.filter((id) => !idsToRemove.has(id));
                                            });
                                        }
                                    }}

                                />
                            </TableCell>
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
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <SortLabel>Status</SortLabel>
                            </TableCell>

                            {/* Ações */}
                            <TableCell
                                align="right"
                                sx={{
                                    py: 2.25,
                                    px: 2,
                                    borderBottom: "none",
                                    width: 56,
                                }}
                            />
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            Array.from({ length: 4 }).map((_, idx) => (
                                <TableRow key={idx} sx={{ bgcolor: "#FFFFFF" }}>
                                    <TableCell sx={{ px: 1.5, py: 2.5, borderTop: "1px solid #E5E7EB" }}>
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

                                    {/* Skeleton Ações */}
                                    <TableCell
                                        align="right"
                                        sx={{ px: 2, py: 2.5, borderTop: "1px solid #E5E7EB" }}
                                    >
                                        <Skeleton variant="circular" width={36} height={36} sx={{ ml: "auto" }} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : employees.length === 0 ? (
                            <TableRow sx={{ bgcolor: "#FFFFFF" }}>
                                <TableCell
                                    colSpan={5}
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
                            paginated
                                .map((emp, index) => (
                                    <TableRow key={emp.id} sx={{ bgcolor: "#FFFFFF" }}>
                                        {/* Checkbox */}
                                        <TableCell
                                            padding="checkbox"
                                            sx={{
                                                borderTop: "1px solid #E5E7EB",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            <Checkbox
                                                checked={isSelected(emp.id)}
                                                onChange={() => toggleSelect(emp.id)}
                                            />
                                        </TableCell>

                                        {/* Nome + Avatar */}
                                        <TableCell
                                            sx={{
                                                px: 1.5,
                                                py: 2.75,
                                                borderTop: "1px solid #E5E7EB",
                                                color: "#111827",
                                                fontWeight: 500,
                                                fontSize: 16,
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Box
                                                    component="img"
                                                    src={avatarMap[(emp as any).avatar] ?? avatar1}
                                                    alt="Avatar"
                                                    sx={{
                                                        width: 44,
                                                        height: 44,
                                                        borderRadius: "50%",
                                                        objectFit: "cover",
                                                        display: "block",
                                                        flexShrink: 0,
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

                                        {/* Email */}
                                        <TableCell
                                            sx={{
                                                px: 3.5,
                                                py: 2.75,
                                                borderTop: "1px solid #E5E7EB",
                                                color: "#111827",
                                                fontSize: 16,
                                                verticalAlign: "middle",
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

                                        {/* Departamento */}
                                        <TableCell
                                            sx={{
                                                px: 3.5,
                                                py: 2.75,
                                                borderTop: "1px solid #E5E7EB",
                                                color: "#111827",
                                                fontSize: 16,
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            {departmentsById.get(emp.departmentId ?? "") || "Sem departamento"}
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell
                                            align="right"
                                            sx={{
                                                px: 3.5,
                                                py: 2.75,
                                                borderTop: "1px solid #E5E7EB",
                                                whiteSpace: "nowrap",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                                                <StatusPill status={emp.status} />
                                            </Box>
                                        </TableCell>

                                        {/* Ações */}
                                        <TableCell
                                            align="right"
                                            sx={{
                                                px: 2,
                                                py: 2.75,
                                                borderTop: "1px solid #E5E7EB",
                                                whiteSpace: "nowrap",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            <IconButton
                                                onClick={(e) => openRowMenu(e, emp.id)}
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    color: "#9CA3AF",
                                                }}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}

                        {/* Menu global (uma vez só) */}
                        <Menu
                            anchorEl={menuAnchor}
                            open={menuOpen}
                            onClose={closeRowMenu}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            PaperProps={{
                                sx: {
                                    mt: 1,
                                    minWidth: 180,
                                    borderRadius: 2,
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                },
                            }}
                            MenuListProps={{ sx: { p: 0 } }}
                        >
                            <MenuItem
                                onClick={handleEdit}
                                sx={{
                                    py: 1.25,
                                    px: 2,
                                    gap: 1.5,
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 28 }}>
                                    <EditOutlinedIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                                </ListItemIcon>
                                <ListItemText primary="Editar" />
                            </MenuItem>

                            <MenuItem
                                onClick={handleDelete}
                                sx={{
                                    py: 1.25,
                                    px: 2,
                                    gap: 1.5,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "#DC2626",
                                    "&:hover": { bgcolor: "#FEE2E2" },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 28 }}>
                                    <DeleteOutlineIcon sx={{ fontSize: 18, color: "#DC2626" }} />
                                </ListItemIcon>
                                <ListItemText primary="Excluir" />
                            </MenuItem>
                        </Menu>
                    </TableBody>
                </Table>
                <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        shape="rounded"
                    />
                </Box>
                <AppDeleteDialog
                    open={openSingleDelete}
                    onClose={() => setOpenSingleDelete(false)}
                    onConfirm={confirmSingleDelete}
                    type="employee"
                    count={1}
                    itemName={deleteEmployeeName}
                />
                <AppDeleteDialog
                    open={openMassDelete}
                    onClose={() => setOpenMassDelete(false)}
                    onConfirm={confirmMassDelete}
                    type="employee"
                    count={selectedIds.length}
                />
            </TableContainer>
        </Box>
    );
};

export default EmployeesPage;
