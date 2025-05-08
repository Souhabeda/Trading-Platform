'use client'

import { useEffect, useState } from "react"
import io from "socket.io-client"
import Link from "next/link"

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL)

export default function Crypto1() {
    const [cryptoData, setCryptoData] = useState({})

    useEffect(() => {
        socket.on("crypto_update", (data) => {
            const filtered = {}
            for (const key of ["btcusdt", "ethusdt", "solusdt", "bnbusdt"]) {
                if (data[key]) {
                    filtered[key] = data[key]
                }
            }
            setCryptoData(filtered)
        })

        return () => socket.off("crypto_update")
    }, [])

    const getIconName = (symbol) => {
        return symbol.toLowerCase().replace("usdt", "");
    }

    return (
        <section className="crypto" data-aos="fade-up" data-aos-duration={1000}>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="crypto__main">
                            <div className="flat-tabs">
                                <div className="content-tab">
                                    <div className="content-inner" style={{ display: "flex" }}>
                                        {Object.entries(cryptoData).map(([symbol, info]) => (
                                            <div className="crypto-box" key={symbol}>
                                                <div className="top">
                                                    <Link href="#">
                                                        <img
                                                            src={`/assets/images/icon/${getIconName(symbol)}.png`}
                                                            alt={symbol}
                                                            width={24}
                                                            height={24}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = `/assets/images/icon/default.png`;
                                                            }}
                                                            style={{ marginRight: 8 }}
                                                        />
                                                        <span>{info.name}</span>
                                                        <span className="unit">{symbol.toUpperCase()}</span>
                                                    </Link>
                                                </div>
                                                <h6 className="price">USD {info.price.toLocaleString()}</h6>
                                                <div className="bottom">
                                                    <div className={`sale ${info.change_24h < 0 ? 'critical' : 'success'}`}>
                                                        {info.change_24h.toFixed(2)}%
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
