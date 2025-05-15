"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import Layout from "@/components/layout/Layout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { ZoomIn, ZoomOut } from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ITEMS_PER_PAGE = 4; // nombre de news visibles à la fois
const SLIDE_INTERVAL = 4000; // 4 secondes entre chaque changement

// Fonction pour déterminer l'icône et la couleur selon l'impact
function getImpactDetails(impact) {
  const lowerImpact = impact.toLowerCase();

  if (lowerImpact.includes("low")) {
    return { icon: "🟡", label: "Low Impact", color: "text-yellow-400" };
  } else if (lowerImpact.includes("medium")) {
    return { icon: "🟠", label: "Medium Impact", color: "text-orange-500" };
  } else if (lowerImpact.includes("high")) {
    return { icon: "🔴", label: "High Impact", color: "text-red-500" };
  } else if (lowerImpact.includes("non-economic")) {
    return { icon: "⚪", label: "Non-Economic", color: "text-gray-400" };
  } else {
    return { icon: "❓", label: "Unknown Impact", color: "text-gray-500" };
  }
}

export default function Markets() {
  const [symbols, setSymbols] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [timeframes, setTimeframes] = useState([]);

  const [pair, setPair] = useState("");
  const [indicator, setIndicator] = useState("");
  const [timeframe, setTimeframe] = useState("");


  const [currentValue, setCurrentValue] = useState(null);
  const [prediction, setPrediction] = useState("Neutral");

  const [marketStatus, setMarketStatus] = useState("open");
  const [nextMarketOpen, setNextMarketOpen] = useState("");
  const [marketData, setMarketData] = useState(null);

  const [newsItems, setNewsItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // //////////////////// forex news //////////////////

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/forex-news`,
          {
            headers: { "ngrok-skip-browser-warning": "skip" }
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data.forex_news)) {
          console.error("❌ forex_news n'est pas un tableau :", data);
          setNewsItems([]);
          return;
        }

        const formattedNews = data.forex_news.map((item) => {
          const impactDetails = getImpactDetails(item.Impact);

          return {
            id: uuidv4(),
            text: `[${item.Currency}] ${item.Event} (${item.Date} ${item.Time}) - ${impactDetails.label}`,
            icon: impactDetails.icon,
            color: impactDetails.color,
          };
        });

        setNewsItems(formattedNews);
      } catch (error) {
        console.error("Erreur fetch /forex-news:", error);
        setNewsItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);


  useEffect(() => {
    if (newsItems.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + ITEMS_PER_PAGE) % newsItems.length);
      }, SLIDE_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [newsItems]);

  const visibleItems = newsItems.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);

  // /////////////////////////////////////////////////

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/settings`,
          {
            headers: { "ngrok-skip-browser-warning": "skip" }
          });
        const data = await res.json();

        // Vérification de la structure de la réponse
        console.log("Réponse /settings:", data);

        setSymbols(data.symbols || []);      // Si symbols est défini, sinon tableau vide
        setIndicators(data.indicators || []); // Si indicators est défini, sinon tableau vide
        setTimeframes(data.timeframes || []); // Si timeframes est défini, sinon tableau vide
      } catch (err) {
        console.error("Erreur lors du chargement des options:", err);
        toast.error("Erreur lors du chargement des options.");
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    console.log("Market Data:", marketData);
  }, [marketData]);

  const applySettings = async () => {
    if (!pair || !indicator || !timeframe) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "skip" },
        body: JSON.stringify({ symbol: pair, indicator, timeframe }),
      });

      if (!res.ok) {
        toast.error("Erreur lors du chargement des données.");
        return;
      }

      const data = await res.json();
      console.log("Données reçues:", data);
      setMarketData(data); // ✅ Stocke `data` dans l'état global

      // ✅ Met à jour `currentValue` avec `entry_price`
      setCurrentValue(data.entry_price);

      // ✅ Met à jour `prediction` avec le signal de tendance
      setPrediction(data.signal === "buy" ? "Bullish" : data.signal === "sell" ? "Bearish" : "Neutral");

      // Vérification si le marché est fermé
      if (!data.market_open) {
        setMarketStatus("closed");
        setNextMarketOpen(data.next_open || "Indisponible");
        toast.warn(`Marché fermé. Réouverture prévue le ${data.next_open || "Indisponible"}`);

        if (data.last_snapshot) {
          toast.info("Affichage du dernier snapshot disponible.");
        }
        return;
      }

      setMarketStatus("open");
      toast.success("Données chargées !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des données.");
    }
  };

  const formatChartData = (data = {}) => {
    if (!data || !data.ohlc) return [];

    return data.ohlc.map(c => ({
      x: new Date(c.time).getTime(),
      o: Number(c.open),
      h: Number(c.high),
      l: Number(c.low),
      c: Number(c.close),
      y: Number(c.close)  // utilisé pour la ligne
    }));
  };

  const chartSeries = marketData && marketData.ohlc ? [
    {
      name: "Prix réel",
      type: "candlestick",
      data: formatChartData(marketData).map(c => ({
        x: c.x, // Utilise la date formatée
        y: [c.o, c.h, c.l, c.c] // Utilise les valeurs formatées d'open, high, low, close
      }))
    },

    {
      name: "Prédiction future",
      type: "line",
      data: marketData.future_timestamps.map((time, i) => ({
        x: marketData.future_timestamps,
        y: marketData.future_prediction[i]
      })),
      color: "#775DD0", dashArray: 4
    },

    {
      name: "Entry Price",
      type: "line",
      data: marketData.ohlc.map(c => ({ x: new Date(c.time).getTime(), y: marketData.entry_price })),
      color: "#008FFB", dashArray: 4
    },

    {
      name: "Fluctuation Lower",
      type: "line",
      data: marketData.ohlc.map(c => ({ x: new Date(c.time).getTime(), y: marketData.fluctuation.lower })),
      color: "#C95792", dashArray: 2
    },

    {
      name: "Fluctuation Median",
      type: "line",
      data: marketData.ohlc.map(c => ({ x: new Date(c.time).getTime(), y: marketData.fluctuation.median })),
      color: "#273F4F", dashArray: 2
    },

    {
      name: "Fluctuation Upper",
      type: "line",
      data: marketData.ohlc.map(c => ({ x: new Date(c.time).getTime(), y: marketData.fluctuation.upper })),
      color: "#FE7743", dashArray: 2
    },
    {
      name: "Take Profit", type: "line",
      data: marketData.ohlc.map(c => ({ x: new Date(c.time).getTime(), y: marketData.tp })),
      color: "#537D5D", dashArray: 4
    },

    {
      name: "Stop Loss", type: "line",
      data: marketData.ohlc.map(c => ({ x: new Date(c.time).getTime(), y: marketData.sl })),
      color: "#FFF100", dashArray: 4
    }
  ] : [];

  const chartOptions = {
    chart: {
      id: "main-chart", type: "candlestick", height: 500, toolbar: {
        show: true, tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      }
    }, // ✅ Modifie le type du graphique
    stroke: { width: [1, 2, 2, 2], curve: "smooth", dashArray: [0, 0, 4, 4] },
    colors: ["#00E396", "#775DD0", "#FEB019", "#FF4560"],
    xaxis: {
      type: 'datetime',
      labels: { format: 'dd MMM yyyy HH:mm', datetimeUTC: false },
    },
    yaxis: { title: { text: 'Valeur' } },
    plotOptions: {
      candlestick: { colors: { upward: "#00E396", downward: "#FF4560" } } // ✅ Couleurs pour Buy/Sell
    },
    tooltip: {
      shared: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const seriesType = w.config.series[seriesIndex].type;
        const seriesName = w.config.series[seriesIndex].name;
        const data = w.config.series[seriesIndex].data[dataPointIndex];

        if (!data) return '';

        const timestamp = data.x;
        const date = new Date(timestamp);
        const formattedDate = date.toUTCString().replace("GMT", "UTC"); // Ex: "Tue, 14 May 2025 15:42:00 UTC"

        if (seriesType === "candlestick") {
          const [o, h, l, c] = data.y;
          return `
        <div style="padding:5px">
          <strong>${seriesName}</strong><br/>
          <span>${formattedDate}</span><br/>
          Open: ${o}<br/>
          High: ${h}<br/>
          Low: ${l}<br/>
          Close: ${c}
        </div>
      `;
        } else {
          return `
        <div style="padding:5px">
          <strong>${seriesName}</strong><br/>
          <span>${formattedDate}</span><br/>
          Value: ${data.y}
        </div>
      `;
        }
      }
    },
    annotations: {
      yaxis: [
        {
          y: marketData?.tp,
          borderColor: '#537D5D',
          // label: {
          //   text: `Take Profit: ${marketData?.tp}`,
          //   style: { background: '#FEB019', color: '#fff' }
          // }
        },
        {
          y: marketData?.sl,
          borderColor: '#FFF100',
          // label: {
          //   text: `Stop Loss: ${marketData?.sl}`,
          //   style: { background: '#FF4560', color: '#fff' }
          // }
        },
        {
          y: marketData?.entry_price,
          borderColor: '#008FFB',
          // label: {
          //   text: `Entry Price: ${marketData?.entry_price}`,
          //   style: { background: '#008FFB', color: '#fff' }
          // }
        },
        {
          y: marketData?.fluctuation.lower,
          y2: marketData?.fluctuation.upper,
          borderColor: 'transparent',
          fillColor: 'rgba(255, 69, 96, 0.45)', // rouge transparent
          opacity: 0.1,
          label: {
            // text: 'Fluctuation Zone',
            style: { background: '#FF4560', color: '#fff' }
          }
        },
        {
          y: marketData?.fluctuation.median,
          borderColor: '#273F4F',
          // label: {
          //   text: `Fluctuation Median: ${marketData?.fluctuation.median}`,
          //   style: { background: '#00E396', color: '#fff' }
          // }
        },
        {
          y: marketData?.fluctuation.upper,
          borderColor: '#FE7743',
          // label: {
          //   text: `Fluctuation Upper: ${marketData?.fluctuation.upper}`,
          //   style: { background: '#FEB019', color: '#fff' }
          // }
        },
        {
          y: marketData?.fluctuation.lower,
          borderColor: 'C95792',
          // label: {
          //   text: `Fluctuation lower: ${marketData?.fluctuation.lower}`,
          //   style: { background: '#FEB019', color: '#fff' }
          // #B5FCCD}
        },
        {
          y: marketData?.future_prediction?.[0],
          borderColor: '#775DD0',
          label: {
            text: `Prédiction: ${marketData?.future_prediction?.[0]}`,
            style: { background: '#775DD0', color: '#fff' }
          }
        }
      ],
    }
  };

  return (
    <Layout breadcrumbTitle="Markets">
      <section className="wallet-assets flat-tabs">
        <div className="container-fluid px-4">
          <div className="row g-4">

            {/* Sidebar */}
            <div className="col-lg-3">
              <div className="p-4 rounded shadow h-100">
                <h4 className="mb-4 text-xl font-semibold">Market Settings</h4>

                <div className="mb-3">
                  <label className="form-label">Currency Pair</label>
                  <select className="form-select" value={pair} onChange={(e) => setPair(e.target.value)}>
                    <option value="">-- Select an Currency Pair --</option>
                    {symbols.map((sym, i) => <option key={i} value={sym}>{sym}</option>)}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Indicator</label>
                  <select className="form-select" value={indicator} onChange={(e) => setIndicator(e.target.value)}>
                    <option value="">-- Select an Indicator --</option>
                    {indicators.map((ind, i) => <option key={i} value={ind}>{ind}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Timeframe</label>
                  <select className="form-select" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                    <option value="">-- Select a Timeframe --</option>
                    {timeframes.map((tf, i) => <option key={i} value={tf}>{tf}</option>)}
                  </select>
                </div>

                <button onClick={applySettings} className="btn-wallet btn-primary-wallet w-100 mt-3">
                  Apply Settings
                </button>
              </div>
            </div>
            {/* Main Content */}
            <div className="col-lg-9">
              <div className="p-4 rounded shadow h-100 d-flex flex-column">
                <div className="p-4 rounded shadow h-100 d-flex flex-column mb-4">
                  <h4 className="mb-3">Candlestick Chart</h4>
                  {marketStatus === "closed" ? (
                    <div className="text-center text-warning py-5">
                      <strong>🚨 Marché fermé 🚨</strong>
                      <p>Réouverture prévue : <strong>{nextMarketOpen}</strong></p>
                    </div>
                  ) : (
                    chartSeries.length > 0 ? (
                      <Chart options={chartOptions} series={chartSeries} type="line" height={500} />
                    ) : (
                      <div className="text-center text-muted py-5">Aucune donnée disponible.</div>
                    )
                  )}
                </div>
                <div className="d-flex flex-wrap gap-4">
                  {(pair && indicator) && (
                    <div className="flex-grow-1 p-4 rounded shadow-lg">
                      <h4 className="mb-2 text-lg font-semibold">Predictions & Technical Analysis</h4>
                      <div className="text-center mb-2 text-muted">
                        {pair} | {indicator} Current Value: {currentValue !== null ? currentValue : "NULL"}
                      </div>
                      <motion.div
                        className="py-3 px-4 text-center rounded"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div
                          style={{
                            background: !marketData ? "#D3D3D3" : marketData?.signal === "buy" ? "#00E396" : "#FF4560", // Fond gris pendant le chargement
                            color: "#fff",
                            padding: "10px",
                            borderRadius: "5px",
                            textAlign: "center",
                          }}
                        >
                          <p>
                            {`Signal: ${marketData?.signal?.toUpperCase()} | ${(() => {
                              const date = new Date(marketData?.current_candle_time);
                              if (isNaN(date)) {
                                return "Invalid Date";
                              }
                              const dateStr = date.toLocaleDateString("en-GB"); // Format YYYY-MM-DD
                              const timeStr = date.toLocaleTimeString("en-GB", { hour12: false }); // Format HH:MM:SS
                              return `${dateStr} | ${timeStr}`;
                            })()}`}
                          </p>
                        </div>
                        {prediction === "Bullish" && (
                          <div className="bullish">
                            <HiArrowTrendingUp size={32} />
                            {prediction}
                          </div>
                        )}
                        {prediction === "Bearish" && (
                          <div className="bearish">
                            <HiArrowTrendingDown size={32} />
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

                    {loading ? (
                      <p>Chargement des actualités...</p>
                    ) : (
                      <ul className="list-unstyled">
                        {visibleItems.map((item) => (
                          <motion.li
                            key={item.id}
                            className={`mb-2 ${item.color}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            {item.icon} {item.text}
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div> `
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
