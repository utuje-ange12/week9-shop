import { Link } from "react-router-dom"

export default function ProductCard({ product, onDelete }) {
    const { id, title, description, category, price, discountPercentage, rating, thumbnail } = product
    const finalPrice = discountPercentage ? price * (1 - discountPercentage / 100) : null

    return (
        <li className="flex flex-col rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
            <Link to={`/products/${id}`}>
                {thumbnail ? (
                    <img src={thumbnail} alt={title} className="h-40 w-full object-contain" />
                ) : (
                    <div className="flex h-40 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                        No image
                    </div>
                )}
            </Link>

            <Link to={`/products/${id}`} className="mt-3 text-sm font-bold hover:underline">
                {title}
            </Link>

            {description && <p className="mt-1 line-clamp-3 text-xs text-gray-600">{description}</p>}
            {category && <span className="mt-1 text-xs font-semibold text-gray-800">{category}</span>}

            <div className="mt-auto flex items-center justify-between pt-3 text-xs">
                <div>
                    {finalPrice ? (
                        <>
                            <span className="text-gray-400 line-through">${price}</span>{" "}
                            <span className="font-bold text-green-600">${finalPrice.toFixed(2)}</span>
                        </>
                    ) : (
                        <span className="font-bold">${price}</span>
                    )}
                </div>
                {rating && <span className="text-gray-500">Rating: {rating}</span>}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
                <Link to={`/products/${id}`} className="text-blue-600 hover:underline">
                    View details
                </Link>
                {onDelete && (
                    <button onClick={onDelete} className="text-red-600 hover:underline">
                        Delete
                    </button>
                )}
            </div>
        </li>
    )
}