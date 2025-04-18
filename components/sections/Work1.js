
import Link from "next/link"

export default function Work1() {
    return (
        <>

            <section className="work">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="block-text center">
                                <h3 className="heading">How It Work</h3>
                                <p className="fs-20 desc">
                                </p>
                            </div>
                            <div className="work__main">
                                <div className="work-box">
                                    <div className="image">
                                        <img src="/assets/images/icon/Cloud.png" alt="" />
                                    </div>
                                    <div className="content">
                                        <p className="step">Step 1</p>
                                        <Link href="#" className="title">Create Your Account</Link>
                                        <p className="text">
                                        Sign up to gain full access to personalized tools and real-time market insights powered by AI.</p>
                                    </div>
                                    <img className="line" src="/assets/images/icon/connect-line.png" alt="" />
                                </div>
                                <div className="work-box">
                                    <div className="image">
                                        <img src="/assets/images/icon/Mining.png" alt="" />
                                    </div>
                                    <div className="content">
                                        <p className="step">Step 2 </p>
                                        <Link href="#" className="title">Start trading</Link>
                                        <p className="text">
                                        Begin making informed trades with our advanced AI algorithms and live market data at your fingertips.</p>
                                    </div>
                                    <img className="line" src="/assets/images/icon/connect-line.png" alt="" />
                                </div>
                                <div className="work-box">
                                    <div className="image">
                                        <img src="/assets/images/icon/Comparison.png" alt="" />
                                    </div>
                                    <div className="content">
                                        <p className="step">Step 3</p>
                                        <Link href="#" className="title">Make Predictions</Link>
                                        <p className="text">
                                        Utilize our AI-driven algorithms to analyze market data and predict Forex trends for smarter trading decisions.
                                        </p>
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
