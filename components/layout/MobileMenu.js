'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RiArrowDownSFill } from "react-icons/ri";

export default function MobileMenu({ isMobileMenu }) {
    const [isActive, setIsActive] = useState(0)
     const [user, setUser] = useState(null)
     const pathname = usePathname()
     const [currentMenuItem, setCurrentMenuItem] = useState("")

    const handleClick = (key) => {
        setIsActive(prevState => prevState === key ? null : key)
    }
    const checkCurrentMenuItem = (path) => currentMenuItem === path ? "current-item" : ""
    const checkParentActive = (paths) => paths.some(path => currentMenuItem.startsWith(path)) ? "current-menu-item" : ""


    useEffect(() => {
        setCurrentMenuItem(pathname)
        const token = localStorage.getItem('token')
        setUser(!!token)
    }, [pathname])



    return (
        <>
            <nav id="main-nav-mobi" className="main-nav" style={{ display: `${isMobileMenu ? "block" : "none"}` }}>
                <ul id="menu-primary-menu" className="menu">
                    <li className={`menu-item ${pathname === "/" ? "current-menu-item" : ""}`}>
                    <Link href="/">Home</Link>
                    </li>
                {user && (
                <>
                    <li className={`menu-item ${checkParentActive(["/buy-crypto-select"])}`}>
                        <Link href="/buy-crypto-select">Activity</Link>
                    </li>

                    <li className={`menu-item ${pathname === "/markets" ? "current-menu-item" : ""}`}>
                        <Link href="/markets">Markets</Link>
                    </li>

                    <li className={`menu-item ${pathname === "/wallet" ? "current-menu-item" : ""}`}>
                        <Link href="/wallet">Wallet</Link>
                    </li>

                    <li className={`menu-item ${pathname === "/risk_disclosure" ? "current-menu-item" : ""}`}>
                        <Link href="/risk_disclosure">Risk Disclosure</Link>
                    </li>
                    <li className={`menu-item menu-item-has-children ${checkParentActive(["/user-profile",
                        "/logout"
                    ])}`}>
                        <Link href="#"> Profile </Link>
                        <RiArrowDownSFill className="arrow" onClick={() => handleClick(5)}/>
                        
                        <ul className="sub-menu" style={{ display: `${isActive == 5 ? "block" : "none"}` }}>
                            <li className={`menu-item ${checkCurrentMenuItem("/user-profile")}`}>
                                <Link href="/user-profile">User Profile</Link>
                            </li>
                            <li className={`menu-item ${checkCurrentMenuItem("/logout")}`}>
                                <Link href="/login">Logout</Link>
                            </li>
                        </ul>
                    </li>
                </>
                )}
            
            <li className={`menu-item ${checkCurrentMenuItem("/contact")}`}>
                <Link href="/contact">Contact</Link>
            </li>
                  
                   
                   
                </ul>
            </nav>

        </>
    )
}
