import { useState } from "react"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"

export default function App() {
    const hasUrlState = window.location.search.length > 0
    const [tab, setTab] = useState(hasUrlState ? "products" : "home")

    const tabClass = (name) =>
        tab === name ? "font-bold text-gray-900" : "text-gray-500 hover:text-gray-900"

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-6xl">
                <header className="flex items-center gap-3 p-6 pb-0 text-xl">
                    <button onClick={() => setTab("products")} className={tabClass("products")}>
                        Products
                    </button>
                    <span className="text-gray-400">|</span>
                    <button onClick={() => setTab("home")} className={tabClass("home")}>
                        Categories
                    </button>
                </header>
                {tab === "home" ? <HomePage /> : <ProductsPage />}
            </div>
        </div>
    )
}