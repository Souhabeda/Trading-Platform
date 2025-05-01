'use client'
import React, { useState, useEffect } from "react"
import Chart from "react-apexcharts"
import { motion } from "framer-motion"

export default function MarketSection() {
  const [chartData, setChartData] = useState({
    series: [{
      data: generateMockCandles()
    }],
    options: {
      chart: {
        type: 'candlestick',
        height: 350,
        toolbar: { show: false }
      },
      xaxis: {
        type: 'category'
      },
      yaxis: {
        tooltip: { enabled: true }
      }
    }
  })

  const [prediction, setPrediction] = useState("Bullish")
  const [news, setNews] = useState([
    "USD rallies ahead of Fed decision.",
    "Gold retreats as US yields climb.",
    "GBP/USD holds steady after CPI data."
  ])

  // Mock chart update every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newSeries = [...prev.series[0].data]
        newSeries.shift()
        newSeries.push(generateSingleCandle())
        return { ...prev, series: [{ data: newSeries }] }
      })

      setPrediction(Math.random() > 0.5 ? "Bullish" : "Bearish")
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="wallet-assets buy-crypto flat-tabs">
      <div className="wallet-assets-main">
        <div className="main-left">
          <div className="top">
            <h6>EUR/USD Market</h6>
          </div>

          <div className="bottom">
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="candlestick"
              height={300}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`prediction-box ${prediction.toLowerCase()}`}
          >
            <h6>AI Prediction:</h6>
            <p>{prediction}</p>
          </motion.div>
        </div>

        <ul className="main-right">
          <h6>Forex Factory News</h6>
          {news.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <p>{item}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// Mock candle data
function generateMockCandles() {
  const candles = []
  let base = 50
  for (let i = 0; i < 20; i++) {
    const open = base + Math.random() * 5
    const close = open + (Math.random() * 4 - 2)
    const high = Math.max(open, close) + Math.random() * 2
    const low = Math.min(open, close) - Math.random() * 2
    candles.push({ x: `T${i + 1}`, y: [open, high, low, close] })
    base = close
  }
  return candles
}

function generateSingleCandle() {
  const open = 50 + Math.random() * 5
  const close = open + (Math.random() * 4 - 2)
  const high = Math.max(open, close) + Math.random() * 2
  const low = Math.min(open, close) - Math.random() * 2
  return { x: `T${Date.now()}`, y: [open, high, low, close] }
}
