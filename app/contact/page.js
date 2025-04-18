
import Layout from "@/components/layout/Layout"
import Link from "next/link"
export default function Contact() {

    return (
        <>

            <Layout headerStyle={1} footerStyle={2} breadcrumbTitle="Contact">
                <div>
                    <section className="contact">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-6 col-md-12">
                                    <div className="image">
                                        <img src="/assets/images/layout/contact.png" alt="" />
                                    </div>
                                </div>
                                <div className="col-xl-6 col-md-12">
                                    <div className="contact-main">
                                        <div className="block-text center">
                                            <h3 className="heading">Leave a message for us</h3>
                                            <p className="desc fs-20">Get in touch with Xpero </p>
                                        </div>
                                        <form>
                                            <div className="form-group">
                                                <label>Your name</label>
                                                <input type="text" className="form-control" placeholder="Enter your name" />
                                            </div>
                                            <div className="form-group">
                                                <label>Email </label>
                                                <input type="text" className="form-control" placeholder="Enter mail" />
                                            </div>
                                            <div className="form-group">
                                                <label>Subject </label>
                                                <input type="text" className="form-control" placeholder="Enter subject" />
                                                
                                                {/* <select className="form-control" id="exampleFormControlSelect1">
                                                    <option>NFT Items</option>
                                                    <option>NFT Items 1</option>
                                                    <option>NFT Items 1</option>
                                                </select> */}
                                            </div>
                                            <div className="form-group">
                                                <label>Message </label>
                                                <textarea cols={30} rows={10} className="form-control" placeholder="Enter your message" />
                                            </div>
                                            <button type="submit" className="btn-action">Send message</button>
                                        </form>
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