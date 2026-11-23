export default function ProductCard({ product, onSelect, onDelete }) {
    const { title, description, category, price, discountPercentage, rating, thumbnail } = product
    const finalPrice = discountPercentage ? price * (1 - discountPercentage / 100) : null

    return (
        <li className="flex flex-col rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
            {thumbnail ? (
                <img src={thumbnail} alt={title} className="h-40 w-full object-contain" />
            ) : (
                <div className="flex h-40 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                    No image
                </div>
            )}

            {onSelect ? (
                <button onClick={onSelect} className="mt-3 text-left text-sm font-bold hover:underline">
                    {title}
                </button>
            ) : (
                <p className="mt-3 text-sm font-bold">{title}</p>
            )}

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

            {onDelete && (
                <button onClick={onDelete} className="mt-2 self-start text-xs text-red-600 hover:underline">
                    Delete
                </button>
            )}
        </li>
    )
}