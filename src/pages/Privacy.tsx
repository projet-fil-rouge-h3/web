import { Box, Container, Typography } from "@mui/material";

const sections = [
	{
		title: "Données collectées",
		text: "Nous collectons les informations nécessaires à la gestion de votre compte, à la prise en charge de votre demande, à la facturation et à l’amélioration des services, notamment votre identité, vos coordonnées et les informations techniques liées à votre utilisation de la plateforme.",
	},
	{
		title: "Finalités du traitement",
		text: "Les données sont utilisées pour la création et la gestion de votre compte, l’exécution des services souscrits, la relation client, la prévention des fraudes, la conformité réglementaire et l’amélioration de l’expérience utilisateur.",
	},
	{
		title: "Vos droits",
		text: "Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation du traitement, d’opposition et de portabilité de vos données. Vous pouvez exercer ces droits en contactant notre équipe.",
	},
	{
		title: "Durée de conservation",
		text: "Les données sont conservées uniquement pendant la durée nécessaire à l’exécution des services, au respect des obligations légales et à la gestion de la relation commerciale, selon les règles applicables.",
	},
];

export default function Privacy() {
	return (
		<Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
			<Container maxWidth="lg">
				<Box sx={{ maxWidth: 760, mb: 6 }}>
					<Typography
						variant="overline"
						sx={{ color: "primary.main", fontWeight: 600, letterSpacing: 2 }}
					>
						Politique de confidentialité
					</Typography>
					<Typography variant="h3" sx={{ fontWeight: 700, mt: 1, mb: 2 }}>
						Votre sécurité et vos données personnelles sont au centre de nos
						pratiques.
					</Typography>
					<Typography
						variant="body1"
						sx={{ color: "text.secondary", lineHeight: 1.8 }}
					>
						CYNA traite les données personnelles avec sérieux et dans le respect
						du règlement général sur la protection des données (RGPD) et des
						principes de minimisation et de sécurité.
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
