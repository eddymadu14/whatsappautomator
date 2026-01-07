/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string; // ✅ your custom env
  // DO NOT redeclare MODE, DEV, PROD — Vite already provides them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}