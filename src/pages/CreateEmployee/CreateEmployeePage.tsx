import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    LinearProgress,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

import { createEmployee } from "../../firebase/employees";

type Step = 1 | 2;

type FormState = {
    name: string;
    email: string;
    activeOnCreate: boolean;
    department: string;
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
    value: number | "✓";
}) => {
    const bg =
        variant === "active" ? green : variant === "done" ? green : "#E5E7EB";
    const color = variant === "inactive" ? "#6B7280" : "#FFFFFF";

    return (
        <Box
            sx={{
                width: 34,
                height: 34,
                borderRadius: "999px",
                bgcolor: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color,
                fontWeight: 900,
                fontSize: 15,
                flexShrink: 0,
            }}
        >
            {value}
        </Box>
    );
};

const CreateEmployeePage = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>(1);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        activeOnCreate: true,
        department: "",
    });

    const [touched, setTouched] = useState({
        name: false,
        email: false,
        department: false,
    });

    const progress = useMemo(() => (step === 1 ? 0 : 50), [step]);

    const nameError = touched.name && form.name.trim() === "";
    const emailError = touched.email && form.email.trim() === "";
    const departmentError = touched.department && form.department.trim() === "";

    const canGoNextStep1 = form.name.trim() !== "" && form.email.trim() !== "";
    const canFinishStep2 = form.department.trim() !== "";

    async function onNext() {
        if (step === 1) {
            setTouched((p) => ({ ...p, name: true, email: true }));
            if (!canGoNextStep1) return;
            setStep(2);
            return;
        }

        setTouched((p) => ({ ...p, department: true }));
        if (!canFinishStep2) return;

        try {
            setSubmitting(true);
            await createEmployee({
                name: form.name.trim(),
                email: form.email.trim(),
                department: form.department,
                status: form.activeOnCreate ? "Ativo" : "Inativo",
            });
            navigate("/");
        } finally {
            setSubmitting(false);
        }
    }

    function onBack() {
        if (step === 1) return;
        setStep(1);
    }

    return (
        <Box sx={{ fontFamily: "Inter, sans-serif", color: text }}>
            {/* Breadcrumb */}
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
                    Cadastrar Colaborador
                </Typography>
            </Box>

            {/* Progress */}
            <Box sx={{ mt: 2.25 }}>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 6,
                        borderRadius: 999,
                        bgcolor: "#D1FAE5",
                        "& .MuiLinearProgress-bar": {
                            bgcolor: green,
                            borderRadius: 999,
                        },
                    }}
                />

                <Box
                    sx={{
                        mt: 1.25,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Typography sx={{ fontSize: 16, color: muted, fontWeight: 600 }}>
                        {progress}%
                    </Typography>
                </Box>
            </Box>

            {/* Body grid */}
            <Box
                sx={{
                    mt: 3.5,
                    display: "grid",
                    gridTemplateColumns: "260px 1fr",
                    gap: 5,
                    alignItems: "start",
                }}
            >
                {/* Left steps */}
                <Box sx={{ pt: 1 }}>
                    {/* Step 1 */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {step === 1 ? (
                            <StepCircle variant="active" value={1} />
                        ) : (
                            <StepCircle variant="done" value="✓" />
                        )}

                        <Typography sx={{ fontSize: 18, fontWeight: 700, color: text }}>
                            Infos Básicas
                        </Typography>
                    </Box>

                    {/* connector */}
                    <Box
                        sx={{
                            ml: "16px",
                            height: "84px",
                            borderLeft: `2px solid ${border}`,
                        }}
                    />

                    {/* Step 2 */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <StepCircle
                            variant={step === 2 ? "active" : "inactive"}
                            value={2}
                        />

                        <Typography
                            sx={{
                                fontSize: 18,
                                fontWeight: step === 2 ? 800 : 700,
                                color: step === 2 ? text : muted,
                            }}
                        >
                            Infos Profissionais
                        </Typography>
                    </Box>
                </Box>

                {/* Right content */}
                <Box>
                    {step === 1 ? (
                        <>
                            <Typography
                                sx={{
                                    m: 0,
                                    fontSize: 36,
                                    fontWeight: 800,
                                    color: "#6B7280",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Informações Básicas
                            </Typography>

                            <Box sx={{ mt: 4, maxWidth: 980 }}>
                                <TextField
                                    fullWidth
                                    label="Título"
                                    placeholder="João da Silva"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, name: e.target.value }))
                                    }
                                    onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                                    error={nameError}
                                    helperText={nameError ? "Nome é obrigatório" : " "}
                                    InputLabelProps={{
                                        sx: {
                                            fontWeight: 600,
                                            color: "#111827",
                                        },
                                    }}
                                    sx={{
                                        mb: 1.5,
                                        "& .MuiOutlinedInput-root": {
                                            height: 64,
                                            borderRadius: "10px",
                                            "& fieldset": {
                                                borderColor: nameError ? "#DC2626" : green,
                                                borderWidth: 2,
                                            },
                                            "&:hover fieldset": {
                                                borderColor: nameError ? "#DC2626" : greenDark,
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: nameError ? "#DC2626" : green,
                                            },
                                        },
                                        "& .MuiFormHelperText-root": {
                                            fontWeight: 600,
                                        },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="E-mail"
                                    placeholder="e.g. john@gmail.com"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, email: e.target.value }))
                                    }
                                    onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                                    error={emailError}
                                    helperText={emailError ? "E-mail é obrigatório" : " "}
                                    InputLabelProps={{
                                        sx: {
                                            fontWeight: 600,
                                            color: "#111827",
                                        },
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            height: 64,
                                            borderRadius: "10px",
                                            "& fieldset": {
                                                borderColor: emailError ? "#DC2626" : "#D1D5DB",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: emailError ? "#DC2626" : "#9CA3AF",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: emailError ? "#DC2626" : "#9CA3AF",
                                            },
                                        },
                                        "& .MuiFormHelperText-root": {
                                            fontWeight: 600,
                                        },
                                    }}
                                />

                                <FormControlLabel
                                    sx={{ mt: 1.5 }}
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
                                                "& .MuiSwitch-switchBase.Mui-checked": {
                                                    color: "#FFFFFF",
                                                },
                                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                                {
                                                    backgroundColor: green,
                                                    opacity: 1,
                                                },
                                                "& .MuiSwitch-track": {
                                                    backgroundColor: "#E5E7EB",
                                                    opacity: 1,
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography sx={{ fontSize: 18, fontWeight: 500, color: text }}>
                                            Ativar ao criar
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
                                    fontSize: 36,
                                    fontWeight: 800,
                                    color: "#6B7280",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Informações Profissionais
                            </Typography>

                            <Box sx={{ mt: 4, maxWidth: 980 }}>
                                <FormControl fullWidth error={departmentError}>
                                    <Select
                                        displayEmpty
                                        value={form.department}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                department: e.target.value as string,
                                            }))
                                        }
                                        onBlur={() =>
                                            setTouched((p) => ({ ...p, department: true }))
                                        }
                                        sx={{
                                            height: 64,
                                            borderRadius: "10px",
                                            "& .MuiSelect-select": {
                                                color: form.department ? text : muted,
                                                fontSize: 18,
                                            },
                                            "& fieldset": {
                                                borderColor: departmentError ? "#DC2626" : "#D1D5DB",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: departmentError ? "#DC2626" : "#9CA3AF",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: departmentError ? "#DC2626" : "#9CA3AF",
                                            },
                                        }}
                                    >
                                        <MenuItem value="" disabled>
                                            Selecione um departamento
                                        </MenuItem>
                                        <MenuItem value="Design">Design</MenuItem>
                                        <MenuItem value="TI">TI</MenuItem>
                                        <MenuItem value="Marketing">Marketing</MenuItem>
                                        <MenuItem value="Produto">Produto</MenuItem>
                                        <MenuItem value="Financeiro">Financeiro</MenuItem>
                                    </Select>

                                    <FormHelperText sx={{ fontWeight: 600 }}>
                                        {departmentError ? "Departamento é obrigatório" : " "}
                                    </FormHelperText>
                                </FormControl>
                            </Box>
                        </>
                    )}

                    {/* Footer buttons */}
                    <Box
                        sx={{
                            mt: "220px",
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
                                fontWeight: 800,
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
                                fontWeight: 900,
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
                            {step === 1 ? "Próximo" : "Concluir"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default CreateEmployeePage;
