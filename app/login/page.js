'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/components/context/AuthContext"

export default function Login() {
    const router = useRouter()
    const { login } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, remember_me: rememberMe })
            })

            const data = await res.json()

            if (res.ok) {
                login(data) 
                toast.success("Connexion réussie !")
                router.push("/")
            } else {
                toast.error(data.msg || "Erreur lors de la connexion")
            }
        } catch (error) {
            toast.error("Erreur serveur")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout headerStyle={1} breadcrumbTitle="Login">
            <section className="register login">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="block-text center">
                                <h3 className="heading">Login To Xpero</h3>
                                <p className="desc fs-20">Welcome back! Log In now to start trading</p>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="flat-tabs">
                                <div className="content-tab">
                                    <div className="content-inner">
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className="form-control"
                                                    placeholder="Please fill in the email form."
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group s1">
                                                <label>Password</label>
                                                <div className="input-group" style={{ position: "relative" }}>
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className="form-control"
                                                        placeholder="Please enter a password."
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                    />
                                                    <span
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        style={{
                                                            position: "absolute",
                                                            right: "15px",
                                                            top: "50%",
                                                            transform: "translateY(-50%)",
                                                            cursor: "pointer",
                                                            color: "#999"
                                                        }}
                                                    >
                                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="form-group form-check d-flex justify-content-between">
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={rememberMe}
                                                        onChange={() => setRememberMe(!rememberMe)}
                                                    />
                                                    <label className="form-check-label">Remember Me</label>
                                                </div>
                                                <Link href="/forgetPassword">
                                                    <p style={{ cursor: 'pointer' }}>Forgot Password?</p>
                                                </Link>
                                            </div>

                                            <button type="submit" className="btn-action" disabled={loading}>
                                                {loading ? "Logging in..." : "Login"}
                                            </button>

                                            <div className="bottom">
                                                <p>Not a member?</p>
                                                <Link href="/register">Register</Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}
