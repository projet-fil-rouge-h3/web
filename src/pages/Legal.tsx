import { Box, Container, Typography } from "@mui/material";

const items = [
	{
		title: "Éditeur du site",
		text: "CYNA est le responsable de l’édition du site internet accessible depuis la plateforme de vente et de consultation des solutions de cybersécurité.",
	},
	{
		title: "Propriété intellectuelle",
		text: "Tous les éléments du site, textes, visuels, marques, logos et contenus, sont protégés par les droits de propriété intellectuelle et ne peuvent être reproduits sans autorisation écrite.",
	},
	{
		title: "Responsabilité",
		text: "CYNA s’efforce de fournir une information fiable et à jour. Toutefois, les informations présentées sont données à titre indicatif et ne sauraient engager la responsabilité de l’entreprise en cas d’erreur ou d’omission.",
	},
];

export default function Legal() {
	return (
		<Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
			<Container maxWidth="lg">
				<Box sx={{ maxWidth: 760, mb: 6 }}>
					<Typography
						variant="overline"
						sx={{ color: "primary.main", fontWeight: 600, letterSpacing: 2 }}
					>
						Mentions légales
					</Typography>
					<Typography variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
						Informations légales et conditions d’utilisation du site
					</Typography>
				</Box>

				<Box sx={{ display: "grid", gap: 4 }}>
					{items.map((item) => (
						<Box
							key={item.title}
							sx={{
								pt: 3,
								borderTop: "1px solid",
								borderColor: "divider",
							}}
						>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
								{item.title}
							</Typography>
							<Typography
								variant="body1"
								sx={{ color: "text.secondary", lineHeight: 1.8 }}
							>
								{item.text}
							</Typography>
						</Box>
					))}
				</Box>
			</Container>
		</Box>
	);
}
