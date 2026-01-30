import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export type DeleteEntityType = "employee" | "department";

type AppDeleteDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    type: DeleteEntityType;
    itemName?: string;
    count?: number;
    loading?: boolean;
    confirmLabel?: string;
};

function getCopy(args: {
    type: DeleteEntityType;
    count: number;
    itemName?: string;
}) {
    const { type, count, itemName } = args;

    const dict = {
        employee: { singular: "colaborador", plural: "colaboradores" },
        department: { singular: "departamento", plural: "departamentos" },
    } as const;

    const noun = count === 1 ? dict[type].singular : dict[type].plural;

    const title =
        count === 1 && itemName
            ? `Excluir ${dict[type].singular} ${itemName}?`
            : `Excluir ${count} ${noun}?`;

    const description =
        count === 1
            ? `Essa ação é irreversível. O ${dict[type].singular} selecionado será removido permanentemente do sistema.`
            : `Essa ação é irreversível. Todos os ${noun} selecionados serão removidos permanentemente do sistema.`;

    const confirmText = count === 1 ? "Excluir" : "Excluir todos";

    return { title, description, confirmText };
}

export function AppDeleteDialog({
    open,
    onClose,
    onConfirm,
    type,
    itemName,
    count,
    loading = false,
    confirmLabel,
}: AppDeleteDialogProps) {
    const safeCount = typeof count === "number" ? count : 1;

    const copy = getCopy({
        type,
        count: safeCount,
        itemName,
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 1,
                    minWidth: 420,
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 800, fontSize: 20 }}>
                {copy.title}
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <Typography sx={{ color: "#6B7280", fontWeight: 600 }}>
                    {copy.description}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    disabled={loading}
                    sx={{
                        borderColor: "#D1D5DB",
                        color: "#6B7280",
                        fontWeight: 700,
                        textTransform: "none",
                    }}
                >
                    Cancelar
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                    disabled={loading}
                    sx={{
                        fontWeight: 800,
                        textTransform: "none",
                        boxShadow: "0 10px 24px rgba(220,38,38,0.25)",
                        "&.Mui-disabled": { opacity: 0.75 },
                    }}
                    startIcon={<DeleteOutlineIcon />}
                >
                    {loading ? "Excluindo..." : confirmLabel ?? copy.confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}