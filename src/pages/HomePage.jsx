import { useEffect, useState } from "react"
import axios from "axios"
import ProductCard from "../components/ProductCard"
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
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {state.products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </ul>

            <h2 className="mb-3 mt-8 text-xl font-semibold">Categories</h2>
            <div className="flex flex-wrap gap-2">
                {state.categories.map((c) => (
                    <span key={c} className="rounded-full bg-white px-3 py-1 text-sm shadow-sm">{c}</span>
                ))}
            </div>
        </div>
    )
}