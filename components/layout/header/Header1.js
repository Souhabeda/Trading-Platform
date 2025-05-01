"use client"

import { useEffect, useState } from 'react'
import { Menu } from '@headlessui/react'
import dynamic from 'next/dynamic'
import Link from "next/link"
import MainMenu from '../Menu'
import MobileMenu from '../MobileMenu'
import { useRouter } from 'next/navigation'
import moment from "moment";

const ThemeSwitch = dynamic(() => import('@/components/elements/ThemeSwitch'), {
    ssr: false,
})

export default function Header1({ scroll, isMobileMenu, handleMobileMenu }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [lastLogin, setLastLogin] = useState(null)
    const [notifications, setNotifications] = useState([]);
    const [hasNewNotification, setHasNewNotification] = useState(false);

    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        const lastLoginStored = localStorage.getItem("lastLogin")
        setIsAuthenticated(!!token)
        console.log("lastLogin from storage:", lastLoginStored) // 🐞
        if (lastLoginStored) {
            setLastLogin(lastLoginStored)
        }
    }, [])

    useEffect(() => {
        // Fonction de polling pour récupérer les nouvelles actualités
        const fetchNewArticles = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/news/update`, {
                    method: "POST",
                });
                const data = await res.json();

                if (data.new_articles && data.new_articles.length > 0) {
                    const newNotif = { message: `➕ ${data.added} new Kitco news updates are now available.` };
                    setNotifications(prev => [...prev, newNotif]);
                    setHasNewNotification(true);
                }
            } catch (error) {
                console.error("Error fetching new articles:", error);
            }
        };


        // Appel de la fonction au lancement
        fetchNewArticles();

        // Polling toutes les 30 secondes
        const intervalId = setInterval(fetchNewArticles, 30000);

        return () => clearInterval(intervalId); // Nettoyer l'intervalle quand le composant est démonté
    }, [notifications]);  // Ajoute `notifications` dans les dépendances

    const handleLogout = (e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        localStorage.removeItem('lastLogin')
        setIsAuthenticated(false)
        router.push('/login')
        router.refresh()
    }


    return (
        <header id="header_main" className={`header ${scroll ? "is-fixed is-small" : ""}`}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="header__body d-flex justify-content-between">
                            <div className="header__left">
                                <div className="logo">
                                    <Link className="light" href="/">
                                        <img src="/assets/images/logo/logo.png" alt="logo" width={118} height={32} />
                                    </Link>
                                    <Link className="dark" href="/">
                                        <img src="/assets/images/logo/logo-dark.png" alt="logo dark" width={118} height={32} />
                                    </Link>
                                </div>
                                <div className="left__main">
                                    <div className="d-none d-lg-block">
                                        <nav id="main-nav" className="main-nav">
                                            <MainMenu />
                                        </nav>
                                    </div>
                                </div>
                            </div>

                            <div className="header__right">
                                <ThemeSwitch />
                                <div className="d-none d-lg-flex items-center">
                                    {/* <Menu as="div" className="menu-container">
                                    <div>
                                        <Menu.Button className="menu-button">Assets</Menu.Button>
                                    </div>
                                    <Menu.Items className="menu-items">
                                        <div className="menu-divider">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link href="#" className={`menu-link ${active ? 'active' : ''}`}>
                                                        Binance Visa Card
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link href="#" className={`menu-link ${active ? 'active' : ''}`}>
                                                        Crypto Loans
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link href="#" className={`menu-link ${active ? 'active' : ''}`}>
                                                        Binance Pay
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Menu> */}

                                    {/* Orders & Trades Dropdown */}
                                    {/* <Menu as="div" className="menu-container">
                                    <div>
                                        <Menu.Button className="menu-button">Orders & Trades</Menu.Button>
                                    </div>
                                    <Menu.Items className="menu-items">
                                        <div className="menu-divider">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link href="#" className={`menu-link ${active ? 'active' : ''}`}>
                                                        Binance Convert
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link href="#" className={`menu-link ${active ? 'active' : ''}`}>
                                                        Spot
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link href="#" className={`menu-link ${active ? 'active' : ''}`}>
                                                        Margin
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link href="#" className={`menu-link ${active ? 'active' : ''}`}>
                                                        P2P
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Menu> */}

                                    {/* Language Dropdown */}
                                    <Menu as="div" className="menu-container">
                                        <div>
                                            <Menu.Button className="menu-button">EN/USD</Menu.Button>
                                        </div>
                                        <Menu.Items className="menu-items">
                                            <div className="menu-divider">
                                                {[
                                                    { src: "/assets/images/flags/us.jpg", label: "English" },
                                                    { src: "/assets/images/flags/spain.jpg", label: "Spanish" },
                                                    { src: "/assets/images/flags/germany.jpg", label: "German" },
                                                    { src: "/assets/images/flags/italy.jpg", label: "Italian" },
                                                    { src: "/assets/images/flags/russia.jpg", label: "Russian" }
                                                ].map((lang, index) => (
                                                    <Menu.Item key={index}>
                                                        {({ active }) => (
                                                            <Link href="#" className={`menu-link language ${active ? 'active' : ''}`}>
                                                                <img src={lang.src} alt={lang.label} height={12} />
                                                                <span>{lang.label}</span>
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </div>
                                        </Menu.Items>
                                    </Menu>
                                </div>
                                {/* Wallet and User Dropdown */}
                                {isAuthenticated && (
                                    <>
                                        <div>
                                            {/* Notification Dropdown */}
                                            <Menu as="div" className="menu-container">
                                                <div>
                                                    <Menu.Button className="menu-button relative">
                                                        <span className="icon-notification" />
                                                        {hasNewNotification && (
                                                            <span className="notif-indicator"></span>
                                                        )}
                                                    </Menu.Button>
                                                </div>
                                                <Menu.Items className="menu-items">
                                                    <div className="menu-divider">
                                                        {/* Notifications News — affichée uniquement s'il y en a */}
                                                        {notifications.length > 0 && (
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <div className="menu-link server-log">
                                                                        <div className="data-info">
                                                                            <h6>News Updates</h6>
                                                                            {notifications.map((notif, index) => (
                                                                                <p key={index}>{notif.message}</p>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Menu.Item>
                                                        )}

                                                        {/* Server Rebooted */}
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <div className="menu-link server-log">
                                                                    <span>🖥️</span>
                                                                    <div className="data-info">
                                                                        <h6>Server Rebooted</h6>
                                                                        <p>
                                                                            {lastLogin
                                                                                ? moment(lastLogin).fromNow()
                                                                                : "Inconnu"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                </Menu.Items>
                                            </Menu>
                                        </div>
                                        <div>
                                            <Menu as="div" className="menu-container">
                                                <div className="wallet">
                                                    <Menu.Button className="menu-button img">
                                                        <img id="blah" className="wallet-user-profile" src="/assets/images/avt/avt.png" alt="user avatar" />
                                                        <span className="status-indicator"></span>
                                                    </Menu.Button>
                                                </div>
                                                <Menu.Items className="menu-items">
                                                    <div className="menu-divider">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <Link href="/user-profile" className={`menu-link ${active ? 'active' : ''}`}>
                                                                    <i className="bx bx-user" />
                                                                    <span>Profile</span>
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <Link href="#" className={`menu-link ${active ? 'active' : ''}`}>
                                                                    <i className="bx bx-wallet" />
                                                                    <span>My Wallet</span>
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                        {/* <Menu.Item>
                                                        {({ active }) => (
                                                            <Link href="#" className={`menu-link ${active ? 'active' : ''}`}>
                                                                <i className="bx bx-wrench" />
                                                                <span>Settings</span>
                                                            </Link>
                                                        )}
                                                    </Menu.Item> */}
                                                        <div className="menu-divider" />
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <Link href="/login" className={`menu-link text-danger ${active ? 'active' : ''}`} onClick={handleLogout}>
                                                                    <i className="bx bx-power-off" />
                                                                    <span>Logout</span>
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                </Menu.Items>
                                            </Menu>
                                        </div>
                                    </>
                                )}
                                <div className="d-block d-lg-none">
                                    <div className={`mobile-button d-block ${isMobileMenu ? "active" : ""}`} onClick={handleMobileMenu}>
                                        <span />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <MobileMenu isMobileMenu={isMobileMenu} />
        </header>
    )
}
