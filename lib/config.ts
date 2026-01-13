/**
 * Centralized configuration for FaceSort
 * All environment variables are validated here
 */

const getEnvVar = (key: string, optional = false): string => {
  const value = process.env[key]
  if (!value && !optional) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value || ""
}

export const config = {
  // MongoDB
  mongodbUri: getEnvVar("MONGODB_URI"),

  // NextAuth
  nextauthSecret: getEnvVar("NEXTAUTH_SECRET"),
  nextauthUrl:
    getEnvVar("NEXTAUTH_URL", true) ||
    (process.env.NODE_ENV === "production" ? "https://facesort.vercel.app" : "http://localhost:3000"),

  // Supabase
  supabaseUrl: getEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: getEnvVar("SUPABASE_SERVICE_ROLE_KEY"),

  // Backend (optional)
  backendUrl: getEnvVar("NEXT_PUBLIC_BACKEND_URL", true),

  // App
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
}
