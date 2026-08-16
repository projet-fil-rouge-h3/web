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
	Link as MuiLink,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import { Link } from "react-router-dom";
import { authApi } from "@/services/auth"; // Adapte le chemin si besoin

const schema = z.object({
	email: z.string().email("Adresse e-mail invalide"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
	const [status, setStatus] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({ resolver: zodResolver(schema) });

	const onSubmit = async (data: FormData) => {
		setStatus(null);
		try {
			const response = (await authApi.forgotPassword(data)) as {
				message: string;
			};
			setStatus({
				type: "success",
				message:
					response.message ||
					"Si cet email existe, un lien de réinitialisation a été envoyé.",
			});
		} catch {
			setStatus({
				type: "error",
				message: "Une erreur est survenue. Veuillez réessayer.",
			});
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
						Mot de passe oublié
					</Typography>
					<Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
						Saisissez votre adresse e-mail pour recevoir un lien de
						réinitialisation.
					</Typography>

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
							{...register("email")}
							label="Adresse e-mail"
							type="email"
							fullWidth
							autoFocus
							error={!!errors.email}
							helperText={errors.email?.message}
						/>
						<Button
							type="submit"
							variant="contained"
							size="large"
							fullWidth
							disabled={isSubmitting}
							sx={{ py: 1.5 }}
						>
							{isSubmitting ? (
								<CircularProgress size={24} color="inherit" />
							) : (
								"Envoyer le lien"
							)}
						</Button>
					</Box>

					<Typography
						variant="body2"
						sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}
					>
						Retour à la{" "}
						<MuiLink
							component={Link}
							to="/login"
							underline="hover"
							sx={{ fontWeight: 600 }}
						>
							Connexion
						</MuiLink>
					</Typography>
				</Paper>
			</Container>
		</Box>
	);
}
