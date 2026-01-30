import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    LinearProgress,
    Switch,
    Typography,
} from "@mui/material";

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

import { doesEmployeeEmailExist, EmployeeStatus, EmployeeWithId, getEmployeeById, listEmployees, saveEmployeeAndSyncDepartments } from "../../firebase/employees";
import CheckIcon from "@mui/icons-material/Check";
import { DepartmentWithId, listDepartments } from "../../firebase/department";
import { AppTextField } from "../../components/form/AppTextField";
import { AppSelectField } from "../../components/form/AppSelectField";

type Step = 1 | 2;

type HierarchyLevel = "Junior" | "Pleno" | "Senior" | "Gestor";

const avatarMap = {
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

type FormState = {
    name: string;
    email: string;
    activeOnCreate: boolean;
    avatar: string;
    departmentId: string;

    role: string;
    admissionDate: string;
    level: HierarchyLevel;
    managerId: string;
    baseSalary: string;
};

const green = "#22C55E";
const greenDark = "#16A34A";
const text = "#111827";
const muted = "#94A3B8";
const border = "#E5E7EB";

const StepCircle = ({
    variant,
    value,
}: {
    variant: "active" | "done" | "inactive";
    value: number | "icon";
}) => {
    return (
        <Box
            sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                bgcolor: variant === "done" || variant === "active" ? "#22C55E" : "#E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
            }}
        >
            {value === "icon" ? (
                <CheckIcon sx={{ fontSize: 26 }} />
            ) : (
                value
            )}
        </Box>
    );
};

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const EmployeeForm = () => {

    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>(1);
    const [submitting, setSubmitting] = useState(false);
    const [managers, setManagers] = useState<EmployeeWithId[]>([]);

    const [departments, setDepartments] = useState<DepartmentWithId[]>([]);

    const [openAvatar, setOpenAvatar] = useState(false);

    const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);

    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        activeOnCreate: true,
        avatar: "avatar1",
        departmentId: "",

        role: "",
        admissionDate: "",
        level: "Junior",
        managerId: "",
        baseSalary: "",
    });

    const [touched, setTouched] = useState({
        name: false,
        email: false,
        department: false,
    });

    const [touched2, setTouched2] = useState({
        role: false,
        admissionDate: false,
        level: false,
        managerId: false,
        baseSalary: false,
    });

    const progress = useMemo(() => (step === 1 ? 0 : 50), [step]);

    const nameError = touched.name && form.name.trim() === "";
    const departmentError = touched.department && form.departmentId.trim() === "";

    const roleError = touched2.role && form.role.trim() === "";
    const admissionDateError = touched2.admissionDate && !form.admissionDate;
    const levelError = touched2.level && !form.level;
    const baseSalaryError = touched2.baseSalary && form.baseSalary.trim() === "";


    const canGoNextStep1 =
        form.name.trim() !== "" &&
        form.email.trim() !== "" &&
        isValidEmail(form.email);

    async function onNext() {
        if (step === 1) {
            setTouched((p) => ({ ...p, name: true, email: true }));

            if (!canGoNextStep1) return;

            const emailValue = form.email.trim().toLowerCase();
            const exists = await doesEmployeeEmailExist({
                email: emailValue,
                ignoreEmployeeId: id,
            });

            setEmailAlreadyExists(exists);

            if (exists) return;

            setStep(2);
            return;
        }

        setTouched((p) => ({ ...p, department: true }));
        setTouched2((p) => ({
            ...p,
            role: true,
            admissionDate: true,
            level: true,
            managerId: true,
            baseSalary: true,
        }));

        const salaryNumber = Number(form.baseSalary.replace(/\./g, "").replace(",", "."));

        const hasErrors =
            form.departmentId.trim() === "" ||
            form.role.trim() === "" ||
            !form.admissionDate ||
            !form.level ||
            form.managerId.trim() === "" ||
            form.baseSalary.trim() === "" ||
            Number.isNaN(salaryNumber) ||
            salaryNumber <= 0;

        if (hasErrors) return;

        try {
            setSubmitting(true);

            const status: EmployeeStatus = form.activeOnCreate ? "Ativo" : "Inativo";

            const payload = {
                name: form.name.trim(),
                email: form.email.trim(),
                departmentId: form.departmentId,
                avatar: form.avatar,
                status,
                role: form.role.trim(),
                admissionDate: form.admissionDate,
                level: form.level,
                managerId: form.managerId,
                baseSalary: salaryNumber,
            };

            await saveEmployeeAndSyncDepartments({
                employeeId: id,
                payload,
            });

            navigate("/employees");
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    async function validateEmailUniqueness(value: string) {
        const emailValue = value.trim().toLowerCase();

        setEmailAlreadyExists(false);

        if (!emailValue || !isValidEmail(emailValue)) return;

        try {
            setCheckingEmail(true);
            const exists = await doesEmployeeEmailExist({
                email: emailValue,
                ignoreEmployeeId: id,
            });
            setEmailAlreadyExists(exists);
        } finally {
            setCheckingEmail(false);
        }
    }

    function formatSalaryBR(input: string) {
        const digits = input.replace(/\D/g, "");
        if (!digits) return "";

        const value = Number(digits) / 100;

        return value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }
    const emailFormatError =
        touched.email &&
        (form.email.trim() === "" || !isValidEmail(form.email.trim()));

    function onBack() {
        if (step === 1) return;
        setStep(1);
    }

    useEffect(() => {
        (async () => {
            try {
                const [allEmployees, allDepartments] = await Promise.all([
                    listEmployees(),
                    listDepartments(),
                ]);

                setManagers(allEmployees.filter((e) => e.level === "Gestor"));
                setDepartments(allDepartments);
            } catch (e) {
                setManagers([]);
                setDepartments([]);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (!id) return;

            try {
                const emp = await getEmployeeById(id);
                if (!emp) return;

                setForm({
                    name: emp.name ?? "",
                    email: emp.email ?? "",
                    activeOnCreate: emp.status === "Ativo",
                    departmentId: emp.departmentId ?? "",
                    avatar: emp.avatar ?? "",
                    role: emp.role ?? "",
                    admissionDate: emp.admissionDate ?? "",
                    level: (emp.level ?? "Junior") as HierarchyLevel,
                    managerId: emp.managerId ?? "",
                    baseSalary:
                        emp.baseSalary != null
                            ? Number(emp.baseSalary).toFixed(2).replace(".", ",")
                            : "",
                });
            } catch (e) {
                console.error(e);
            }
        })();
    }, [id]);


    return (
        <Box sx={{ fontFamily: "Inter, sans-serif", color: text }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                    sx={{
                        fontSize: 18,
                        color: text,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate("/")}
                >
                    Colaboradores
                </Typography>

                <Typography sx={{ color: "#CBD5E1" }}>•</Typography>

                <Typography sx={{ fontSize: 18, color: muted }}>
                    {isEdit ? "Editar Colaborador" : "Cadastrar Colaborador"}
                </Typography>
            </Box>

            <Box
                sx={{
                    mt: 2.25,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        flex: 1,
                        height: 6,
                        borderRadius: 999,
                        bgcolor: "#D1FAE5",
                        "& .MuiLinearProgress-bar": {
                            bgcolor: green,
                            borderRadius: 999,
                        },
                    }}
                />

                <Typography
                    sx={{
                        fontSize: 16,
                        color: muted,
                        fontWeight: 500,
                        minWidth: 48,
                        textAlign: "right",
                    }}
                >
                    {progress}%
                </Typography>
            </Box>

            <Box
                sx={{
                    mt: 3.5,
                    display: "grid",
                    gridTemplateColumns: "260px 1fr",
                    gap: 5,
                    alignItems: "start",
                }}
            >
                <Box sx={{ pt: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {step === 1 ? (
                            <StepCircle variant="active" value={1} />
                        ) : (
                            <StepCircle variant="done" value="icon" />
                        )}

                        <Typography sx={{ fontSize: 18, fontWeight: 700, color: text }}>
                            Infos Básicas
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            ml: "16px",
                            mt: "16px",
                            mb: "16px",
                            height: step === 1 ? "150px" : "54px",
                            borderLeft: `2px solid ${border}`,
                        }}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <StepCircle
                            variant={step === 2 ? "active" : "inactive"}
                            value={2}
                        />

                        <Typography
                            sx={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: step === 2 ? text : muted,
                            }}
                        >
                            Infos Profissionais
                        </Typography>
                    </Box>
                </Box>

                <Box>
                    {step === 1 ? (
                        <>
                            <Typography
                                sx={{
                                    m: 0,
                                    fontSize: 32,
                                    fontWeight: 700,
                                    color: "#6B7280",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Informações Básicas
                            </Typography>

                            <Box sx={{ mt: 4, maxWidth: 980 }}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#374151", mb: 1 }}>
                                        Avatar
                                    </Typography>

                                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                        <Box
                                            sx={{
                                                width: 72,
                                                height: 72,
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                                border: "2px solid #E5E7EB",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <img
                                                src={avatarMap[form.avatar as keyof typeof avatarMap]}
                                                alt="avatar"
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                onClick={() => setOpenAvatar(true)}
                                            />
                                        </Box>

                                        <Box onClick={() => setOpenAvatar(true)} sx={{ cursor: "pointer" }}>
                                            <Typography sx={{ color: "#6B7280", fontWeight: 600 }}>
                                                Clique para escolher
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <AppTextField
                                    label="Nome"
                                    placeholder="Ex: João da Silva"
                                    value={form.name}
                                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                    onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                                    error={nameError}
                                    helperText={nameError ? "Nome é obrigatório" : " "}
                                    borderColor="#22C55E"
                                    hoverBorderColor="#16A34A"
                                    focusBorderColor="#22C55E"
                                    borderWidth={2}
                                    InputLabelProps={{ sx: { color: "#A7F3D0" } }}
                                    sx={{ mb: 1.5 }}
                                />

                                <AppTextField
                                    label="E-mail"
                                    placeholder="Ex: john@gmail.com"
                                    value={form.email}
                                    onChange={(e) => {
                                        const next = e.target.value;
                                        setForm((p) => ({ ...p, email: next }));
                                        setEmailAlreadyExists(false);
                                    }}
                                    onBlur={async () => {
                                        setTouched((p) => ({ ...p, email: true }));
                                        await validateEmailUniqueness(form.email);
                                    }}
                                    error={Boolean(emailFormatError || emailAlreadyExists)}
                                    helperText={
                                        checkingEmail
                                            ? "Verificando e-mail..."
                                            : emailFormatError
                                                ? form.email.trim() === ""
                                                    ? "E-mail é obrigatório"
                                                    : "E-mail inválido"
                                                : emailAlreadyExists
                                                    ? "Já existe um colaborador cadastrado com este e-mail."
                                                    : " "
                                    }
                                />

                                <FormControlLabel
                                    sx={{ mt: 1.5, ml: 0.2 }}
                                    control={
                                        <Switch
                                            checked={form.activeOnCreate}
                                            onChange={() =>
                                                setForm((p) => ({
                                                    ...p,
                                                    activeOnCreate: !p.activeOnCreate,
                                                }))
                                            }
                                            sx={{
                                                width: 48,
                                                height: 25,
                                                padding: 0,
                                                "& .MuiSwitch-switchBase": {
                                                    padding: 0,
                                                    margin: "3px",
                                                    transitionDuration: "200ms",
                                                },
                                                "& .MuiSwitch-thumb": {
                                                    boxSizing: "border-box",
                                                    width: 18,
                                                    height: 18,
                                                    backgroundColor: "#FFFFFF",
                                                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                                                },
                                                "& .MuiSwitch-track": {
                                                    borderRadius: 999,
                                                    backgroundColor: "#E5E7EB",
                                                    opacity: 1,
                                                },
                                                "& .MuiSwitch-switchBase.Mui-checked": {
                                                    transform: "translateX(22px)",
                                                    color: "#FFFFFF",
                                                },
                                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                    backgroundColor: "#22C55E",
                                                    opacity: 1,
                                                },
                                            }}
                                        />

                                    }
                                    label={
                                        <Typography sx={{ fontSize: 18, fontWeight: 500, color: text, ml: 1 }}>
                                            {isEdit ? "Ativo" : "Ativar ao criar"}
                                        </Typography>
                                    }
                                />
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography
                                sx={{
                                    m: 0,
                                    fontSize: 32,
                                    fontWeight: 700,
                                    color: "#6B7280",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Informações Profissionais
                            </Typography>

                            <Box sx={{ mt: 1, maxWidth: 980, display: "flex", flexDirection: "column", gap: 0 }}>
                                <AppSelectField
                                    value={form.departmentId}
                                    onChange={(value) => setForm((p) => ({ ...p, departmentId: value }))}
                                    placeholder="Selecione um departamento"
                                    options={departments.map((d) => ({ value: d.id, label: d.name }))}
                                    error={departmentError}
                                    helperText={departmentError ? "Departamento é obrigatório" : " "}
                                />

                                <AppTextField
                                    label="Cargo"
                                    placeholder="Ex: Analista de Marketing"
                                    value={form.role}
                                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                                    onBlur={() => setTouched2((p) => ({ ...p, role: true }))}
                                    error={roleError}
                                    helperText={roleError ? "Cargo é obrigatório" : " "}
                                />

                                <AppTextField
                                    label="Data de admissão"
                                    type="date"
                                    value={form.admissionDate}
                                    onChange={(e) => setForm((p) => ({ ...p, admissionDate: e.target.value }))}
                                    onBlur={() => setTouched2((p) => ({ ...p, admissionDate: true }))}
                                    error={admissionDateError}
                                    helperText={admissionDateError ? "Data de admissão é obrigatória" : " "}
                                    InputLabelProps={{ shrink: true }}
                                />

                                <AppSelectField
                                    value={form.level}
                                    onChange={(value) => setForm((p) => ({ ...p, level: value as HierarchyLevel }))}
                                    placeholder="Selecione um nível"
                                    options={[
                                        { value: "Junior", label: "Junior" },
                                        { value: "Pleno", label: "Pleno" },
                                        { value: "Senior", label: "Senior" },
                                        { value: "Gestor", label: "Gestor" },
                                    ]}
                                    error={levelError}
                                    helperText={levelError ? "Nível hierárquico é obrigatório" : " "}
                                />

                                <AppSelectField
                                    value={form.managerId}
                                    onChange={(value) => setForm((p) => ({ ...p, managerId: value }))}
                                    placeholder="Selecione um gestor"
                                    options={managers.map((m) => ({ value: m.id, label: m.name }))}
                                    error={touched2.managerId && form.managerId.trim() === ""}
                                    helperText={
                                        touched2.managerId && form.managerId.trim() === ""
                                            ? "Gestor responsável é obrigatório"
                                            : " "
                                    }
                                />

                                <AppTextField
                                    label="Salário base (R$)"
                                    placeholder="0,00"
                                    value={form.baseSalary}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, baseSalary: formatSalaryBR(e.target.value) }))
                                    }
                                    onBlur={() => setTouched2((p) => ({ ...p, baseSalary: true }))}
                                    error={baseSalaryError}
                                    helperText={baseSalaryError ? "Salário base é obrigatório" : " "}
                                    inputProps={{ inputMode: "numeric" }}
                                />
                            </Box>
                        </>
                    )}

                    <Box
                        sx={{
                            mt: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            maxWidth: 980,
                        }}
                    >
                        <Button
                            variant="text"
                            onClick={onBack}
                            disabled={step === 1 || submitting}
                            sx={{
                                color: step === 1 ? "#CBD5E1" : text,
                                fontWeight: 700,
                                fontSize: 18,
                                textTransform: "none",
                                "&.Mui-disabled": {
                                    color: "#CBD5E1",
                                },
                            }}
                        >
                            Voltar
                        </Button>

                        <Button
                            variant="contained"
                            onClick={onNext}
                            disabled={submitting}
                            sx={{
                                bgcolor: green,
                                color: "#FFFFFF",
                                fontWeight: 700,
                                fontSize: 18,
                                px: 4.25,
                                py: 2.25,
                                borderRadius: 2,
                                textTransform: "none",
                                boxShadow: "0 10px 24px rgba(34,197,94,0.25)",
                                "&:hover": {
                                    bgcolor: greenDark,
                                },
                                "&.Mui-disabled": {
                                    bgcolor: "#A7F3D0",
                                    color: "#FFFFFF",
                                },
                            }}
                        >
                            {step === 1 ? "Próximo" : isEdit ? "Salvar" : "Concluir"}
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Dialog open={openAvatar} onClose={() => setOpenAvatar(false)}>
                <DialogTitle>Escolha um avatar</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: 2,
                            mt: 1,
                        }}
                    >
                        {Object.entries(avatarMap).map(([key, img]) => (
                            <Box
                                key={key}
                                onClick={() => {
                                    setForm((p) => ({ ...p, avatar: key }));
                                    setOpenAvatar(false);
                                }}
                                sx={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    border:
                                        form.avatar === key
                                            ? "3px solid #22C55E"
                                            : "2px solid #E5E7EB",
                                }}
                            >
                                <img
                                    src={img}
                                    alt={key}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>

    );
};

export default EmployeeForm;
