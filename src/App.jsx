import { useState } from "react"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"

export default function App() {
  const hasUrlState = window.location.search.length > 0
  const [tab, setTab] = useState(hasUrlState ? "products" : "home")

  return (
      <div className="mx-auto max-w-5xl">
        <nav className="flex gap-4 border-b p-4">
          <button onClick={() => setTab("home")} className={tab === "home" ? "font-bold" : ""}>Home</button>
          <button onClick={() => setTab("products")} className={tab === "products" ? "font-bold" : ""}>Products</button>
        </nav>
        {tab === "home" ? <HomePage /> : <ProductsPage />}
      </div>
  )
}