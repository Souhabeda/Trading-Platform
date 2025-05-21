"use client"

import { useEffect, useState } from 'react'
import { Menu } from '@headlessui/react'
import dynamic from 'next/dynamic'
import Link from "next/link"
import MainMenu from '../Menu'
import MobileMenu from '../MobileMenu'
import { useRouter } from 'next/navigation'
import moment from "moment";
import io from "socket.io-client"

const ThemeSwitch = dynamic(() => import('@/components/elements/ThemeSwitch'), {
    ssr: false,
})

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL)

export default function Header1({ scroll, isMobileMenu, handleMobileMenu }) {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [lastLogin, setLastLogin] = useState(null)
    const [notifications, setNotifications] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);
    const [gender, setGender] = useState(null);
    const [newCount, setNewCount] = useState(0);
    const [notificationForex, setNotificationsForex] = useState([]);


    const hasNewNotification = newCount > 0;

    const router = useRouter()

    useEffect(() => {
        const pic = localStorage.getItem("profile_picture");
        const gender = localStorage.getItem("gender");

        console.log("Image depuis localStorage:", pic);
        console.log("Gender depuis localStorage:", gender);

        if (pic) setProfilePicture(pic);
        if (gender) setGender(gender);
    }, []);

    // 🔌 Connexion WebSocket pour les news Kitco
    useEffect(() => {
        socket.on("connect", () => {
            console.log("🟢 WebSocket connected.");
        })

        socket.on("new_news_update", (data) => {
            console.log("🆕 New news item received via WebSocket:", data);
            const newNotif = { message: `➕ ${data.articles.length} New Kitco news.` };
            setNotifications(prev => [...prev, newNotif]);
            setNewCount(prev => prev + 1);
        })

        return () => {
            socket.off("connect");
            socket.off("new_news_update");
        }
    }, []);

    // 🔁 Polling fallback pour Kitco news (si WebSocket rate)
    useEffect(() => {
        const fetchNewArticles = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get_latest_news`, {
                    headers: { "ngrok-skip-browser-warning": "skip" },
                });
                const data = await res.json();

                if (data.new_articles && data.new_articles.length > 0) {
                    const newNotif = { message: `➕ ${data.new_articles.length} nouvelles actualités Kitco.` };
                    setNotifications(prev => [...prev, newNotif]);
                    setNewCount(prev => prev + 1);
                }
            } catch (error) {
                console.error("Error retrieving Kitco news :", error);
            }
        };

        fetchNewArticles();
        const intervalId = setInterval(fetchNewArticles, 60000); // 1 min

        return () => clearInterval(intervalId);
    }, []);

    // 🔁 Polling pour Forex news
    useEffect(() => {
        const fetchNewNews = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/forex-news/new`, {
                    headers: { "ngrok-skip-browser-warning": "skip" },
                });
                const data = await res.json();

                const lastCheck = localStorage.getItem("lastNewsCheck");
                const now = new Date().toISOString();

                const newNews = data.new_forex_news.filter((news) => {
                    return !lastCheck || news.created_at > lastCheck;
                });

                setNewCount(prev => prev + newNews.length);
                setNotificationsForex(newNews);
            } catch (error) {
                console.error("Error retrieving Forex news :", error);
            }
        };

        fetchNewNews();
        const interval = setInterval(fetchNewNews, 60000); // 1 min

        return () => clearInterval(interval);
    }, []);

    // 📌 Marquer comme lues
    const clearNotifications = () => {
        const now = new Date().toISOString();
        localStorage.setItem("lastNewsCheck", now);
        setNewCount(0);
        setNotificationsForex([]);
        setNotifications([]);
    };

    useEffect(() => {
        const token = localStorage.getItem("token")
        const lastLoginStored = localStorage.getItem("lastLogin")
        setIsAuthenticated(!!token)
        if (lastLoginStored) {
            setLastLogin(lastLoginStored)
        }
    }, [])

    const handleLogout = (e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        localStorage.removeItem('lastLogin')
        setIsAuthenticated(false)
        router.push('/login')
        router.refresh()
    }

    const defaultAvatar =
        gender === "female"
            ? "/assets/images/avt/avtf.png"
            : "/assets/images/avt/avt.png";


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
                                    {/* Bouton visible seulement si non connecté */}
                                    <Menu as="div" className="menu-container">
                                        {!isAuthenticated && (
                                            <div>
                                                <Link href="/login">
                                                    <Menu.Button className="menu-button login">Login</Menu.Button></Link>
                                            </div>

                                        )}
                                    </Menu>
                                </div>
                                {isAuthenticated && (
                                    <>
                                        <div>
                                            {/* Notification Dropdown */}
                                            <Menu as="div" className="menu-container">
                                                <Menu.Button className="menu-button relative" onClick={clearNotifications}>
                                                    <span className="icon-notification" />
                                                    {hasNewNotification && (
                                                        <span className="notif-indicator"></span>
                                                    )}
                                                </Menu.Button>
                                                <Menu.Items className="menu-items">
                                                    <div className="menu-divider">
                                                        {/* Notifications News kitco — affichée uniquement s'il y en a */}
                                                        {/* 📰 Kitco News Updates */}
                                                        {notifications.length > 0 ? (
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <div className="menu-link server-log">
                                                                        <div className="data-info">
                                                                            <h6>📰 Kitco News Updates</h6>
                                                                            {notifications.map((notif, index) => (
                                                                                <p key={index}>{notif.message}</p>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Menu.Item>
                                                        ) : (
                                                            // Affichage d'un message si aucune nouvelle notification Kitco
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <div className="menu-link">
                                                                        <div className="data-info">
                                                                            <h6>📰 Kitco News Updates</h6>
                                                                            <p>No new Kitco news available.</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Menu.Item>
                                                        )}
                                                        {/* 📈 Forex News Updates */}
                                                        {(Array.isArray(notificationForex) && notificationForex.length > 0) ? (
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <div className="menu-link server-log">
                                                                        <div className="data-info">
                                                                            <h6>📊 Forex News Updates</h6>
                                                                            {notificationForex.map((notif, index) => (
                                                                                <p key={index}>
                                                                                    <strong>{notif.Currency}</strong> : {notif.Event} à {notif.Time}
                                                                                </p>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Menu.Item>
                                                        ) : (
                                                            // Affichage d'un message si aucune nouvelle notification Forex
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <div className="menu-link">
                                                                        <div className="data-info">
                                                                            <h6>📊 Forex News Updates</h6>
                                                                            <p>No new Forex news available.</p>
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
                                                        <img
                                                            id="blah"
                                                            className="wallet-user-profile"
                                                            src={profilePicture || defaultAvatar}
                                                            alt="user avatar"
                                                        />
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

            <MobileMenu isMobileMenu={isMobileMenu} notificationForex={notificationForex || []} notifications={notifications || []} lastLogin={lastLogin} />
        </header>
    )
}
