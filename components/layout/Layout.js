'use client'
import { useEffect, useState } from "react"
import AddClassBody from "../elements/AddClassBody"
import BackToTop from '../elements/BackToTop'
import Breadcrumb from './Breadcrumb'
import Footer2 from './footer/Footer2'
import Header1 from "./header/Header1"
import AOS from 'aos'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Chatbot from "../chatbot/Chatbot"

export default function Layout({ breadcrumbTitle, children }) {
    const [scroll, setScroll] = useState(0)
    const [isMobileMenu, setMobileMenu] = useState(false)
    const handleMobileMenu = () => setMobileMenu(!isMobileMenu)

    useEffect(() => {
        AOS.init()
        document.addEventListener("scroll", () => {
            const scrollCheck = window.scrollY > 100
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck)
            }
        })
    }, [])

    return (
        <>
            <div id="top" />
            <AddClassBody />
            <Chatbot />
            
            <Header1 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} />

            {breadcrumbTitle && <Breadcrumb breadcrumbTitle={breadcrumbTitle} />}
            
            {children}

            <Footer2 />

            <BackToTop target="#top" />
            <ToastContainer />
        </>
    )
}
