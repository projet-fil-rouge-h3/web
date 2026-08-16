import { api, setAccessToken } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";

export interface UserInfo {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: "USER" | "ADMIN";
	emailVerified: boolean;
}

/** Utilisateur tel que sérialisé par Symfony (groupe user:read). */
interface BackendUser {
	id: number;
	email: string;
	roles: string[];
	firstName: string;
	lastName: string;
}

/** Réponse de POST /api/auth/login (LexikJWTAuthenticationBundle). */
interface LoginResponse {
	token: string;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface RegisterPayload {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phone?: string;
}

/** Adapte la forme Symfony (roles[], id numérique) au modèle du front. */
function toUserInfo(backendUser: BackendUser): UserInfo {
	return {
		id: String(backendUser.id),
		email: backendUser.email,
		firstName: backendUser.firstName,
		lastName: backendUser.lastName,
		role: backendUser.roles.includes("ROLE_ADMIN") ? "ADMIN" : "USER",
		// isVerified n'est pas exposé par le groupe user:read du backend
		emailVerified: false,
	};
}

export const authApi = {
	/**
	 * Le login Lexik ne renvoie que { token } : on enchaîne un GET /auth/me
	 * pour récupérer le profil de l'utilisateur connecté.
	 */
	login: async (payload: LoginPayload): Promise<UserInfo> => {
		const { token } = await api.post<LoginResponse>("/auth/login", payload);
		setAccessToken(token);
		const user = toUserInfo(await api.get<BackendUser>("/auth/me"));
		useAuthStore.getState().setUser(user);
		return user;
	},

	/**
	 * Le register ne renvoie pas de token : on enchaîne un login
	 * pour ouvrir la session immédiatement après l'inscription.
	 */
	register: async (payload: RegisterPayload): Promise<UserInfo> => {
		await api.post<BackendUser>("/auth/register", payload);
		return authApi.login({ email: payload.email, password: payload.password });
	},

	/**
	 * Pas de refresh token côté backend : le token vit uniquement en mémoire,
	 * la session ne peut donc pas être restaurée après un rechargement de page.
	 * On purge l'état persisté pour que l'UI reste cohérente.
	 */
	restoreSession: async (): Promise<UserInfo | null> => {
		useAuthStore.getState().logout();
		return null;
	},

	/** Le backend n'expose pas (encore) de route de mise à jour du profil. */
	updateProfile: async (_payload: {
		firstName: string;
		lastName: string;
		phone?: string;
	}): Promise<UserInfo> => {
		throw new Error(
			"Non disponible : le backend n'expose pas PUT /api/auth/me",
		);
	},
	forgotPassword: async (payload: { email: string }) => {
		return api.post<{ message: string }>("/auth/forgot-password", payload);
	},
	resetPassword: async (payload: { token: string; password: string }) => {
		return api.post<{ message: string }>("/auth/reset-password", payload);
	},
	/** Pas de route logout côté backend (JWT stateless) : purge locale uniquement. */
	logout: async (): Promise<void> => {
		setAccessToken(null);
		useAuthStore.getState().logout();
	},
};
