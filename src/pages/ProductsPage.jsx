import { useEffect, useState } from "react"
import ProductCard from "../components/ProductCard"
import { useProducts } from "../hooks/useProducts"
import { useProduct } from "../hooks/useProduct"
import { useUrlParam } from "../hooks/useUrlParam"
import { fetchCategories, createProduct, deleteProduct } from "../api/products"
import { getErrorMessage } from "../api/client"

const LIMIT = 12

export default function ProductsPage() {
    const [category, setCategory] = useUrlParam("category", "")
    const [pageParam, setPageParam] = useUrlParam("page", "1")
    const page = Number(pageParam)

    const [categories, setCategories] = useState([])
    const [selectedId, setSelectedId] = useState(null)
    const [message, setMessage] = useState(null)

    const { status, data, error, setProducts } = useProducts({
        category,
        limit: LIMIT,
        skip: (page - 1) * LIMIT,
    })
    const detail = useProduct(selectedId)

    useEffect(() => {
        fetchCategories().then(setCategories).catch(() => {})
    }, [])

    function handleCategoryChange(e) {
        setCategory(e.target.value)
        setPageParam("1")
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
        <div className="p-6">
            <div className="mb-4 flex items-center gap-3">
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
                    <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {data.products.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                onSelect={() => setSelectedId(p.id)}
                                onDelete={() => handleDelete(p.id)}
                            />
                        ))}
                    </ul>

                    <div className="mt-6 flex items-center gap-3">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPageParam(String(page - 1))}
                            className="rounded border bg-white px-3 py-1 disabled:opacity-40"
                        >
                            Prev
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPageParam(String(page + 1))}
                            className="rounded border bg-white px-3 py-1 disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {selectedId && (
                <div className="mt-6 rounded-xl bg-white p-4 shadow-sm">
                    {detail.status === "loading" && <p>Loading details…</p>}
                    {detail.status === "success" && (
                        <>
                            <h3 className="font-semibold">{detail.data.title}</h3>
                            <p className="text-sm">{detail.data.description}</p>
                        </>
                    )}
                    <button onClick={() => setSelectedId(null)} className="mt-2 text-xs underline">
                        Close
                    </button>
                </div>
            )}
        </div>
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
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
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
                className="w-28 rounded border bg-white p-2"
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