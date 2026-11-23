import axios from "axios"

export const api = axios.create({
    baseURL: "https://dummyjson.com",
    timeout: 8000,
})

// Request interceptor: log every call
api.interceptors.request.use((config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
})

// Response interceptor: normalise errors
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (axios.isCancel(error)) return Promise.reject(error)
        error.friendlyMessage = error.response
            ? `Server error (${error.response.status})`
            : "Network problem. Check your connection."
        return Promise.reject(error)
    }
)

export const getErrorMessage = (e) => e.friendlyMessage ?? e.message