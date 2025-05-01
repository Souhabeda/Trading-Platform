'use client';
import Link from "next/link";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import axios from "axios";

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    breakpoints: {
        0: { slidesPerView: 2, spaceBetween: 30 },
        768: { slidesPerView: 4, spaceBetween: 30 },
        1024: { slidesPerView: 4, spaceBetween: 60 },
    },
    slidesPerView: 4,
}


export default function Banner1() {
    const [newsList, setNewsList] = useState([]);
    const [index, setIndex] = useState(0);
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/news`);
                const summaries = res.data.map(article => ({
                    summary: article.summary,
                    sentiment: article.sentiment // Ajouté ici
                }));
                setNewsList(summaries);
            } catch (err) {
                console.error("Erreur lors de la récupération des news:", err);
                setNewsList([{ summary: "Erreur lors de la récupération des actualités.", sentiment: "😐" }]);
            }
        };

        fetchNews();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % newsList.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [newsList]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setUser(!!token);
    }, []);

    return (
        <section className="banner">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-md-12">
                        <div className="banner__content">
                            <h2 className="title">A Trusted and Secure AI Assistant for Smarter Forex Trading</h2>
                            <p className="fs-20 desc">
                                AI-powered insights and tools to help you trade smarter, faster, and safer.
                            </p>

                            {/* Bouton visible seulement si non connecté */}
                            {!user && (
                                <Link href="/login" className="btn-action">
                                    <span>Start trading</span>
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-6 col-md-12">
                        <div className="banner__image">
                            <img src="/assets/images/layout/banner-01.png" alt="Banner" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="news-notification">
            {newsList.length > 0 ? (
                    <span>
                        <strong>{newsList[index].sentiment}</strong> {newsList[index].summary}
                    </span>
                ) : (
                    "Chargement des actualités..."
                )}
            </div>
        </section>
    )
}
