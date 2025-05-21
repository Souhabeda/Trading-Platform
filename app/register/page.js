'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import 'react-phone-input-2/lib/style.css'
import PhoneInput from 'react-phone-input-2'
import 'react-country-state-city/dist/react-country-state-city.css'
import { CountrySelect } from 'react-country-state-city'
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

export default function Register() {
    const router = useRouter()

    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        re_password: "",
        username: "",
        country: "",
        phone: ""
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handlePhoneChange = (phone) => {
        setFormData({ ...formData, phone })
    }

    const handleCountryChange = (e) => {
        setFormData({ ...formData, country: e.iso2.toUpperCase() })  // ex: FR, TN
    }

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    const isStrongPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
        return regex.test(password)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // VALIDATION FRONT-END
        if (!isValidEmail(formData.email)) {
            toast.error("Invalid email format.")
            return
        }

        if (!isStrongPassword(formData.password)) {
            toast.error("Weak password: minimum 8 characters, including uppercase, lowercase, number, and special character.")
            return
        }

        if (formData.password !== formData.re_password) {
            toast.error("Passwords do not match.")
            return
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json","ngrok-skip-browser-warning": "skip"  },
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password,
                    re_password: formData.re_password,
                    country: formData.country,
                    phone: `+${formData.phone}`
                })
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.msg || "Unknown error.")
            } else {
                toast.success("Registration successful ! Redirecting...")
                setFormData({
                    email: "",
                    first_name: "",
                    last_name: "",
                    password: "",
                    re_password: "",
                    username: "",
                    country: "",
                    phone: ""
                })
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            }

        } catch (err) {
            console.error("Network error:", err)
            toast.error("Server connection error.")
        }
    }

    return (
        <Layout headerStyle={1} footerStyle={2} breadcrumbTitle="Register">
            <ToastContainer />
            <div>
                <section className="register">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="block-text center">
                                    <h3 className="heading">Register To Xpero</h3>
                                    <p className="desc fs-20">Register in advance and enjoy the event benefits</p>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="flat-tabs">
                                    <div className="content-tab">
                                        <div className="content-inner">
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-group">
                                                    <label>Email</label>
                                                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>First Name</label>
                                                    <input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handleChange} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Last Name</label>
                                                    <input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handleChange} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Password</label>
                                                    <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                                                    <br />
                                                    <label>Re-enter Password</label>
                                                    <input type="password" name="re_password" className="form-control" value={formData.re_password} onChange={handleChange} required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Country</label>
                                                    <div className="country-horizontal-wrapper">
                                                        <CountrySelect
                                                            onChange={handleCountryChange}
                                                            placeHolder="Select your country"
                                                            className="country-horizontal"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label>Phone</label>
                                                    <PhoneInput
                                                        country={'tn'}
                                                        value={formData.phone}
                                                        onChange={handlePhoneChange}
                                                        inputClass="form-control"
                                                        containerClass="phone-input-container"
                                                        inputStyle={{ width: '100%', padding: '22px 0 22px 50px' }}
                                                        dropdownStyle={{ zIndex: 9999 }}
                                                    />
                                                </div>
                                                <button type="submit" className="btn-action">Pre-Registration</button>
                                                <div className="bottom">
                                                    <p>Already have an account?</p>
                                                    <Link href="/login">Login</Link>
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
