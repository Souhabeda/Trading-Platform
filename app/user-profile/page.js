'use client'

import Layout from "@/components/layout/Layout"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import PhoneInput from "react-phone-input-2"
import 'react-toastify/dist/ReactToastify.css'
import 'react-phone-input-2/lib/style.css'
import { useRouter } from "next/navigation";


export default function UserProfile() {
    const [flatTabs, setFlatTabs] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const handleFlatTabs = (index) => setFlatTabs(index)
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        country: "",
        phone: "",
        gender: ""
    })
    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });

    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) return

        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
            headers: { Authorization: token }
        })
            .then(res => setUser(res.data.user))
            .catch(err => toast.error(err.response?.data?.msg || "Erreur"))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        setIsSubmitting(true)
        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, user, {
                headers: { Authorization: token }
            })
            toast.success(res.data.msg || "Profile updated successfully")
        } catch (err) {
            toast.error(err.response?.data?.msg || "Erreur de mise à jour")
        } finally {
            setIsSubmitting(false)
        }
    }

    // handleChange 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    // handlePhoneChange
    const handlePhoneChange = (value) => {
        const cleanPhone = value.startsWith('+') ? value : `+${value}`
        setUser({ ...user, phone: cleanPhone })
    };
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    // handleChangePasswor
    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return toast.error("Token manquant");

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/change-password`, passwordData, {
                headers: {
                    Authorization: token
                }
            });
            toast.success(res.data.msg || "Mot de passe changé avec succès");

            // Reset les champs
            setPasswordData({
                old_password: "",
                new_password: "",
                confirm_password: ""
            });
        } catch (err) {
            toast.error(err.response?.data?.msg || "Erreur lors du changement de mot de passe");
        }
    };

    // handleDeleteAccount
    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible.")
        if (!confirmed) return

        const password = window.prompt("Veuillez entrer votre mot de passe pour confirmer la suppression de votre compte :")
        if (!password) return toast.error("Mot de passe requis pour supprimer votre compte")

        const token = localStorage.getItem("token")
        if (!token) return toast.error("Token manquant")

        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete-account`, {
                headers: { Authorization: token },
                data: { password } 
            })
            toast.success(res.data.msg || "Compte supprimé avec succès")
            localStorage.removeItem("token")
            setTimeout(() => router.push("/"), 2000)
        } catch (err) {
            toast.error(err.response?.data?.msg || "Erreur lors de la suppression du compte")
        }
    }


    return (
        <>
            <Layout headerStyle={1} footerStyle={2} breadcrumbTitle="User Profile">
                <div>
                    <section className="user-profile flat-tabs">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-3 col-md-12">
                                    <div className="user-info center">
                                        <div className="avt">
                                            <input type="file" className="custom-file-input" id="imgInp" required />
                                            <img id="blah" src="/assets/images/avt/avt.png" alt="no file" />
                                        </div>
                                        <h6 className="name">{user.first_name} {user.last_name}</h6>
                                        <p>{user.email}</p>
                                    </div>
                                    <ul className="menu-tab">
                                        <li className={flatTabs === 1 ? "active" : ""} onClick={() => handleFlatTabs(1)}>
                                            <h6 className="fs-16">
                                                <svg width={20} height={24} viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10.2766 12.854C10.2994 12.854 10.3221 12.854 10.3495 12.854C10.3586 12.854 10.3677 12.854 10.3768 12.854C10.3905 12.854 10.4087 12.854 10.4224 12.854C11.7572 12.8312 12.8369 12.362 13.6342 11.4645C15.3881 9.48733 15.0966 6.09787 15.0647 5.77441C14.9508 3.3462 13.8027 2.18449 12.8551 1.64236C12.149 1.2369 11.3244 1.01822 10.4041 1H10.3723C10.3677 1 10.3586 1 10.354 1H10.3267C9.82101 1 8.82786 1.082 7.87571 1.62414C6.91901 2.16627 5.75274 3.32798 5.63885 5.77441C5.60696 6.09787 5.31539 9.48733 7.06935 11.4645C7.86205 12.362 8.94176 12.8312 10.2766 12.854ZM6.85523 5.8883C6.85523 5.87464 6.85978 5.86097 6.85978 5.85186C7.01012 2.5854 9.32899 2.2346 10.3221 2.2346H10.3404C10.3495 2.2346 10.3631 2.2346 10.3768 2.2346C11.6069 2.26194 13.6979 2.76307 13.8392 5.85186C13.8392 5.86552 13.8392 5.87919 13.8437 5.8883C13.8483 5.92019 14.1672 9.01809 12.7185 10.649C12.1444 11.296 11.3791 11.6149 10.3723 11.624C10.3631 11.624 10.3586 11.624 10.3495 11.624C10.3404 11.624 10.3358 11.624 10.3267 11.624C9.32444 11.6149 8.55452 11.296 7.98505 10.649C6.54088 9.02721 6.85067 5.91564 6.85523 5.8883Z" fill="white" stroke="white" strokeWidth="0.4" />
                                                    <path d="M19.7116 18.4778C19.7116 18.4733 19.7116 18.4687 19.7116 18.4642C19.7116 18.4277 19.7071 18.3913 19.7071 18.3503C19.6797 17.4482 19.6205 15.3389 17.6433 14.6647C17.6297 14.6601 17.6114 14.6556 17.5978 14.651C15.5431 14.1271 13.8347 12.9426 13.8165 12.9289C13.5386 12.733 13.1559 12.8014 12.96 13.0793C12.7641 13.3572 12.8325 13.7399 13.1104 13.9358C13.1878 13.9904 15.001 15.2524 17.2697 15.8355C18.3312 16.2136 18.4497 17.348 18.4816 18.3867C18.4816 18.4277 18.4816 18.4642 18.4861 18.5006C18.4907 18.9106 18.4633 19.5439 18.3905 19.9083C17.6524 20.3274 14.7595 21.7762 10.3587 21.7762C5.9761 21.7762 3.06499 20.3229 2.3224 19.9038C2.24951 19.5393 2.21762 18.9061 2.22673 18.496C2.22673 18.4596 2.23129 18.4232 2.23129 18.3822C2.26318 17.3434 2.38163 16.2091 3.44311 15.8309C5.71186 15.2478 7.52504 13.9813 7.60249 13.9312C7.88039 13.7353 7.94873 13.3526 7.75283 13.0747C7.55693 12.7968 7.17425 12.7285 6.89635 12.9244C6.87813 12.9381 5.17884 14.1225 3.1151 14.6464C3.09688 14.651 3.08321 14.6556 3.06954 14.6601C1.09235 15.3389 1.03313 17.4482 1.0058 18.3457C1.0058 18.3867 1.0058 18.4232 1.00124 18.4596C1.00124 18.4642 1.00124 18.4687 1.00124 18.4733C0.996684 18.7102 0.992129 19.9265 1.23358 20.537C1.27914 20.6555 1.36114 20.7557 1.47048 20.824C1.60715 20.9151 4.88272 23.0017 10.3633 23.0017C15.8438 23.0017 19.1194 20.9106 19.256 20.824C19.3608 20.7557 19.4474 20.6555 19.4929 20.537C19.7207 19.9311 19.7162 18.7147 19.7116 18.4778Z" fill="white" stroke="white" strokeWidth="0.4" />
                                                </svg>
                                                User Profile
                                            </h6>
                                        </li>
                                        <li className={flatTabs === 2 ? "active" : ""} onClick={() => handleFlatTabs(2)}>
                                            <h6 className="fs-16">
                                                <svg width={20} height={24} viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17 8.00002V7.00003C17 3.141 13.86 0 9.99999 0C6.13997 0 3 3.141 3 6.99998V7.99997C1.34602 7.99997 0 9.34598 0 11V21C0 22.654 1.34602 24 3 24H17C18.654 24 20 22.654 20 21V11C20 9.34598 18.654 8.00002 17 8.00002ZM4.99997 6.99998C4.99997 4.24298 7.24299 1.99997 9.99999 1.99997C12.757 1.99997 15 4.24298 15 6.99998V7.99997H4.99997V6.99998ZM18 21C18 21.552 17.551 22 17 22H3C2.44899 22 2.00002 21.552 2.00002 21V11C2.00002 10.448 2.44903 10 3 10H17C17.551 10 18 10.448 18 11V21Z" fill="#3772FF" />
                                                    <path d="M10 11.5C8.34602 11.5 7 12.846 7 14.5C7 15.802 7.83902 16.902 9.00002 17.316V19C9.00002 19.553 9.448 20 10 20C10.552 20 11 19.553 11 19V17.316C12.161 16.902 13 15.802 13 14.5C13 12.846 11.654 11.5 10 11.5ZM10 15.5C9.44898 15.5 9.00002 15.052 9.00002 14.5C9.00002 13.948 9.44898 13.5 10 13.5C10.551 13.5 11 13.948 11 14.5C11 15.052 10.551 15.5 10 15.5Z" fill="#3772FF" />
                                                </svg>
                                                Change password
                                            </h6>
                                        </li>
                                        <li className={flatTabs === 3 ? "active" : ""} onClick={() => handleFlatTabs(3)}>
                                            <h6 className="fs-16">
                                                <svg width="24" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 3H15M4 6H20M19 6L18.2929 19.2929C18.1941 20.8432 16.8432 22 15.2929 22H8.70711C7.15685 22 5.80591 20.8432 5.70711 19.2929L5 6M10 10V17M14 10V17"
                                                        stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Delete Account
                                            </h6>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-xl-9 col-md-12">
                                    <div className="content-tab">
                                        <div className="content-inner profile" style={{ display: `${flatTabs === 1 ? "block" : "none"}` }}>
                                            <form onSubmit={handleSubmit}>
                                                <h4>User Profile</h4>
                                                <h6>Infomation</h6>
                                                <div className="form-group d-flex s1">
                                                    <input
                                                        type="text"
                                                        name="first_name"
                                                        value={user.first_name}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        placeholder="First Name"
                                                    />

                                                    <input
                                                        type="text"
                                                        name="last_name"
                                                        value={user.last_name}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        placeholder="Last Name"
                                                    />
                                                </div>
                                                <div className="form-group d-flex">
                                                    <input type="email" className="form-control" value={user.email} readOnly />
                                                    <div className="sl" style={{ flex: 1 }}>
                                                        <PhoneInput
                                                            country={'tn'}
                                                            value={user.phone ? user.phone.replace('+', '') : ''}
                                                            onChange={handlePhoneChange}
                                                            inputClass="form-control"
                                                            containerClass="phone-input-container"
                                                            inputStyle={{ padding: '25px 0 25px 50px' }}
                                                        />

                                                    </div>
                                                </div>
                                                <div className="form-group d-flex s1">
                                                    <input
                                                        type="text"
                                                        value={user.country}
                                                        readOnly
                                                        className="form-control"
                                                        placeholder="Country"
                                                    />
                                                    <select
                                                        className="form-control"
                                                        value={user.gender}
                                                        onChange={(e) => setUser({ ...user, gender: e.target.value })}
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                    </select>

                                                </div>
                                                <button type="submit" disabled={isSubmitting} className="btn-action style-2">
                                                    {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                                                </button>
                                                {/* <button type="submit" >Update Profile</button> */}
                                            </form>
                                        </div>
                                        <div className="content-inner profile change-pass" style={{ display: `${flatTabs === 2 ? "block" : "none"}` }}>
                                            <h4>Change Password</h4>
                                            <form onSubmit={handleChangePasswordSubmit}>
                                                <div className="form-group">
                                                    <div>
                                                        <label>Old Password<span>*</span>:</label>
                                                        <input
                                                            type="password"
                                                            name="old_password"
                                                            className="form-control"
                                                            value={passwordData.old_password}
                                                            onChange={handlePasswordChange}
                                                            placeholder="Old Password"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>New Password<span>*</span>:</label>
                                                        <input
                                                            type="password"
                                                            name="new_password"
                                                            className="form-control"
                                                            value={passwordData.new_password}
                                                            onChange={handlePasswordChange}
                                                            placeholder="New Password"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div>
                                                        <label>Confirm Password<span>*</span>:</label>
                                                        <input
                                                            type="password"
                                                            name="confirm_password"
                                                            className="form-control"
                                                            value={passwordData.confirm_password}
                                                            onChange={handlePasswordChange}
                                                            placeholder="Confirm Password"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <button type="submit" className="btn-action">
                                                    Change Password
                                                </button>
                                            </form>
                                        </div>

                                        <div className="content-inner delete-account" style={{ display: `${flatTabs === 3 ? "block" : "none"}` }}>
                                            <h4>Delete Account</h4>
                                            <h4 className="text-danger">⚠️ This action is irreversible</h4>
                                            <p>
                                                Deleting your account will permanently remove all your data, transaction history, and settings.
                                                Please proceed with caution.
                                            </p>

                                            <div className="main">
                                                <h6>Are you sure you want to delete your account?</h6>
                                                <p className="text-muted mb-3">
                                                    You will be logged out immediately and your account will be scheduled for deletion.
                                                </p>

                                                <button
                                                    className="btn-action bg-danger text-white"
                                                    onClick={handleDeleteAccount}
                                                    style={{ backgroundColor: '#FF3B30', color: '#fff' }}

                                                >
                                                    Delete My Account
                                                </button>
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