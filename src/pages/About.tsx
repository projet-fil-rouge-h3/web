import { Box, Container, Typography } from "@mui/material";

const pillars = [
	{
		title: "Notre mission",
		text: "CYNA aide les entreprises à sécuriser leur SI avec des solutions SaaS prêtes à déployer, pilotées par des experts et conçues pour rester simples à adopter.",
	},
	{
		title: "Notre approche",
		text: "Nous combinons visibilité, détection et réponse pour réduire les risques cyber sans alourdir les équipes internes ni compliquer la mise en œuvre.",
	},
	{
		title: "Notre engagement",
		text: "La confiance, la conformité et la réactivité sont au cœur de notre relation client, avec un accompagnement de bout en bout dès l’intégration jusqu’au suivi opérationnel.",
	},
];

export default function About() {
	return (
		<Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
			<Container maxWidth="lg">
				<Box sx={{ maxWidth: 760, mb: 6 }}>
					<Typography
						variant="overline"
						sx={{ color: "primary.main", fontWeight: 600, letterSpacing: 2 }}
					>
						À propos
					</Typography>
					<Typography variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
						Une cybersécurité claire, rapide et rassurante.
					</Typography>
					<Typography
						variant="body1"
						sx={{ color: "text.secondary", lineHeight: 1.8 }}
					>
						CYNA accompagne les PME et les grandes entreprises dans la
						modernisation de leur sécurité numérique avec des services SaaS
						gérés, des réponses rapides et une expertise concrète.
					</Typography>
				</Box>

				<Box sx={{ display: "grid", gap: 4 }}>
					{pillars.map((item) => (
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

				<Box
					sx={{ mt: 6, pt: 3, borderTop: "1px solid", borderColor: "divider" }}
				>
					<Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
						Une équipe orientée résultats
					</Typography>
					<Typography
						variant="body1"
						sx={{ color: "text.secondary", lineHeight: 1.8 }}
					>
						Nous concevons des services de sécurité pensés pour l’activité
						réelle des entreprises : simplification des opérations, réduction du
						bruit, meilleure visibilité et capacité de réaction face aux
						menaces.
					</Typography>
				</Box>
			</Container>
		</Box>
	);
}
