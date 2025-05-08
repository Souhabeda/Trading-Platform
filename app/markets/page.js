"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import Layout from "@/components/layout/Layout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

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

  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});
  const [currentValue, setCurrentValue] = useState(null);
  const [prediction, setPrediction] = useState("Neutral");


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

  const applySettings = async () => {
    if (!pair || !indicator || !timeframe) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/full-lstm-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "skip" },
        body: JSON.stringify({ symbol: pair, indicator, timeframe }),
      });

      const data = await res.json();

      setCurrentValue(data.indicator_value); // ← valeur réelle de l'indicateur (ex: RSI)
      setPrediction(
        data.lstm_prediction?.trend === "UP"
          ? "Bullish"
          : data.lstm_prediction?.trend === "DOWN"
          ? "Bearish"
          : "Neutral"
      );

      if (!res.ok || data.market_status === "closed") {
        toast.error(data.message || "Marché fermé ou erreur");
        setSeries([]);
        setLoading(false);
        return;
      }

       // ✔️ Extraction sûre
       const candles = data.candles || [];
       const pastPred = data.lstm_prediction?.last_points_prediction || [];
       const sl = data.signal_info?.stop_loss ?? null;
       const tp = data.signal_info?.take_profit ?? null;
       const entry = data.signal_info?.entry ?? null;
       const signal = data.signal_info?.signal ?? null;
       const pred = data.lstm_prediction?.predicted_price ?? null;
       const fluctuationData = data.lstm_prediction?.fluctuation_data || [];

       const predTime = Date.parse(data.signal_info?.timestamp ?? "") || Date.now();
       const dateTime = new Date(data.signal_info?.timestamp).toLocaleString();
       const realPrice = candles[candles.length - 1]?.Close;

      const realData = candles.map(c => ({ x: new Date(c.Time).getTime(), y: c.Close }));
      const pastPredData = pastPred.map(p => ({ x: new Date(p.Time).getTime(), y: p.Close }));
      const formattedFluctuationData = fluctuationData.map(point => ({
        x: new Date(point.Time).getTime(),
        y: [point.Lower, point.Upper]
      }));
      const medianFluctuationData = fluctuationData.map(point => ({
        x: new Date(point.Time).getTime(),
        y: (point.Lower + point.Upper) / 2
      }));
      
      console.log("fluctuationData:", fluctuationData);

      const chartSeries = [
        { name: "Real Price", data: realData },
        { name: "Past Prediction", data: pastPredData },
        { name: "Future Prediction", data: [{ x: predTime, y: pred }] },
        {
          name: "Stop Loss",
          data: realData.map(p => ({ x: p.x, y: stop_loss })),
        },
        {
          name: "Take Profit",
          data: realData.map(p => ({ x: p.x, y: tp })),
        },
        {
          name: "Entry",
          data: realData.map(p => ({ x: p.x, y: entry }))
        },
        {
          name: "Fluctuations",
          type: "rangeArea",
          data: formattedFluctuationData
        },
        {
          name: "Médiane des fluctuations",
          data: medianFluctuationData,
          type: "line",
          dashArray: 5
        }
      ];
      const chartOptions = {
        chart: {
          id: "main-chart",
          type: "line",
          height: 500,
          toolbar: { show: true },
          zoom: { enabled: false },
        },
        stroke: {
          width: [3, 2, 2, 1, 1, 1, 2],
          curve: 'smooth'
        },
        fill: {
          type: ['solid', 'solid', 'solid', 'solid', 'solid', 'solid', 'gradient'],
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.4,
            opacityTo: 0,
            stops: [0, 90, 100]
          }
        },          
        colors: [
          '#00E396', // Real Price
          '#FEB019', // Past Prediction
          '#775DD0', // Future Prediction
          '#FF4560', // Stop Loss
          '#008FFB', // Take Profit
          '#9C27B0', // Entry
          '#FF6B6B', // Fluctuations
          '#FF0000'  // Médiane (rouge vif)
        ],
        tooltip: {
          shared: true,
          intersect: false,
        },
        legend: {
          position: 'top',
        },
        annotations: {
          xaxis: [
            {
              x: predTime,
              borderColor: '#775DD0',
              label: {
                text: signal && entry ? `${signal.toUpperCase()} @ ${entry} (${dateTime})` : `@ ${entry ?? "?"} (${dateTime})`,
                style: {
                  background: signal?.toLowerCase() === "buy" ? '#00E396' : '#FF4560',
                  color: "#fff"
                }
              }
            }
          ],
          points: [
            {
              x: predTime,
              y: pred,
              marker: {
                size: 6,
                fillColor: '#775DD0',
                strokeColor: '#fff',
                radius: 2
              },
              label: {
                borderColor: '#775DD0',
                offsetY: -20,
                style: {
                  background: '#775DD0',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 500
                },
                text: `Pred: ${pred?.toFixed(4)} | Real: ${realPrice?.toFixed(4)} | Fluct: ${(pred - realPrice).toFixed(4)}`
              }
            }
          ]
        }, 
        xaxis: {
          type: 'datetime',
        
        },
      };
      

      setSeries(chartSeries);
      setOptions(chartOptions);

      toast.success("Données chargées !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des données.");
    }

    setLoading(false);
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
                  {series.length > 0 && options ? (
  <Chart options={options} series={series} type="line" height={500} />
) : (
  <div className="text-center text-muted py-5">
    Aucune donnée disponible pour cette sélection.
  </div>
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
