import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useProducts } from "../hooks/useProducts"
import { fetchCategories, createProduct, deleteProduct } from "../api/products"
import { getErrorMessage } from "../api/client"

const LIMIT = 12

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const category = searchParams.get("category") ?? ""
    const page = Number(searchParams.get("page") ?? 1)

    const [categories, setCategories] = useState([])
    const [message, setMessage] = useState(null)

    const { status, data, error, setProducts } = useProducts({
        category,
        limit: LIMIT,
        skip: (page - 1) * LIMIT,
    })

    useEffect(() => {
        fetchCategories().then(setCategories).catch(() => {})
    }, [])

    function updateParams(changes) {
        const next = new URLSearchParams(searchParams)
        Object.entries(changes).forEach(([key, value]) => {
            if (value) next.set(key, value)
            else next.delete(key)
        })
        setSearchParams(next)
    }

    function handleCategoryChange(e) {
        updateParams({ category: e.target.value, page: "" })
    }

    function goToPage(p) {
        updateParams({ page: p === 1 ? "" : String(p) })
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // Add: update local state from the server response
    async function handleAdd(product) {
        try {
            const created = await createProduct(product)
            setProducts((prev) => [created, ...prev])
            setMessage("Product added (simulated by DummyJSON)")
        } catch (e) {
            setMessage(getErrorMessage(e))
        }
    }

    // Delete: optimistic update with rollback
    async function handleDelete(id) {
        const previous = data.products
        setProducts((p) => p.filter((x) => x.id !== id))
        try {
            await deleteProduct(id)
        } catch {
            setProducts(previous)
            setMessage("Couldn't delete. Please try again.")
        }
    }

    const totalPages = data ? Math.ceil(data.total / LIMIT) : 1

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="rounded border bg-white p-2"
                >
                    <option value="">All categories</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                {message && <span className="text-sm text-blue-700">{message}</span>}
            </div>

            <AddProductForm onAdd={handleAdd} />

            {status === "loading" && <p>Loading…</p>}
            {status === "error" && <p className="text-red-600">{getErrorMessage(error)}</p>}

            {data && (
                <>
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {data.products.map((p) => (
                            <ProductCard key={p.id} product={p} onDelete={() => handleDelete(p.id)} />
                        ))}
                    </ul>

                    <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
                </>
            )}
        </div>
    )
}

function Pagination({ page, totalPages, onChange }) {
    if (totalPages <= 1) return null

    const pages = [...new Set([1, totalPages, page - 1, page, page + 1])]
        .filter((p) => p >= 1 && p <= totalPages)
        .sort((a, b) => a - b)

    return (
        <nav className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                className="rounded border bg-white px-3 py-1 disabled:opacity-40"
            >
                Prev
            </button>

            {pages.map((p, i) => (
                <span key={p} className="flex items-center gap-2">
          {i > 0 && p - pages[i - 1] > 1 && <span className="text-gray-400">…</span>}
                    <button
                        onClick={() => onChange(p)}
                        className={`rounded border px-3 py-1 ${
                            p === page ? "bg-blue-600 text-white" : "bg-white"
                        }`}
                    >
            {p}
          </button>
        </span>
            ))}

            <button
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
                className="rounded border bg-white px-3 py-1 disabled:opacity-40"
            >
                Next
            </button>
        </nav>
    )
}

function AddProductForm({ onAdd }) {
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const [saving, setSaving] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        await onAdd({ title, price: Number(price) })
        setTitle("")
        setPrice("")
        setSaving(false)
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2 sm:flex-row">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
                className="rounded border bg-white p-2"
            />
            <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                type="number"
                required
                className="rounded border bg-white p-2 sm:w-28"
            />
            <button
                disabled={saving}
                className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
                {saving ? "Adding…" : "Add product"}
            </button>
        </form>
    )
}