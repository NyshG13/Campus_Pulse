export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

// makes the backend url available to the entire frontend - it stores the configuration 
//stores constants and settings that the rest of the frontend uses. 
//changing backend api updates it throughout the frontend 