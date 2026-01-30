import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Checkbox,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Typography,
    InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { listEmployees, EmployeeWithId } from "../../firebase/employees";
import { DepartmentWithId, getDepartmentById, listDepartments, saveDepartmentAndSyncEmployees } from "../../firebase/department";
import { AppTextField } from "../../components/form/AppTextField";
import { AppSelectField } from "../../components/form/AppSelectField";

type FormState = {
    name: string;
    managerId: string;
    employeeIds: string[];
};

const DepartmentFormPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const departmentId = params.id as string | undefined;
    const isEdit = Boolean(departmentId);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [employees, setEmployees] = useState<EmployeeWithId[]>([]);
    const [queryEmployees, setQueryEmployees] = useState("");

    const [departments, setDepartments] = useState<DepartmentWithId[]>([]);

    const departmentsById = useMemo(() => {
        const map = new Map<string, DepartmentWithId>();
        for (const d of departments) map.set(d.id, d);
        return map;
    }, [departments]);

    function getDepartmentName(departmentId?: string) {
        if (!departmentId) return "Sem departamento";
        return departmentsById.get(departmentId)?.name ?? "Sem departamento";
    }

    const [form, setForm] = useState<FormState>({
        name: "",
        managerId: "",
        employeeIds: [],
    });

    const managerCandidates = useMemo(() => {
        return employees.filter((e) => e.level === "Gestor");
    }, [employees]);

    const filteredEmployees = useMemo(() => {
        const q = queryEmployees.trim().toLowerCase();
        if (!q) return employees;

        return employees.filter((e) => {
            const name = (e.name ?? "").toLowerCase();
            const email = (e.email ?? "").toLowerCase();

            const deptId = (e.departmentId ?? "").toLowerCase();
            const deptName = (departmentsById.get(e.departmentId ?? "")?.name ?? "").toLowerCase();

            return (
                name.includes(q) ||
                email.includes(q) ||
                deptName.includes(q) ||
                deptId.includes(q)
            );
        });
    }, [employees, queryEmployees, departmentsById]);

    function toggleEmployee(id: string) {
        setForm((prev) => {
            const exists = prev.employeeIds.includes(id);
            const nextIds = exists ? prev.employeeIds.filter((x) => x !== id) : [...prev.employeeIds, id];
            return { ...prev, employeeIds: nextIds };
        });
    }

    function setManager(id: string) {
        setForm((prev) => ({ ...prev, managerId: id }));
    }

    useEffect(() => {
        (async () => {
            try {
                const [empData, deptData, deptList] = await Promise.all([
                    listEmployees(),
                    departmentId ? getDepartmentById(departmentId) : Promise.resolve(null),
                    listDepartments(),
                ]);

                setEmployees(empData);
                setDepartments(deptList);

                if (deptData) {
                    const validEmployeeIds = new Set(empData.map((e) => e.id));

                    const cleaned = Array.from(
                        new Set((deptData.employeeIds ?? []).filter((id) => validEmployeeIds.has(id)))
                    )

                    setForm({
                        name: deptData.name ?? "",
                        managerId: deptData.managerId ?? "",
                        employeeIds: cleaned,
                    });
                } else {
                    setForm({
                        name: "",
                        managerId: "",
                        employeeIds: [],
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [departmentId]);

    async function handleSave() {
        const name = form.name.trim();
        if (!name) return;
        if (!form.managerId) return;

        setSaving(true);
        try {
            await saveDepartmentAndSyncEmployees({
                departmentId,
                name,
                managerId: form.managerId,
                employeeIds: form.employeeIds,
            });

            navigate("/departments");
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <Box sx={{ fontFamily: "Inter, sans-serif" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                        sx={{
                            fontSize: 18,
                            color: "#111827",
                            cursor: "pointer",
                        }}
                        onClick={() => navigate("/departments")}
                    >
                        Departamentos
                    </Typography>

                    <Typography sx={{ color: "#CBD5E1" }}>•</Typography>

                    <Typography sx={{ fontSize: 18, color: "#94A3B8" }}>
                        {isEdit ? "Editar Departamento" : "Novo Departamento"}
                    </Typography>
                </Box>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    bgcolor: "#F9FAFB",
                    borderRadius: 3,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.025)",
                    border: "1px solid #EEF2F7",
                    p: 3,
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 4,
                    }}
                >
                    <Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#374151", mb: 1 }}>
                                Nome do departamento
                            </Typography>
                            <AppTextField
                                placeholder="Ex: Tecnologia, Financeiro, RH"
                                value={form.name}
                                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                height={54}
                            />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#374151", mb: 1 }}>
                                Gestor
                            </Typography>

                            {loading ? (
                                <Skeleton variant="rounded" height={54} />
                            ) : (
                                <AppSelectField
                                    value={form.managerId}
                                    onChange={(value) => setManager(value)}
                                    placeholder="Selecione um gestor"
                                    height={54}
                                    options={managerCandidates.map((emp) => ({
                                        value: emp.id,
                                        label: `${emp.name} - ${emp.email}`,
                                    }))}
                                />
                            )}
                        </Box>
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#374151", mb: 1 }}>
                            Colaboradores
                        </Typography>

                        <TextField
                            fullWidth
                            placeholder="Buscar colaborador por nome, e-mail ou departamento atual"
                            value={queryEmployees}
                            onChange={(e) => setQueryEmployees(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: "#9CA3AF" }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                    height: 54,
                                    borderRadius: 2,
                                    bgcolor: "#FFFFFF",
                                },
                            }}
                        />

                        <Box
                            sx={{
                                bgcolor: "#FFFFFF",
                                borderRadius: 3,
                                border: "1px solid #E5E7EB",
                                overflow: "hidden",
                                height: "100%",
                                maxHeight: 220,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Box
                                sx={{
                                    px: 2,
                                    py: 1.75,
                                    bgcolor: "#F3F4F6",
                                    borderBottom: "1px solid #E5E7EB",
                                }}
                            >
                                <Typography sx={{ fontWeight: 700, color: "#6B7280" }}>
                                    {form.employeeIds.length === 0
                                        ? "Colaboradores"
                                        : `${form.employeeIds.length} ${form.employeeIds.length === 1 ? "colaborador" : "colaboradores"
                                        }`}
                                </Typography>
                            </Box>

                            <Box sx={{ flex: 1, overflowY: "auto" }}>
                                {loading ? (
                                    <Box sx={{ p: 2 }}>
                                        {Array.from({ length: 6 }).map((_, idx) => (
                                            <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.25 }}>
                                                <Skeleton variant="rounded" width={18} height={18} />
                                                <Skeleton variant="text" width={240} height={26} />
                                            </Box>
                                        ))}
                                    </Box>
                                ) : filteredEmployees.length === 0 ? (
                                    <Box sx={{ p: 2 }}>
                                        <Typography sx={{ color: "#6B7280", fontWeight: 600 }}>
                                            Nenhum colaborador encontrado.
                                        </Typography>
                                    </Box>
                                ) : (
                                    filteredEmployees.map((emp) => {
                                        const checked = form.employeeIds.includes(emp.id);

                                        return (
                                            <Box
                                                key={emp.id}
                                                onClick={() => toggleEmployee(emp.id)}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 2,
                                                    px: 2,
                                                    py: 1.5,
                                                    borderTop: "1px solid #F3F4F6",
                                                    cursor: "pointer",
                                                    "&:hover": { bgcolor: "#F9FAFB" },
                                                }}
                                            >
                                                <Checkbox checked={checked} />

                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{ fontWeight: 700, color: "#111827", lineHeight: 1.25 }}>
                                                        {emp.name}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            color: "#6B7280",
                                                            fontWeight: 600,
                                                            fontSize: 13,
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                    >
                                                        {emp.email} • Atual: {getDepartmentName(emp.departmentId)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        );
                                    })
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
            <Box
                sx={{
                    mt: 4,
                    pt: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Button
                    variant="text"
                    onClick={() => navigate("/departments")}
                    sx={{
                        color: "#111827",
                        fontWeight: 700,
                        fontSize: 18,
                        textTransform: "none",
                    }}
                >
                    Voltar
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving || loading || !form.name.trim() || !form.managerId}
                    sx={{
                        bgcolor: "#22C55E",
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: 18,
                        px: 4.5,
                        py: 2.25,
                        borderRadius: 2,
                        textTransform: "none",
                        boxShadow: "0 10px 30px rgba(34,197,94,0.35)",
                        "&:hover": { bgcolor: "#16A34A" },
                    }}
                >
                    Salvar
                </Button>
            </Box>
        </Box>
    );
};

export default DepartmentFormPage;