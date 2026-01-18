// export const BACKEND_URL = "http://localhost:3001";

// export const API_URL = `${BACKEND_URL}/api`;
// export const AUTH_URL = `${BACKEND_URL}/auth`;
// const BACKEND_URL = import.meta.env.PROD
//   ? "https://server-51fn.onrender.com"
//   : "";

// export const API_URL = `${BACKEND_URL}/api`;
// export const AUTH_URL = `${BACKEND_URL}/auth`;
// const BACKEND_URL = import.meta.env.PROD
//   ? "https://server-51fn.onrender.com"
//   : "";

// export const API_URL = import.meta.env.PROD ? `${BACKEND_URL}/api` : "/api";

// export const AUTH_URL = import.meta.env.PROD ? `${BACKEND_URL}/auth` : "/auth";

const BACKEND_URL = import.meta.env.PROD
  ? "https://server-51fn.onrender.com"
  : "http://localhost:3001";

export const API_URL = import.meta.env.PROD ? `${BACKEND_URL}/api` : "/api";

export const AUTH_URL = import.meta.env.PROD ? `${BACKEND_URL}/auth` : "/auth";
