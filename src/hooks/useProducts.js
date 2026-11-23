import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { fetchProducts, fetchProductsByCategory } from "../api/products"

export function useProducts({ category, limit, skip }) {
    const [state, setState] = useState({ status: "loading", data: null, error: null })

    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller
        setState((s) => ({ ...s, status: "loading", error: null }))

        const request = category
            ? fetchProductsByCategory(category, { limit, skip, signal })
            : fetchProducts({ limit, skip, signal })

        request
            .then((data) => setState({ status: "success", data, error: null }))
            .catch((error) => {
                if (axios.isCancel(error)) return
                setState((s) => ({ ...s, status: "error", error }))
            })

        return () => controller.abort()
    }, [category, limit, skip])

    // Lets components update the list locally after mutations
    const setProducts = useCallback((updater) => {
        setState((s) => ({
            ...s,
            data: {
                ...s.data,
                products: typeof updater === "function" ? updater(s.data.products) : updater,
            },
        }))
    }, [])

    return { ...state, setProducts }
}