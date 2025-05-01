"use client"

import Layout from "@/components/layout/Layout"
import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const { name, email, subject, message } = form
        if (!name || !email || !subject || !message) {
            return toast.error("Tous les champs sont requis.")
        }

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contact`, form)
            toast.success(res.data.message || "Message envoyé avec succès")
            setForm({ name: "", email: "", subject: "", message: "" })
        } catch (err) {
            toast.error(err.response?.data?.error || "Erreur lors de l'envoi du message")
        }
    }

    return (
        <Layout headerStyle={1} footerStyle={2} breadcrumbTitle="Contact">
            <section className="contact">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 col-md-12">
                            <div className="image">
                                <img src="/assets/images/layout/contact.png" alt="contact" />
                            </div>
                        </div>
                        <div className="col-xl-6 col-md-12">
                            <div className="contact-main">
                                <div className="block-text center">
                                    <h3 className="heading">Leave a message for us</h3>
                                    <p className="desc fs-20">Get in touch with Xpero</p>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Your name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter your name"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Subject</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter subject"
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Message</label>
                                        <textarea
                                            className="form-control"
                                            placeholder="Enter your message"
                                            name="message"
                                            rows={10}
                                            value={form.message}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn-action">Send message</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}
