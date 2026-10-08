export const APP_PATHS = {
  LOGIN: "/login",
  REGISTER: "/register",
  HOME: "/",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  NOT_FOUND: "*",
  CHAT: "/chat",
  video: "/video",
  BOT: "/bot",
  LOOKUP: "/lookup"
}

export const PATHS = {
  CHAT_ID: (id: string) => `${APP_PATHS.CHAT}/${id}`,
  CHAT_NEW: `${APP_PATHS.CHAT}/new`,
  BOT: `${APP_PATHS.CHAT}`
}