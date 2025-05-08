'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function BuyCryptoDetails() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [transactionData, setTransactionData] = useState(null);


    const [flatTabs, setFlatTabs] = useState(1);

    useEffect(() => {
        const session_id = searchParams.get("session_id");
        console.log("Session ID:", session_id); // ← ajoute ceci
        if (session_id) {
            fetch(`/api/stripe-product?session_id=${session_id}`)
                .then(res => res.json())
                .then(data => {
                    console.log("Stripe session data:", data);
                    if (data.error) {
                        console.error("Stripe API returned an error:", data.error);
                    } else {
                        setTransactionData(data);
                    }
                })
                .catch(err => console.error("Erreur récupération session Stripe :", err));
        }
    }, [searchParams]);

    
    const handleFlatTabs = (index) => {
        setFlatTabs(index);
        if (index === 1) router.push("/buy-crypto-select");
        if (index === 2) router.push("/sell-crypto");
    };

    const handleBackClick = () => {
        router.push("/buy-crypto-select"); 
    };
    
    return (
        <>

            <Layout headerStyle={1} footerStyle={2} breadcrumbTitle="Buy Crypto">
                <div>
                    <section className="buy-crypto flat-tabs">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-3">
                                    <ul className="menu-tab">
                                        <li className={flatTabs === 1 ? "active" : ""} onClick={() => handleFlatTabs(1)}>
                                            <Link href="/buy-crypto-select">
                                                <h6 className="fs-16">Buy</h6>
                                            </Link>
                                        </li>
                                        <li className={flatTabs === 2 ? "active" : ""} onClick={() => handleFlatTabs(2)}>
                                            <Link href="/sell-crypto">
                                                <h6 className="fs-16">Sell</h6>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-9">
                                    <div className="content-tab">
                                        <div className="content-inner buy-crypto__main" style={{ display: `${flatTabs === 1 ? "block" : "none"}` }}>
                                            <div className="top">
                                                <ul className="top-list">
                                                    <li className="done">
                                                        <h6>
                                                            <span>
                                                                <svg width={10} height={8} viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M1 3.99967L3.66667 6.66634L9 1.33301" stroke="white" strokeWidth={2} strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg> </span>Select currency
                                                        </h6>
                                                    </li>
                                                    <li className="done">
                                                        <h6>
                                                            <span>
                                                                <svg width={10} height={8} viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M1 3.99967L3.66667 6.66634L9 1.33301" stroke="white" strokeWidth={2} strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg> </span>Confirm Payment
                                                        </h6>
                                                    </li>
                                                    <li className="active">
                                                        <h6><span />Details</h6>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="main details center">
                                                <div className="heading">
                                                    <h4>Success</h4>
                                                    <div className="icon">
                                                        <svg width={10} height={8} viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1 3.99967L3.66667 6.66634L9 1.33301" stroke="white" strokeWidth={2} strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {transactionData ? (
                                                    <p>
                                                        {transactionData.cryptoAmount === '0' || transactionData.cryptoAmount === 'N/A' ? (
                                                            <>No crypto received. Please contact support.</>
                                                        ) : (
                                                            <>You successfully bought <strong>{transactionData.cryptoAmount}</strong> <span>{transactionData.cryptoSymbol}</span> for <strong>{transactionData.fiatAmount} <span>{transactionData.fiatCurrency}</span></strong>!</>
                                                        )}
                                                    </p>
                                                ) : (
                                                    <p>Loading transaction details...</p>
                                                )}

                                                <ul className="status">
                                                    <li className="top">
                                                        <p className="desc">Status</p>
                                                        <p className="text">Completed</p>
                                                    </li>
                                                    <li className="s-body">
                                                        <p className="desc">Transaction ID</p>
                                                        <p className="text">{transactionData?.transactionId || "Unavailable"}</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="main payment">
                                                <h6 className="title">Payment Details</h6>
                                                <ul className="status">
                                                    <li>
                                                        <p className="desc">Payment Method</p>
                                                        <p className="text">
                                                            {transactionData?.paymentMethod || "Unavailable"}<svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M9 20C11.7614 20 14 17.7614 14 15C14 12.2386 11.7614 10 9 10C6.23858 10 4 12.2386 4 15C4 17.7614 6.23858 20 9 20ZM9 22C12.866 22 16 18.866 16 15C16 11.134 12.866 8 9 8C5.13401 8 2 11.134 2 15C2 18.866 5.13401 22 9 22Z" fill="#777E90" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M15.0001 4C13.5193 4 12.1899 4.6424 11.273 5.66691C10.9047 6.07844 10.2725 6.11346 9.86093 5.74513C9.4494 5.37681 9.41438 4.74461 9.78271 4.33309C11.063 2.9026 12.9268 2 15.0001 2C18.866 2 22.0001 5.13401 22.0001 9C22.0001 11.0733 21.0975 12.937 19.667 14.2173C19.2554 14.5857 18.6232 14.5507 18.2549 14.1391C17.8866 13.7276 17.9216 13.0954 18.3331 12.7271C19.3577 11.8101 20.0001 10.4807 20.0001 9C20.0001 6.23858 17.7615 4 15.0001 4Z" fill="#777E90" />
                                                            </svg>
                                                        </p>
                                                    </li>
                                                    <li>
                                                        <p className="desc">Date</p>
                                                        <p className="text">
                                                            {transactionData?.created
                                                                ? new Date(transactionData.created * 1000).toLocaleString()
                                                                : "Date unavailable"}
                                                            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M9 20C11.7614 20 14 17.7614 14 15C14 12.2386 11.7614 10 9 10C6.23858 10 4 12.2386 4 15C4 17.7614 6.23858 20 9 20ZM9 22C12.866 22 16 18.866 16 15C16 11.134 12.866 8 9 8C5.13401 8 2 11.134 2 15C2 18.866 5.13401 22 9 22Z" fill="#777E90" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M15.0001 4C13.5193 4 12.1899 4.6424 11.273 5.66691C10.9047 6.07844 10.2725 6.11346 9.86093 5.74513C9.4494 5.37681 9.41438 4.74461 9.78271 4.33309C11.063 2.9026 12.9268 2 15.0001 2C18.866 2 22.0001 5.13401 22.0001 9C22.0001 11.0733 21.0975 12.937 19.667 14.2173C19.2554 14.5857 18.6232 14.5507 18.2549 14.1391C17.8866 13.7276 17.9216 13.0954 18.3331 12.7271C19.3577 11.8101 20.0001 10.4807 20.0001 9C20.0001 6.23858 17.7615 4 15.0001 4Z" fill="#777E90" />
                                                            </svg>
                                                        </p>
                                                    </li>
                                                </ul>
                                                <div className="group-button">
                                                    <button className="cancel btn-action-3" onClick={handleBackClick}>Back</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </Layout>
        </>
    )
}