"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgetPassword"]

export default function ProtectedLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")

    // Si pas de token et route privée → redirect
    if (!token && !PUBLIC_ROUTES.includes(pathname)) {
      router.push("/login")
      return
    }

    // Si route publique, pas besoin de vérifier
    if (PUBLIC_ROUTES.includes(pathname)) {
      setIsLoading(false)
      return
    }

    // Sinon → vérifier avec le backend
    const verifyToken = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/protected`, {
          headers: {
            "Authorization": token, "ngrok-skip-browser-warning": "skip" 
          }
        })

        if (res.status !== 200) {
          localStorage.removeItem("token")
          router.push("/login")
        } else {
          setIsLoading(false)
        }
      } catch (err) {
        console.error(err)
        router.push("/login")
      }
    }

    verifyToken()
  }, [pathname])

  if (isLoading && !PUBLIC_ROUTES.includes(pathname)) {
    return <div>Chargement...</div>
  }

  return children
}
