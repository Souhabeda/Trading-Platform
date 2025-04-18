'use client'
import Link from "next/link"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { useState, useEffect } from "react";


const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    breakpoints: {
        0: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        768: {
            slidesPerView: 4,
            spaceBetween: 30,
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 60,
        },
    },
    slidesPerView: 4,
}

const newsList = [
    "📈 Bitcoin hits new ATH!",
    "💸 Ethereum gas fees drop 40%",
    "🚨 Fed announces new interest rates",
    "🪙 XRP surges 10% overnight",
    "🌐 Market volatility increases due to global events"
  ];

export default function Banner1() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % newsList.length);
      }, 1000); // Change every 1s
  
      return () => clearInterval(interval); // Cleanup
    }, []);
  
    return (
        <>

            <section className="banner">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 col-md-12">
                            <div className="banner__content">
                                <h2 className="title">A Trusted and Secure AI Assistant for Smarter Forex Trading</h2>
                                <p className="fs-20 desc">
                                AI-powered insights and tools to help you trade smarter, faster, and safer.
                                </p>
                                <Link href="/login" className="btn-action"><span>Start trading</span></Link>
                            </div>
                        </div>
                        <div className="col-xl-6 col-md-12">
                            <div className="banner__image">
                                <img src="/assets/images/layout/banner-01.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="news-notification">
                    {newsList[index]}
                </div>
            </section>
        </>
    )
}
