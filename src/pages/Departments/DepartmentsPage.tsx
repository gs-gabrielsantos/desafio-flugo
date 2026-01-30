import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Checkbox,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Pagination,
    InputAdornment,
    Alert,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { deleteDepartmentAndClearEmployees, DepartmentWithId, listDepartments } from "../../firebase/department";
import { EmployeeWithId, listEmployees } from "../../firebase/employees";
import { AppDeleteDialog } from "../../components/dialog/AppDeleteDialog";

const SortLabel = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
            <span>{children}</span>
            <ArrowDownIcon sx={{ fontSize: 20, color: "#6B7280" }} />
        </Box>
    );
};

function safeLower(v: unknown) {
    return (typeof v === "string" ? v : "").toLowerCase();
}

const DepartmentsPage = () => {
    const navigate = useNavigate();

    const [departments, setDepartments] = useState<DepartmentWithId[]>([]);
    const [employees, setEmployees] = useState<EmployeeWithId[]>([]);
    const [countsByDeptId, setCountsByDeptId] = useState<Record<string, number>>({});

    const [loading, setLoading] = useState(true);

    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [openMassDelete, setOpenMassDelete] = useState(false);
    const [openSingleDelete, setOpenSingleDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const [deleteError, setDeleteError] = useState<string | null>(null);

    const menuOpen = Boolean(menuAnchor);

    const deleteDepartmentName = useMemo(() => {
        if (!deleteId) return "";
        return departments.find((d) => d.id === deleteId)?.name ?? "";
    }, [deleteId, departments]);

    function openRowMenu(e: React.MouseEvent<HTMLElement>, id: string) {
        setMenuAnchor(e.currentTarget);
        setSelectedDepartmentId(id);
    }

    function closeRowMenu() {
        setMenuAnchor(null);
        setSelectedDepartmentId(null);
    }

    function handleEdit() {
        if (!selectedDepartmentId) return;
        closeRowMenu();
        navigate(`/departments/${selectedDepartmentId}/edit`);
    }

    async function handleDelete() {
        if (!selectedDepartmentId) return;

        const deptId = selectedDepartmentId;
        closeRowMenu();

        const count = countsByDeptId[deptId] ?? 0;

        if (count > 0) {
            setDeleteError("Transfira os colaboradores de departamento antes de realizar a exclusão");
            return;
        }

        setDeleteError(null);
        setDeleteId(deptId);
        setOpenSingleDelete(true);
    }

    function toggleSelect(id: string) {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    }

    function isSelected(id: string) {
        return selectedIds.includes(id);
    }

    function clearSelection() {
        setSelectedIds([]);
    }

    async function confirmSingleDelete() {
        if (!deleteId) return;

        const count = countsByDeptId[deleteId] ?? 0;

        if (count > 0) {
            setDeleteError("Transfira os colaboradores de departamento antes de realizar a exclusão");
            setOpenSingleDelete(false);
            setDeleteId(null);
            return;
        }

        await deleteDepartmentAndClearEmployees(deleteId);

        setDepartments((prev) => prev.filter((d) => d.id !== deleteId));
        setCountsByDeptId((prev) => {
            const copy = { ...prev };
            delete copy[deleteId];
            return copy;
        });

        setOpenSingleDelete(false);
        setDeleteId(null);
    }

    async function confirmMassDelete() {
        await Promise.all(selectedIds.map((id) => deleteDepartmentAndClearEmployees(id)));

        setDepartments((prev) => prev.filter((d) => !selectedIds.includes(d.id)));
        setCountsByDeptId((prev) => {
            const copy = { ...prev };
            for (const id of selectedIds) delete copy[id];
            return copy;
        });

        clearSelection();
        setOpenMassDelete(false);
    }

    function getManagerName(managerId: string) {
        return employees.find((e) => e.id === managerId)?.name || "-";
    }

    function buildCountsByDeptId(empList: EmployeeWithId[]) {
        const map: Record<string, number> = {};
        for (const emp of empList) {
            const deptId = emp.departmentId;
            if (!deptId) continue;
            map[deptId] = (map[deptId] ?? 0) + 1;
        }
        return map;
    }

    useEffect(() => {
        (async () => {
            try {
                const [deptData, empData] = await Promise.all([listDepartments(), listEmployees()]);
                setDepartments(deptData);
                setEmployees(empData);

                setCountsByDeptId(buildCountsByDeptId(empData));
            } catch (err) {
                console.error(err);
                setDepartments([]);
                setEmployees([]);
                setCountsByDeptId({});
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [query]);

    useEffect(() => {
        if (!deleteError) return;

        const timer = setTimeout(() => {
            setDeleteError(null);
        }, 5000);

        return () => clearTimeout(timer);
    }, [deleteError]);

    const base = useMemo(() => departments.slice().reverse(), [departments]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return base;

        return base.filter((dept) => {
            const name = safeLower(dept.name);
            const count = String(countsByDeptId[dept.id] ?? 0);
            return name.includes(q) || count.includes(q);
        });
    }, [base, query, countsByDeptId]);

    const perPage = 3;
    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const start = (page - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);

    const pageIds = paginated.map((d) => d.id);
    const selectedOnPage = pageIds.filter((id) => selectedIds.includes(id));

    return (
        <Box sx={{ fontFamily: "Inter, sans-serif" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 5 }}>
                <Typography sx={{ fontSize: 33, fontWeight: 600, color: "#111827" }}>
                    Departamentos
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => navigate("/departments/new")}
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
                        "&:hover": { bgcolor: "#16A34A" },
                    }}
                >
                    Novo Departamento
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
                        placeholder="Pesquisar por nome do departamento"
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
                            const blocked = selectedIds.filter((id) => (countsByDeptId[id] ?? 0) > 0);

                            if (blocked.length > 0) {
                                setDeleteError("Transfira os colaboradores de departamento antes de realizar a exclusão");
                                return;
                            }

                            setDeleteError(null);
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
            {deleteError && (
                <Alert sx={{ mb: 2 }} severity="warning" onClose={() => setDeleteError(null)}>
                    {deleteError}
                </Alert>
            )}
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
                                                const idsToAdd = paginated.map((d) => d.id);
                                                return Array.from(new Set([...prev, ...idsToAdd]));
                                            });
                                        } else {
                                            setSelectedIds((prev) => {
                                                const idsToRemove = new Set(paginated.map((d) => d.id));
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
                                    width: "33.33%",
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
                                    width: "33.33%",
                                }}
                            >
                                <SortLabel>Gestor</SortLabel>
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
                                    width: "33.33%",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <SortLabel>Colaboradores</SortLabel>
                            </TableCell>

                            <TableCell align="right" sx={{ py: 2.25, px: 2, borderBottom: "none", width: 56 }} />
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            Array.from({ length: 4 }).map((_, idx) => (
                                <TableRow key={idx} sx={{ bgcolor: "#FFFFFF" }}>
                                    <TableCell padding="checkbox" sx={{ py: 2.5, borderTop: "1px solid #E5E7EB" }}>
                                        <Skeleton variant="rounded" width={18} height={18} />
                                    </TableCell>

                                    <TableCell sx={{ px: 1.5, py: 2.5, borderTop: "1px solid #E5E7EB" }}>
                                        <Skeleton variant="text" width={220} height={28} />
                                    </TableCell>

                                    <TableCell sx={{ px: 3.5, py: 2.5, borderTop: "1px solid #E5E7EB" }}>
                                        <Skeleton variant="text" width={120} height={28} />
                                    </TableCell>

                                    <TableCell align="right" sx={{ px: 3.5, py: 2.5, borderTop: "1px solid #E5E7EB" }}>
                                        <Skeleton variant="text" width={60} height={28} sx={{ ml: "auto" }} />
                                    </TableCell>

                                    <TableCell align="right" sx={{ px: 2, py: 2.5, borderTop: "1px solid #E5E7EB" }}>
                                        <Skeleton variant="circular" width={36} height={36} sx={{ ml: "auto" }} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : departments.length === 0 ? (
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
                                    Nenhum departamento cadastrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginated.map((dept) => (
                                <TableRow key={dept.id} sx={{ bgcolor: "#FFFFFF" }}>
                                    <TableCell padding="checkbox" sx={{ borderTop: "1px solid #E5E7EB", verticalAlign: "middle" }}>
                                        <Checkbox checked={isSelected(dept.id)} onChange={() => toggleSelect(dept.id)} />
                                    </TableCell>

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
                                        <Box sx={{ maxWidth: 420, whiteSpace: "normal", wordBreak: "break-word", lineHeight: 1.4 }}>
                                            {dept.name}
                                        </Box>
                                    </TableCell>

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
                                        {getManagerName(dept.managerId)}
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                        sx={{
                                            px: 4,
                                            py: 2.75,
                                            borderTop: "1px solid #E5E7EB",
                                            color: "#111827",
                                            fontSize: 16,
                                            verticalAlign: "middle",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {countsByDeptId[dept.id] ?? 0}
                                    </TableCell>

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
                                        <IconButton onClick={(e) => openRowMenu(e, dept.id)} sx={{ width: 36, height: 36, color: "#9CA3AF" }}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}

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
                            <MenuItem onClick={handleEdit} sx={{ py: 1.25, px: 2, gap: 1.5, fontSize: 14, fontWeight: 600 }}>
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
                    <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} shape="rounded" />
                </Box>

                <AppDeleteDialog
                    open={openSingleDelete}
                    onClose={() => setOpenSingleDelete(false)}
                    onConfirm={confirmSingleDelete}
                    type="department"
                    count={1}
                    itemName={deleteDepartmentName}
                />

                <AppDeleteDialog
                    open={openMassDelete}
                    onClose={() => setOpenMassDelete(false)}
                    onConfirm={confirmMassDelete}
                    type="department"
                    count={selectedIds.length}
                />
            </TableContainer>
        </Box>
    );
};

export default DepartmentsPage;