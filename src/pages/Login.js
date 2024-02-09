import '../assets/css/login.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaPhoneSquare } from 'react-icons/fa';
import axios from 'axios';

export default function Login() {
    let navigate = useNavigate();

    const [formData, setFormData] = useState({
        mail: "jett@gmail.com",
        password: "jett"
    });

    const [errors, setErrors] = useState({
        mail: null,
        password: null
    });

    const onInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        // Validation des champs
        if (!formData.mail) {
            setErrors({ ...errors, mail: 'Veuillez saisir votre email' });
            return;
        }
        if (!formData.password) {
            setErrors({ ...errors, password: 'Veuillez saisir votre mot de passe' });
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append("mail", formData.mail);
            params.append("password", formData.password);
            const result = await axios.post("https://ombaikamitadyws-production.up.railway.app/auth/login", params);
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.userId));
            navigate("/");
            window.location.reload();
        } catch (error) {
            setErrors({ ...errors, mail: null, password: 'Veuillez vérifier vos informations' });
        }
    };

    return (
            <div className="login-container">
                <h1>Se connecter</h1>
                <form className="row g-3 needs-validation" action="Login" method="post" onSubmit={(e) => onSubmit(e)} noValidate>
                    <div className="form-group">
                        <label htmlFor="username">Email:</label>
                        <input type="text" name="mail" className={`form-control ${errors.mail ? 'is-invalid' : ''}`} id="username" value={formData.mail} onChange={(e) => onInputChange(e)} required />
                        {errors.mail && (
                            <div className="invalid-feedback">
                                {errors.mail}
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} id="password" value={formData.password} onChange={(e) => onInputChange(e)} required />
                        {errors.password && (
                            <div className="invalid-feedback">
                                {errors.password}
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
    );
}
