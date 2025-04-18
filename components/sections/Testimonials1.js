
'use client'
import { useState } from 'react'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
export default function Testimonials1() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null)

    // Swiper options for the main slider
    const mainSwiperOptions = {
        spaceBetween: 10,
        thumbs: { swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null },
        modules: [FreeMode, Navigation, Thumbs],
    }

    // Swiper options for the thumbnail slider
    const thumbnailSwiperOptions = {
        modules: [FreeMode, Navigation, Thumbs],
        spaceBetween: 10,
        slidesPerView: 3,
        freeMode: true,
        watchSlidesProgress: true,
    }
    return (
        <>

            <section className="testimonials">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 col-md-12">
                            <div className="block-text">
                                <h3 className="heading">Our customers love what we do</h3>
                                <h6 className="fs-20">
                                Turn Trading Ideas Into Action with Xpero 
                                </h6>
                                <p>
                                Cluttered data can distract even experienced traders.
                                Xpero simplifies the trading experience with clean, 
                                insightful AI analysis so you can act fast and trade smart.
                                </p>
                                <div className="swiper swiper-thumb1">
                                    <Swiper {...thumbnailSwiperOptions} onSwiper={setThumbsSwiper} className="swiper-wrapper list-img">
                                        <SwiperSlide>
                                            <img src="/assets/images/avt/avt-02.png" alt="" />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src="/assets/images/avt/avt-03.png" alt="" />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src="/assets/images/avt/avt-04.png" alt="" />
                                        </SwiperSlide>
                                    </Swiper>
                                </div>
                                <div className="couter">
                                    <h6>30+</h6>
                                    <p className="title">Customer Reviews</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-md-12">
                            <div className="swiper swiper-testimonial-1">
                                <Swiper {...mainSwiperOptions} className="swiper-wrapper">
                                    <SwiperSlide>
                                        <div className="testimonials-box">
                                            <span className="icon-quote" />
                                            <h6 className="text">
                                                “Amazing platform! Xpero made learning and using AI in Forex trading incredibly easy.
                                                The insights were clear, the tools were intuitive, and I was able to start making smarter trades right away.
                                                Highly recommend it for anyone serious about leveling up their trading.”
                                            </h6>
                                            <div className="bottom">
                                                <div className="info">
                                                    <img src="/assets/images/avt/avt-02.png" alt="" />
                                                    <div className="content">
                                                        <h6 className="name">Johnny Andro</h6>
                                                        <p className="position">Director, Company</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="testimonials-box">
                                            <span className="icon-quote" />
                                            <h6 className="text">
                                            “Amazing platform! Xpero made learning and using AI in Forex trading incredibly easy.
                                             The insights were clear, the tools were intuitive, and I was able to start making smarter trades right away.
                                             Highly recommend it for anyone serious about leveling up their trading.”
                                            </h6>
                                            <div className="bottom">
                                                <div className="info">
                                                    <img src="/assets/images/avt/avt-03.png" alt="" />
                                                    <div className="content">
                                                        <h6 className="name">Johnny Andro</h6>
                                                        <p className="position">Director, Company</p>
                                                    </div>
                                                </div>
                                                <img src="/assets/images/partner/logo-05.png" alt="" />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <div className="testimonials-box">
                                            <span className="icon-quote" />
                                            <h6 className="text">
                                            “Amazing platform! Xpero made learning and using AI in Forex trading incredibly easy.
                                             The insights were clear, the tools were intuitive, and I was able to start making smarter trades right away.
                                             Highly recommend it for anyone serious about leveling up their trading.”
                                            </h6>
                                            <div className="bottom">
                                                <div className="info">
                                                    <img src="/assets/images/avt/avt-04.png" alt="" />
                                                    <div className="content">
                                                        <h6 className="name">Johnny Andro</h6>
                                                        <p className="position">Director, Company</p>
                                                    </div>
                                                </div>
                                                <img src="/assets/images/partner/logo-05.png" alt="" />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
