import { api } from "./client"

export async function fetchProducts({ limit = 12, skip = 0, signal } = {}) {
    const { data } = await api.get("/products", { params: { limit, skip }, signal })
    return data
}

export async function fetchProduct(id, { signal } = {}) {
    const { data } = await api.get(`/products/${id}`, { signal })
    return data
}

export async function fetchCategories({ signal } = {}) {
    const { data } = await api.get("/products/category-list", { signal })
    return data
}

export async function fetchProductsByCategory(category, { limit = 12, skip = 0, signal } = {}) {
    const { data } = await api.get(`/products/category/${category}`, {
        params: { limit, skip },
        signal,
    })
    return data
}

export async function searchProducts(q, { limit = 12, skip = 0, signal } = {}) {
    const { data } = await api.get("/products/search", { params: { q, limit, skip }, signal })
    return data
}

export async function createProduct(product) {
    const { data } = await api.post("/products/add", product)
    return data
}

export async function deleteProduct(id) {
    const { data } = await api.delete(`/products/${id}`)
    return data
}