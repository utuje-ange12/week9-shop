import { useEffect, useState } from "react"
import axios from "axios"
import { fetchCategories, fetchProducts } from "../api/products"
import { getErrorMessage } from "../api/client"

export default function HomePage() {
    const [state, setState] = useState({ status: "loading", products: [], categories: [], error: null })

    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller

        Promise.all([fetchProducts({ limit: 4, signal }), fetchCategories({ signal })])
            .then(([productsRes, categories]) =>
                setState({ status: "success", products: productsRes.products, categories, error: null })
            )
            .catch((e) => {
                if (axios.isCancel(e)) return
                setState((s) => ({ ...s, status: "error", error: getErrorMessage(e) }))
            })

        return () => controller.abort()
    }, [])

    if (state.status === "loading") return <p className="p-6">Loading…</p>
    if (state.status === "error") return <p className="p-6 text-red-600">{state.error}</p>

    return (
        <div className="p-6">
            <h2 className="mb-3 text-xl font-semibold">Featured</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {state.products.map((p) => (
                    <div key={p.id} className="rounded border p-3">
                        <img src={p.thumbnail} alt={p.title} className="h-28 w-full object-contain" />
                        <p className="mt-2 text-sm font-medium">{p.title}</p>
                        <p className="text-sm text-gray-600">${p.price}</p>
                    </div>
                ))}
            </div>

            <h2 className="mb-3 mt-8 text-xl font-semibold">Categories</h2>
            <div className="flex flex-wrap gap-2">
                {state.categories.map((c) => (
                    <span key={c} className="rounded-full bg-gray-100 px-3 py-1 text-sm">{c}</span>
                ))}
            </div>
        </div>
    )
}