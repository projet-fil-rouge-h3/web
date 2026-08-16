import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { theme } from "@/design-system/theme";
import PageLayout from "@/components/layout/PageLayout";
import { Box, CircularProgress } from "@mui/material";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/services/auth";

const Home = lazy(() => import("@/pages/Home"));
const Catalog = lazy(() => import("@/pages/Catalog"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Cart = lazy(() => import("@/pages/Cart"));
const Contact = lazy(() => import("@/pages/Contact"));
const About = lazy(() => import("@/pages/About"));
const Legal = lazy(() => import("@/pages/Legal"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Account = lazy(() => import("@/pages/Account"));
const Admin = lazy(() => import("@/pages/Admin"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			retry: 1,
		},
	},
});

function PageFallback() {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "50vh",
			}}
		>
			<CircularProgress />
		</Box>
	);
}

function App() {
	// L'access token vit en mémoire et le backend n'a pas de refresh token :
	// au rechargement de page, on purge l'état de session persisté (localStorage)
	// pour que l'UI ne se croie pas connectée sans token valide.
	useEffect(() => {
		if (useAuthStore.getState().isAuthenticated) {
			void authApi.restoreSession();
		}
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<BrowserRouter>
					<Suspense fallback={<PageFallback />}>
						<Routes>
							<Route element={<PageLayout />}>
								<Route path="/" element={<Home />} />
								<Route path="/catalog" element={<Catalog />} />
								<Route path="/product/:slug" element={<ProductDetail />} />
								<Route path="/cart" element={<Cart />} />
								<Route path="/contact" element={<Contact />} />
								<Route path="/about" element={<About />} />
								<Route path="/legal" element={<Legal />} />
								<Route path="/privacy" element={<Privacy />} />
								<Route path="/terms" element={<Terms />} />
								<Route path="/login" element={<Login />} />
								<Route path="/register" element={<Register />} />
								<Route path="/account" element={<Account />} />
								<Route path="/admin" element={<Admin />} />
								<Route path="/forgot-password" element={<ForgotPassword />} />
								<Route path="/reset-password" element={<ResetPassword />} />
								<Route path="*" element={<Navigate to="/" replace />} />
							</Route>
						</Routes>
					</Suspense>
				</BrowserRouter>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
