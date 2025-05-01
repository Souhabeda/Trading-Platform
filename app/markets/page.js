"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import Layout from "@/components/layout/Layout";
import { ToastContainer, toast } from "react-toastify";
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

  const [isLstmModalOpen, setIsLstmModalOpen] = useState(false);
  const [lstmData, setLstmData] = useState(null);


  const [pair, setPair] = useState(null);
  const [indicator, setIndicator] = useState(null);
  const [timeframe, setTimeframe] = useState("");

  const [series, setSeries] = useState([{ data: [] }]);
  const [currentValue, setCurrentValue] = useState(null);
  const [prediction, setPrediction] = useState("Neutral");

  const [newsItems, setNewsItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);


  const [signal, setSignal] = useState(null);
  const [heure, setHeure] = useState(null);
  const [entryPrice, setEntryPrice] = useState(null);
  const [sl, setSl] = useState(null);
  const [tp, setTp] = useState(null);

  // //////////////////// forex news //////////////////

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/forex-news`);
        const data = await res.json();
        if (res.ok && data.forex_news) {
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
        } else {
          console.error(data.error || "Erreur lors de la récupération des news.");
        }
      } catch (error) {
        console.error("Erreur:", error);
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
    async function fetchOptions() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/settings`);
        const data = await res.json();
        setSymbols(data.symbols || []);
        setIndicators(data.indicators || []);
        setTimeframes(data.timeframes || []);
      } catch (err) {
        console.error("Failed to fetch options:", err);
        toast.error("Erreur lors du chargement des options.");
      }
    }
    fetchOptions();
  }, []);

  const applySettings = async () => {
    if (!pair || !indicator || !timeframe) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/full-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: pair, indicator, timeframe }),
      });

      // Vérification de la réponse HTTP
      if (!res.ok) {
        const errorData = await res.json(); // Extraire les données d'erreur envoyées par le serveur
        throw new Error(errorData.message || "Erreur du serveur"); // Utiliser le message du backend ou un message générique
      }


      const data = await res.json();

      if (data.market_status === "closed") {
        toast.error(data.message);  // Affiche le message du backend si le marché est fermé
        setSeries([{ data: [] }]);  // Définir une série vide pour ne rien afficher sur le graphique
        return;
      }

      // Mise à jour des séries pour le graphique
      if (Array.isArray(data.candles)) {
        const formattedData = data.candles.map(candle => ({
          x: new Date(candle.Time).getTime(),
          y: [candle.Open, candle.High, candle.Low, candle.Close],
        }));
        setSeries([{ data: formattedData }]);
      } else {
        toast.error("Données de chandeliers invalides.");
        setSeries([{ data: [] }]); // <-- Vide aussi si données invalides
        return;
      }

      // Mise à jour des autres données
      setSignal(data.signal_info?.signal || "N/A");
      setHeure(data.signal_info?.timestamp || "N/A");
      setEntryPrice(data.signal_info?.entry || "N/A");
      setSl(data.signal_info?.stop_loss || "N/A");
      setTp(data.signal_info?.take_profit || "N/A");
      setCurrentValue(data.indicator_value);
      setPrediction(data.trend);

      toast.success("Paramètres appliqués avec succès !");
    } catch (error) {
      setSeries([{ data: [] }]);
      // Afficher le message d'erreur venant du backend
      toast.error(error.message || "Erreur lors de l'application des paramètres.");
      console.error("Error applying settings:", error);
    }
  };

  const handleLstmClick = async () => {
    if (!pair || !timeframe) {
      toast.error("Veuillez sélectionner un symbole et une période.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lstm-prediction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ symbol: pair, timeframe, indicator })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erreur lors de la prédiction LSTM.");
        setLstmData(data.error || "Erreur lors de la prédiction LSTM."); // Afficher l'erreur dans le modal
        setIsLstmModalOpen(true);
        return;
      }

      setLstmData(data);
      setIsLstmModalOpen(true);
    } catch (error) {
      console.error("Erreur lors de la requête LSTM:", error);
      toast.error("Erreur lors de la prédiction LSTM.");
      setLstmData("Erreur lors de la requête LSTM.");  // En cas d'erreur dans la requête
      setIsLstmModalOpen(true);  // Ouvre le modal avec l'erreur
    }
  };


  const options = {
    chart: {
      type: 'candlestick',
      toolbar: { show: true },
      zoom: { enabled: false }
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: { enabled: true }
    },
    tooltip: {
      y: {
        formatter: (value) => value?.toFixed(2),
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      labels: {
        colors: '#6c757d', // gris text-muted Bootstrap
      },
      markers: {
        width: 10,
        height: 10,
        radius: 12,
      },
      formatter: function (seriesName, opts) {
        return `<div class="text-center text-muted">${seriesName}</div>`;
      },
    },
    annotations: {
      yaxis: [
        ...(entryPrice ? [{
          y: parseFloat(entryPrice),
          borderColor: '#FF4560',
          label: {
            borderColor: '#FF4560',
            style: {
              color: '#fff',
              background: '#FF4560',
            },
            text: `Entry: ${entryPrice}`,
          }
        }] : []),
        ...(sl ? [{
          y: parseFloat(sl),
          borderColor: '#775DD0',
          label: {
            borderColor: '#775DD0',
            style: {
              color: '#fff',
              background: '#775DD0',
            },
            text: `SL: ${sl}`,
          }
        }] : []),
        ...(tp ? [{
          y: parseFloat(tp),
          borderColor: '#008FFB',
          label: {
            borderColor: '#008FFB',
            style: {
              color: '#fff',
              background: '#008FFB',
            },
            text: `TP: ${tp}`,
          }
        }] : []),
      ]
    }
  };

  const finalSeries = [
    {
      name: 'Candlestick',
      data: series[0]?.data || [],
    },
    {
      name: `Signal: ${signal || 'N/A'}`,
      data: [],
    },
    {
      name: `Heure: ${heure || 'N/A'}`,
      data: [],
    },
    {
      name: `Entrée: ${entryPrice || 'N/A'}`,
      data: [],
    },
    {
      name: `SL: ${sl || 'N/A'}`,
      data: [],
    },
    {
      name: `TP: ${tp || 'N/A'}`,
      data: [],
    },
  ];



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
                    {symbols.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Indicator</label>
                  <select className="form-select" value={indicator} onChange={(e) => setIndicator(e.target.value)}>
                    <option value="">-- Select an Indicator --</option>
                    {indicators.map((ind, i) => (
                      <option key={i} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Timeframe</label>
                  <select className="form-select" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                    <option value="">-- Select an Timeframe --</option>
                    {timeframes.map((t, i) => (
                      <option key={i} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <button onClick={applySettings} className="btn-wallet btn-primary-wallet w-100 mt-3">
                  Apply Settings
                </button>
                <div>
                  <button onClick={handleLstmClick} className="btn-wallet btn-primary-wallet w-100 mt-3">
                    AI Predictions
                  </button>

                  {/* Modal Bootstrap */}
                  {isLstmModalOpen && (
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="lstmModalLabel" aria-hidden="true">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h4 className="modal-title text-xl font-semibold" id="lstmModalLabel">Résultats de la prédiction LSTM</h4>
                            <button type="button" className="close" onClick={() => setIsLstmModalOpen(false)} aria-label="Close">
                              <span aria-hidden="true"><IoClose className="icon-close" /></span>
                            </button>
                          </div>
                          <div className="modal-body">
                            {lstmData ? (
                              <pre>{JSON.stringify(lstmData, null, 2)}</pre>
                            ) : (
                              <p>Aucune donnée disponible.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-9">
              <div className="p-4 rounded shadow h-100 d-flex flex-column">

                <div className="rounded-2xl shadow-lg p-4 mb-4">
                  <h4 className="mb-2">Candlestick Chart</h4>
                  {series[0]?.data.length > 0 ? (
                    <Chart options={options} series={finalSeries} type="candlestick" height={400} />
                  ) : (
                    <div className="text-center text-muted py-5">
                      Aucun graphique disponible pour cette sélection.
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
