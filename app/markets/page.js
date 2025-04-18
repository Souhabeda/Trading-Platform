'use client'

import Layout from "@/components/layout/Layout"
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

export default function Markets() {


    const [series, setSeries] = useState([{ data: [] }]);
    const [interval, setIntervalState] = useState("1m");

    const fetchData = async (intvl) => {
        try {
            const res = await axios.get(
                `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${intvl}&limit=100`
            );

            const formatted = res.data.map((candle) => ({
                x: new Date(candle[0]),
                y: [
                    parseFloat(candle[1]),
                    parseFloat(candle[2]),
                    parseFloat(candle[3]),
                    parseFloat(candle[4]),
                ],
            }));

            setSeries([{ data: formatted }]);
        } catch (err) {
            console.error("Error fetching candles:", err);
        }
    };

    useEffect(() => {
        fetchData(interval);
        const intervalId = setInterval(() => fetchData(interval), 60000);
        return () => clearInterval(intervalId);
    }, [interval]);

    const handleIntervalChange = (newInterval) => {
        setIntervalState(newInterval);
    };

    // Check if dark mode is preferred
    const isDark = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    const options = {
        chart: {
            type: "candlestick",
            height: "100%",
            background: "transparent", // Transparent background
            toolbar: {
                autoSelected: "zoom",
                show: true,
                
            },
            zoom: {
                enabled: true,
            },
        },
        title: {
            text: `BTC/USDT - ${interval.toUpperCase()} Candlestick Chart`,
            align: "left",
            style: {
                color: isDark ? "#ffffff" : "#000000",
                fontSize: "18px",
            },
        },
        xaxis: {
            type: "datetime",
            labels: {
                style: {
                    colors: isDark ? "#e2e8f0" : "#4b5563",
                },
            },
        },
        yaxis: {
            tooltip: {
                enabled: true,
            },
            labels: {
                style: {
                    colors: isDark ? "#e2e8f0" : "#4b5563",
                },
            },
        },
        theme: {
            mode: isDark ? "dark" : "light",
        },
        grid: {
            borderColor: isDark ? "#1e293b" : "#d1d5db",
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: "#00ff84",
                    downward: "#ff4b4b",
                },
            },
        },
    };

    return (
        <>

            <Layout headerStyle={1} footerStyle={2}>
                <div>
                    <div style={{ height: "100vh", width: "100vw", backgroundColor: "transparent" }}>
                        <div style={{ padding: "10px", display: "flex", gap: "10px" }}>
                            {['1m', '5m', '15m', '1h'].map((intvl) => (
                                <button
                                    key={intvl}
                                    onClick={() => handleIntervalChange(intvl)}
                                    style={{
                                        backgroundColor: interval === intvl ? '#00ff84' : isDark ? '#1e293b' : '#e5e7eb',
                                        color: isDark ? '#ffffff' : '#111827',
                                        border: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {intvl.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <Chart options={options} series={series} type="candlestick" height="90%" />
                    </div>
                </div>

            </Layout>
        </>
    )
}


