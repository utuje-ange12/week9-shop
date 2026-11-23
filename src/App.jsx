import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailsPage from "./pages/ProductDetailsPage"

const linkClass = ({ isActive }) =>
    isActive ? "font-bold text-gray-900" : "text-gray-500 hover:text-gray-900"

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-6xl">
                    <header className="flex items-center gap-3 p-4 pb-0 text-lg sm:p-6 sm:pb-0 sm:text-xl">
                        <NavLink to="/" end className={linkClass}>Products</NavLink>
                        <span className="text-gray-400">|</span>
                        <NavLink to="/categories" className={linkClass}>Categories</NavLink>
                    </header>

                    <Routes>
                        <Route path="/" element={<ProductsPage />} />
                        <Route path="/categories" element={<HomePage />} />
                        <Route path="/products/:id" element={<ProductDetailsPage />} />
                        <Route path="*" element={<p className="p-6">Page not found.</p>} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    )
}