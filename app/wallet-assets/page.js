"use client";
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import Layout from "@/components/layout/Layout";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";

export default function WalletAssets() {
  const [pair, setPair] = useState("EUR/USD");
  const [indicator, setIndicator] = useState("RSI");
  const [timeframe, setTimeframe] = useState("1H");
  const [prediction, setPrediction] = useState("Neutral");
  const [currentValue, setCurrentValue] = useState(null);

  const [series, setSeries] = useState([
    {
      data: [
        {
          x: new Date().getTime(),
          y: [1.0840, 1.0880, 1.0820, 1.0856],
        },
      ],
    },
  ]);

  const newsItems = [
    "USD CPI Report expected at 14:30 GMT.",
    "Gold reacts to geopolitical tension.",
    "FOMC minutes due later today.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date().getTime();
      const open = +(1.0800 + Math.random() * 0.01).toFixed(4);
      const high = +(open + Math.random() * 0.005).toFixed(4);
      const low = +(open - Math.random() * 0.005).toFixed(4);
      const close = +(low + Math.random() * (high - low)).toFixed(4);

      setSeries((prev) => {
        const updatedCandles = [...prev[0].data, { x: newTime, y: [open, high, low, close] }];
        if (updatedCandles.length > 30) updatedCandles.shift();
        return [{ data: updatedCandles }];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // --- Calculs Techniques ---
  const calculateRSI = (closes, period = 14) => {
    if (closes.length < period) return 50;
    let gains = 0;
    let losses = 0;

    for (let i = closes.length - period; i < closes.length - 1; i++) {
      const diff = closes[i + 1] - closes[i];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }

    let rs = gains / (losses || 1);
    let rsi = 100 - 100 / (1 + rs);
    return parseFloat(rsi.toFixed(2));
  };

  const calculateEMA = (data, period) => {
    const k = 2 / (period + 1);
    let emaArray = [];
    let ema = data[0];
    emaArray.push(ema);

    for (let i = 1; i < data.length; i++) {
      ema = data[i] * k + ema * (1 - k);
      emaArray.push(parseFloat(ema.toFixed(4)));
    }
    return emaArray;
  };

  const calculateMACD = (closes) => {
    const ema12 = calculateEMA(closes, 12);
    const ema26 = calculateEMA(closes, 26);
    if (ema12.length !== ema26.length) return 0;

    const macdLine = ema12.map((v, idx) => v - ema26[idx]);
    return parseFloat(macdLine[macdLine.length - 1].toFixed(4));
  };

  // --- Analyse technique automatique ---
  useEffect(() => {
    if (!series[0].data.length) return;

    const closes = series[0].data.map((d) => d.y[3]);

    if (indicator === "RSI") {
        const rsi = calculateRSI(closes);
        setCurrentValue(rsi);
        if (rsi > 50) setPrediction("Bullish");
        else if (rsi < 50) setPrediction("Bearish");
        else setPrediction("Neutral");
      }
      

    if (indicator === "MACD") {
      const macd = calculateMACD(closes);
      setCurrentValue(macd);
      if (macd > 0) setPrediction("Bullish");
      else if (macd < 0) setPrediction("Bearish");
      else setPrediction("Neutral");
    }
  }, [indicator, series]);

  // --- Options du Chart ---
  const options = {
    chart: {
      type: "candlestick",
      toolbar: { show: true },
      zoom: { enabled: false },
    },
    grid: { show: true },
    xaxis: {
      type: "datetime",
      labels: {
        style: { colors: "#94a3b8", fontSize: "12px" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#94a3b8", fontSize: "12px" },
      },
    },
    tooltip: {
      theme: "dark",
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#00E396",
          downward: "#FF4560",
        },
        wick: { useFillColor: true },
      },
    },
    stroke: {
      width: 1,
    },
    colors: ["#00E396"],
    legend: { show: true },
  };

  return (
    <Layout breadcrumbTitle="Wallet">
      <section className="wallet-assets flat-tabs">
        <div className="container-fluid px-4">
          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div className="p-4 rounded shadow h-100">
                <h4 className="mb-4 text-xl font-semibold">Market Settings</h4>

                <div className="mb-3">
                  <label className="form-label">Currency Pair</label>
                  <select
                    className="form-select"
                    value={pair}
                    onChange={(e) => setPair(e.target.value)}
                  >
                    <option value="EUR/USD">EUR/USD</option>
                    <option value="XAU/USD">Gold (XAU/USD)</option>
                    <option value="BTC/USD">Bitcoin (BTC/USD)</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Indicator</label>
                  <select
                    className="form-select"
                    value={indicator}
                    onChange={(e) => setIndicator(e.target.value)}
                  >
                    <option value="RSI">RSI</option>
                    <option value="MACD">MACD</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Timeframe</label>
                  <select
                    className="form-select"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                  >
                    <option value="1m">1 Minute</option>
                    <option value="5m">5 Minutes</option>
                    <option value="1H">1 Hour</option>
                    <option value="1D">1 Day</option>
                  </select>
                </div>

                <button className="btn-wallet btn-primary-wallet w-100 mt-3" onClick={() => {}}>
                  Apply Settings
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-9">
              <div className="p-4 rounded shadow h-100 d-flex flex-column">
                {/* Chart */}
                <div className=" rounded-2xl shadow-lg p-4 mb-4">
                  <h4 className="mb-2">Candlestick Chart</h4>
                  <Chart options={options} series={series} type="candlestick" height={400} />
                </div>

                {/* Prediction + News */}
                <div className="d-flex flex-wrap gap-4">
                  {/* Prediction Box */}
                  {(indicator === "RSI" || indicator === "MACD") && (
                    <div className="flex-grow-1 p-4 rounded shadow-lg">
                      <h4 className="mb-2 text-lg font-semibold">Predictions & Technical Analysis</h4>
                      {currentValue !== null && (
                        <div className="text-center mb-2 text-muted">
                          {indicator} Current Value: {currentValue}
                        </div>
                      )}
                      <motion.div
                        className="py-3 px-4 text-center rounded"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {prediction === "Bullish" && (
                          <div className="bullish">
                            <HiArrowTrendingUp />
                            {prediction}
                          </div>
                        )}
                        {prediction === "Bearish" && (
                          <div className="bearish">
                            <HiArrowTrendingDown />
                            {prediction}
                          </div>
                        )}
                        {prediction === "Neutral" && (
                          <div className="flex items-center justify-center gap-2 text-gray-500 font-semibold text-xl">
                            {prediction}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )}

                  {/* News Box */}
                  <div className="flex-grow-1 p-4 rounded shadow-lg">
                    <h4 className="mb-2 text-lg font-semibold">Forex Factory News</h4>
                    <ul className="list-unstyled">
                      {newsItems.map((item, idx) => (
                        <motion.li
                          key={uuidv4()}
                          className="mb-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.2 }}
                        >
                          • {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
