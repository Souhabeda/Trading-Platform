'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MainMenu() {
    const pathname = usePathname()
    const [currentMenuItem, setCurrentMenuItem] = useState("")
    const [user, setUser] = useState(null)

    useEffect(() => {
        setCurrentMenuItem(pathname)
        const token = localStorage.getItem('token')
        setUser(!!token)
    }, [pathname])

  
    const checkCurrentMenuItem = (path) =>
        currentMenuItem === path ? "current-item" : ""
    const checkParentActive = (paths) =>
        paths.some(path => currentMenuItem.startsWith(path)) ? "current-menu-item" : ""

    return (
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

                    {/* <li className={`menu-item ${pathname === "/wallet" ? "current-menu-item" : ""}`}>
                        <Link href="/wallet">Wallet</Link>
                    </li> */}

                    <li className={`menu-item ${pathname === "/risk_disclosure" ? "current-menu-item" : ""}`}>
                        <Link href="/risk_disclosure">Risk Disclosure</Link>
                    </li>
                </>
            )}

            <li className={`menu-item ${checkCurrentMenuItem("/contact")}`}>
                <Link href="/contact">Contact</Link>
            </li>
           
        </ul>
    )
}
