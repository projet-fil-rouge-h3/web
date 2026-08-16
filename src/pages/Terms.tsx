import { Box, Container, Typography } from "@mui/material";

const sections = [
	{
		title: "Acceptation des conditions",
		text: "L’accès et l’utilisation du site et des services proposés par CYNA supposent l’acceptation sans réserve des présentes conditions générales d’utilisation.",
	},
	{
		title: "Services et souscriptions",
		text: "Les services proposés sont des solutions de cybersécurité SaaS fournies selon les offres affichées sur le site. Les abonnements sont soumis aux caractéristiques détaillées sur chaque proposition et aux conditions de facturation en vigueur.",
	},
	{
		title: "Responsabilités",
		text: "CYNA met tout en œuvre pour assurer le bon fonctionnement des services. Toutefois, l’utilisation des solutions est sous la responsabilité du client, qui veille à la conformité, à la sécurité de ses propres systèmes et à l’usage adéquat des fonctionnalités.",
	},
	{
		title: "Modification des services",
		text: "CYNA peut ajuster, modifier ou améliorer les services afin de les adapter à l’évolution des besoins, de la technologie et des obligations réglementaires, sous réserve d’informer les clients de manière claire.",
	},
];

export default function Terms() {
	return (
		<Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
			<Container maxWidth="lg">
				<Box sx={{ maxWidth: 760, mb: 6 }}>
					<Typography
						variant="overline"
						sx={{ color: "primary.main", fontWeight: 600, letterSpacing: 2 }}
					>
						Conditions générales d’utilisation
					</Typography>
					<Typography variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
						CGU de CYNA
					</Typography>
				</Box>

				<Box sx={{ display: "grid", gap: 4 }}>
					{sections.map((section) => (
						<Box
							key={section.title}
							sx={{
								pt: 3,
								borderTop: "1px solid",
								borderColor: "divider",
							}}
						>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
								{section.title}
							</Typography>
							<Typography
								variant="body1"
								sx={{ color: "text.secondary", lineHeight: 1.8 }}
							>
								{section.text}
							</Typography>
						</Box>
					))}
				</Box>
			</Container>
		</Box>
	);
}
