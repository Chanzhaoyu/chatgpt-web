/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_GLOB_API_URL: string;
	readonly VITE_GLOB_API_TIMEOUT: string;
	readonly VITE_GLOB_HTTP_PROXY: 'Y' | 'N';
}
