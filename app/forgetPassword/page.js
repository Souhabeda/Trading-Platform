'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useState } from "react"
import { toast } from "react-toastify"

export default function ForgetPassword() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email) {
            toast.error("Veuillez entrer votre adresse e-mail.")
            return
        }

        setLoading(true)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/forgetPassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "skip"
                },
                body: JSON.stringify({ email }),
            })

            console.log("Statut HTTP:", res.status)

            const data = await res.json()
 

            if (res.ok) {
                toast.success(data.msg || "Message envoyé avec succès.")
                setEmail("")
            } else {
                toast.error(data.msg || "Erreur lors de l'envoi.")
            }

        } catch (err) {
            console.error("Erreur réseau ou backend :", err)
            toast.error("Erreur serveur. Veuillez réessayer.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout headerStyle={1} footerStyle={2} breadcrumbTitle="Forgot Password">
            <div>
                <section className="register login">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="block-text center">
                                    <h3 className="heading">Forgot Your Password?</h3>
                                    <p className="desc fs-20">
                                        Enter your email to reset your password.
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-12">
                                <div className="flat-tabs">
                                    <div className="content-tab">
                                        <div className="content-inner">
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-group">
                                                    <label htmlFor="email">Email Address</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="email"
                                                        placeholder="Please enter your email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>

                                                <button type="submit" className="btn-action" disabled={loading}>
                                                    {loading ? "Sending..." : "Send Reset Link"}
                                                </button>

                                                <div className="bottom mt-3">
                                                    <p>Remembered your password?</p>
                                                    <Link href="/login">Back to Login</Link>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    )
}
