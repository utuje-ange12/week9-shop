import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useProduct } from "../hooks/useProduct"
import { getErrorMessage } from "../api/client"

export default function ProductDetailsPage() {
    const { id } = useParams()
    const { status, data: p, error } = useProduct(id)
    const [selected, setSelected] = useState(0)

    const back = (
        <Link to="/" className="text-sm text-blue-600 hover:underline">
            ← Back to products
        </Link>
    )

    if (status === "idle" || status === "loading") {
        return <div className="p-4 sm:p-6">{back}<p className="mt-4">Loading…</p></div>
    }

    if (status === "error") {
        return (
            <div className="p-4 sm:p-6">
                {back}
                <p className="mt-4 text-red-600">
                    {error?.response?.status === 404
                        ? "This product doesn't exist on the server (products you add are only simulated)."
                        : getErrorMessage(error)}
                </p>
            </div>
        )
    }

    const images = p.images?.length ? p.images : [p.thumbnail]
    const main = images[selected] ?? images[0]
    const finalPrice = p.discountPercentage ? p.price * (1 - p.discountPercentage / 100) : p.price

    return (
        <div className="p-4 sm:p-6">
            {back}

            <div className="mt-4 grid gap-6 rounded-xl bg-white p-4 shadow-sm md:grid-cols-2 md:p-6">
                <div>
                    <img src={main} alt={p.title} className="h-72 w-full object-contain sm:h-96" />
                    {images.length > 1 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto">
                            {images.map((src, i) => (
                                <button
                                    key={src}
                                    onClick={() => setSelected(i)}
                                    className={`shrink-0 rounded border p-1 ${i === selected ? "border-blue-600" : "border-gray-200"}`}
                                >
                                    <img src={src} alt="" className="h-16 w-16 object-contain" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <Link to={`/?category=${p.category}`} className="text-xs font-semibold uppercase text-gray-500 hover:underline">
                        {p.category}
                    </Link>
                    <h1 className="mt-1 text-2xl font-bold">{p.title}</h1>
                    {p.brand && <p className="text-sm text-gray-500">by {p.brand}</p>}

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="text-2xl font-bold text-green-600">${finalPrice.toFixed(2)}</span>
                        {p.discountPercentage > 0 && (
                            <>
                                <span className="text-gray-400 line-through">${p.price}</span>
                                <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                  -{Math.round(p.discountPercentage)}%
                </span>
                            </>
                        )}
                    </div>

                    <p className="mt-2 text-sm text-gray-600">Rating: {p.rating} · {p.availabilityStatus} ({p.stock} in stock)</p>
                    <p className="mt-4 text-sm">{p.description}</p>

                    <ul className="mt-4 space-y-1 text-sm text-gray-600">
                        {p.warrantyInformation && <li>Warranty: {p.warrantyInformation}</li>}
                        {p.shippingInformation && <li>Shipping: {p.shippingInformation}</li>}
                        {p.returnPolicy && <li>Returns: {p.returnPolicy}</li>}
                    </ul>

                    {p.tags?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {p.tags.map((t) => (
                                <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs">{t}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {p.reviews?.length > 0 && (
                <div className="mt-6">
                    <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
                    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {p.reviews.map((r, i) => (
                            <li key={i} className="rounded-xl bg-white p-4 text-sm shadow-sm">
                                <p className="font-semibold">{r.reviewerName} · {r.rating}/5</p>
                                <p className="mt-1 text-gray-600">{r.comment}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}