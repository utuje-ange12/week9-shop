import { useEffect, useState } from "react"

export function useUrlParam(name, fallback = "") {
    const [value, setValue] = useState(
        () => new URLSearchParams(window.location.search).get(name) ?? fallback
    )

    useEffect(() => {
        const url = new URL(window.location.href)
        if (value === fallback || value === "") url.searchParams.delete(name)
        else url.searchParams.set(name, value)
        window.history.replaceState(null, "", url)
    }, [name, value, fallback])

    return [value, setValue]
}