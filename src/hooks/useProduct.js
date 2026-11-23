import { useEffect, useState } from "react"
import axios from "axios"
import { fetchProduct } from "../api/products"

export function useProduct(id) {
    const [state, setState] = useState({ status: "idle", data: null, error: null })

    useEffect(() => {
        if (id == null) return // "enabled" pattern
        const controller = new AbortController()
        setState({ status: "loading", data: null, error: null })

        fetchProduct(id, { signal: controller.signal })
            .then((data) => setState({ status: "success", data, error: null }))
            .catch((error) => {
                if (axios.isCancel(error)) return
                setState({ status: "error", data: null, error })
            })

        return () => controller.abort()
    }, [id])

    return state
}