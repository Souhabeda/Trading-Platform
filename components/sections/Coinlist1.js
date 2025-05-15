
'use client'
import Link from "next/link"
import ChatList from "../chart/ChatList"
import { useEffect, useState } from "react";
import SignalArrow from "../elements/SignalArrow";
import { getSocket } from "@/lib/socket";

export default function Coinlist1() {
    const [flatTabs, setFlatTabs] = useState(1)
    const [cryptoData, setCryptoData] = useState([]);

 useEffect(() => {
        const socket = getSocket();

        socket.on("crypto_update", (data) => {
            const sorted = Object.entries(data).map(([symbol, values], index) => ({
                rank: index + 1,
                symbol,
                name: symbol.toUpperCase(),
                ...values
            }));
            setCryptoData(sorted);
        });

        return () => {
            socket.off("crypto_update");
        };
    }, []);

    const handleFlatTabs = (index) => {
        setFlatTabs(index)
    }

    const getIconName = (symbol) => {
        return symbol.toLowerCase().replace("usdt", "");
    };

    return (
        <>

            <section className="coin-list">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="block-text">
                                <h3 className="heading">Market Update</h3>
                            </div>
                            <div className="coin-list__main">
                                <div className="flat-tabs">
                                    <ul className="menu-tab">
                                        <li className={flatTabs === 1 ? "active" : ""} onClick={() => handleFlatTabs(1)}>
                                            <h6 className="fs-16">View All</h6>
                                        </li>
                                    </ul>
                                    <div className="content-tab">
                                        <div className="content-inner" style={{ display: `${flatTabs === 1 ? "block" : "none"}` }}>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" />
                                                        <th scope="col">#</th>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Last Price</th>
                                                        <th scope="col">24h %</th>
                                                        <th scope="col">Market Cap</th>
                                                        <th scope="col">Last 7 Days</th>
                                                        <th scope="col" />
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cryptoData.map((item) => (
                                                        <tr key={item.symbol}>
                                                            <th scope="row"><SignalArrow signal={item.sma_signal || null} /></th>
                                                            <td>{item.rank}</td>
                                                            <td>
                                                                <Link href="/markets">
                                                                    <img
                                                                        src={`/assets/images/icon/${getIconName(item.symbol)}.png`}
                                                                        alt={item.symbol}
                                                                        width={24}
                                                                        height={24}
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = `/assets/images/icon/default.png`;
                                                                        }}
                                                                    />

                                                                    <span className="coinList-name">{item.name}</span>
                                                                    <span className="unit">{item.symbol.toUpperCase()}</span>
                                                                </Link>
                                                            </td>
                                                            <td className="boild">${item.price ? item.price.toFixed(2) : "N/A"}</td>
                                                            <td className={item.change_24h >= 0 ? "up" : "down"}>
                                                                {item.change_24h.toFixed(2)}%
                                                            </td>
                                                            <td className="boild">{item.market_cap}</td>
                                                            <td><ChatList color={item.change_24h >= 0 ? 1 : 2} /></td>
                                                            <td><Link href="/markets" className="btn">Trade</Link></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
