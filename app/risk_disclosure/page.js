'use client'
import Layout from "@/components/layout/Layout"
import { useState } from 'react'

export default function Risk_Disclosure() {
    const [isActive, setIsActive] = useState(1)

    const handleClick = (key) => {
        setIsActive(prevState => prevState === key ? null : key)
    }
    return (
        <>

            <Layout headerStyle={1} footerStyle={2} breadcrumbTitle="Risk Disclosure">
                <div>
                    <section className="faq">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="block-text center">
                                        <h3 className="heading">Risk Disclosure</h3>
                                        <strong className="desc fs-20">By using this platform, you acknowledge that you have read, understood, and agree to this disclaimer.</strong>
                                        
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="flat-accordion">
                                        <div className={isActive == 1 ? "flat-toggle active" : "flat-toggle"} onClick={() => handleClick(1)}>
                                            <h6 className="toggle-title">Not Financial Advice</h6>
                                            <div className="toggle-content" style={{ display: `${isActive == 1 ? "block" : "none"}` }}>
                                            <p>This platform provides automated trading signals and market analysis for educational and informational purposes only. Nothing on this website constitutes professional financial, investment, or trading advice. You are solely responsible for your financial decisions.</p>
                                            </div>
                                        </div>
                                        <div  className={isActive == 2 ? "flat-toggle active" : "flat-toggle"} onClick={() => handleClick(2)}>
                                            <h6 className="toggle-title">Risk Warning</h6>
                                            <div className="toggle-content" style={{ display: `${isActive == 2 ? "block" : "none"}` }}>
                                                <p>
                                                Trading and investing in financial markets involve substantial risk. Past performance is not indicative of future results. The value of your investments can go down as well as up. You should carefully consider your investment objectives, level of experience, and risk appetite before making any financial decisions. You may lose some or all of your initial investment.
                                                </p>
                                            </div>
                                        </div>
                                        <div  className={isActive == 3 ? "flat-toggle active" : "flat-toggle"} onClick={() => handleClick(3)}>
                                            <h6 className="toggle-title">
                                            Prediction Accuracy
                                            </h6>
                                            <div className="toggle-content" style={{ display: `${isActive == 3 ? "block" : "none"}` }}>
                                            <p>Our trading bot uses real-time market data and advanced AI algorithms to provide trading insights and predictions. While we strive for high accuracy, no prediction model can guarantee future outcomes. Market conditions can change rapidly due to economic events, geopolitical developments, or unexpected volatility. Users should always use their own judgment when acting on any signals or advice provided by the platform.</p>
                                            </div>
                                        </div>
                                        <div  className={isActive == 4 ? "flat-toggle active" : "flat-toggle"} onClick={() => handleClick(4)}>
                                            <h6 className="toggle-title">Third-Party Information </h6>
                                            <div className="toggle-content" style={{ display: `${isActive == 4 ? "block" : "none"}` }}>
                                                <p>
                                                Our platform may use data from third-party sources believed to be reliable, but we cannot guarantee the accuracy, timeliness, or completeness of this information. We are not responsible for any errors or omissions, or for the results obtained from the use of such information.
                                                </p>
                                            </div>
                                        </div>
                                        <div  className={isActive == 5 ? "flat-toggle active" : "flat-toggle"} onClick={() => handleClick(5)}>
                                            <h6 className="toggle-title">Regulatory Compliance</h6>
                                            <div className="toggle-content" style={{ display: `${isActive == 5 ? "block" : "none"}` }}>
                                                <p>
                                                This platform is not regulated by any financial authority. The services provided may not be suitable for all users and may not comply with regulatory requirements in certain jurisdictions. It is your responsibility to ensure that your use of our platform complies with the laws and regulations in your jurisdiction.
                                                </p>
                                            </div>
                                        </div>
                                        <div  className={isActive == 6 ? "flat-toggle active" : "flat-toggle"} onClick={() => handleClick(6)}>
                                            <h6 className="toggle-title">No Fiduciary Relationship</h6>
                                            <div className="toggle-content" style={{ display: `${isActive == 6 ? "block" : "none"}` }}>
                                                <p>
                                                Use of this platform does not create any fiduciary relationship between you and the platform providers. We are not acting as your financial advisor, broker, or agent. You should consult with qualified professionals before making any financial decisions.
                                                </p>
                                            </div>
                                        </div>
                                        <div  className={isActive == 7 ? "flat-toggle active" : "flat-toggle"} onClick={() => handleClick(7)}>
                                            <h6 className="toggle-title">Limitation of Liability</h6>
                                            <div className="toggle-content" style={{ display: `${isActive == 7 ? "block" : "none"}` }}>
                                                <p>
                                                To the fullest extent permitted by applicable law, the platform providers shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the platform, including but not limited to, loss of profits, data, use, goodwill, or other intangible losses.
                                                </p>
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