'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Vérifier le token auprès du serveur
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          setUser({ ...data.user, token }) // tu peux stocker plus d'infos utilisateur si besoin
        } else {
          logout()
        }
      })
      .catch(() => {
        logout()
      })
      .finally(() => {
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  const login = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem("lastLogin", data.last_login)
    setUser({ token: data.token })
  }
  

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login') // Redirige vers login après déconnexion
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
