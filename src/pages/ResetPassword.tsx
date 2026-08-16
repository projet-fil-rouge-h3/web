import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Box,
	Container,
	Typography,
	TextField,
	Button,
	Paper,
	Alert,
	CircularProgress,
	IconButton,
	InputAdornment,
	Link as MuiLink,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SecurityIcon from "@mui/icons-material/Security";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/services/auth"; // Adapte le chemin si besoin

const schema = z.object({
	password: z
		.string()
		.min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
	const [showPassword, setShowPassword] = useState(false);
	const [status, setStatus] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({ resolver: zodResolver(schema) });

	const onSubmit = async (data: FormData) => {
		if (!token) {
			setStatus({
				type: "error",
				message: "Token de réinitialisation manquant ou invalide.",
			});
			return;
		}

		setStatus(null);
		try {
			await authApi.resetPassword({ token, password: data.password });
			setStatus({
				type: "success",
				message: "Mot de passe modifié avec succès. Vous allez être redirigé.",
			});
			setTimeout(() => navigate("/login"), 3000);
		} catch {
			setStatus({ type: "error", message: "Le lien est expiré ou invalide." });
		}
	};

	return (
		<Box
			sx={{
				bgcolor: "background.default",
				minHeight: "calc(100vh - 128px)",
				display: "flex",
				alignItems: "center",
				py: 6,
			}}
		>
			<Container maxWidth="sm">
				<Paper
					elevation={0}
					sx={{
						p: { xs: 3, sm: 5 },
						border: "1px solid",
						borderColor: "divider",
						borderRadius: 3,
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
						<SecurityIcon sx={{ color: "primary.main", fontSize: 32 }} />
						<Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
							CYNA
						</Typography>
					</Box>

					<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
						Nouveau mot de passe
					</Typography>
					<Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
						Veuillez saisir votre nouveau mot de passe.
					</Typography>

					{!token && (
						<Alert severity="error" sx={{ mb: 3 }}>
							Aucun token de réinitialisation trouvé dans l'URL.
						</Alert>
					)}

					{status && (
						<Alert
							severity={status.type}
							sx={{ mb: 3 }}
							onClose={() => setStatus(null)}
						>
							{status.message}
						</Alert>
					)}

					<Box
						component="form"
						onSubmit={handleSubmit(onSubmit)}
						noValidate
						sx={{ display: "flex", flexDirection: "column", gap: 3 }}
					>
						<TextField
							{...register("password")}
							label="Nouveau mot de passe"
							type={showPassword ? "text" : "password"}
							fullWidth
							disabled={!token}
							error={!!errors.password}
							helperText={errors.password?.message}
							slotProps={{
								input: {
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={() => setShowPassword((v) => !v)}
												edge="end"
											>
												{showPassword ? (
													<VisibilityOffIcon />
												) : (
													<VisibilityIcon />
												)}
											</IconButton>
										</InputAdornment>
									),
								},
							}}
						/>
						<Button
							type="submit"
							variant="contained"
							size="large"
							fullWidth
							disabled={isSubmitting || !token}
							sx={{ py: 1.5 }}
						>
							{isSubmitting ? (
								<CircularProgress size={24} color="inherit" />
							) : (
								"Enregistrer"
							)}
						</Button>
					</Box>
				</Paper>
			</Container>
		</Box>
	);
}
