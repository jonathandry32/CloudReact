import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaPhoneSquare } from 'react-icons/fa';
import axios from 'axios';

export default function Favoris() {
    let navigate = useNavigate();
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const userId = JSON.parse(user);
    const [annoncesEnVente, setAnnoncesEnVente] = useState([]);

    useEffect(() => {
        loadAnnonceEnVente();
    }, []);

    const loadAnnonceEnVente = async () => {
        try {
            const result = await axios.get("https://ombaikamitadyws-production-1616.up.railway.app/annoncefavoris/users/" + userId.id, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAnnoncesEnVente(result.data);
        } catch (error) {
            console.log(error);
            navigate('/login');
        }
    };

    const redirectToDetailPage = (idAnnonce) => {
        navigate(`/detailannonce/${idAnnonce}`);
    };

    const months = [
        "Jan", "Feb", "Mar", "Apr", "Mai", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const onClick = async (e, idAnnonce) => {
        e.preventDefault();
        try {
            if (e.target.name === "liked") {
                const params = new URLSearchParams();
                params.append("idAnnonce", idAnnonce);
                params.append("idUser", userId.id);
                await axios.delete("https://ombaikamitadyws-production-1616.up.railway.app/annoncefavoris/unlike", params, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
            else if (e.target.name === "disliked") {
                const params = new URLSearchParams();
                params.append("idAnnonce", idAnnonce);
                params.append("idUser", userId.id);
                await axios.post("https://ombaikamitadyws-production-1616.up.railway.app/annoncefavoris", params, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            navigate("/login");
        }
    };
    const onClickLiked = async (e, idAnnonce) => {
        e.preventDefault();
        console.log("liked");
        try {
            const params = new URLSearchParams();
            params.append("idAnnonce", idAnnonce);
            params.append("idUser", userId.id);
            await axios.delete("https://ombaikamitadyws-production-1616.up.railway.app/annoncefavoris/unlike", {
                params,
                headers: { 'Authorization': `Bearer ${token}` }
            });
            window.location.reload();
        } catch (error) {
            navigate("/login");
        }
    };
    const onClickDislike = async (e, idAnnonce) => {
        e.preventDefault();
        console.log("disliked");
        try {
            const params = new URLSearchParams();
            params.append("idAnnonce", idAnnonce);
            params.append("idUser", userId.id);
            await axios.post("https://ombaikamitadyws-production-1616.up.railway.app/annoncefavoris", params, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            window.location.reload();
        } catch (error) {
            navigate("/login");
        }
    };

    return (
        <>

            <h4 style={{ textAlign: 'center', marginTop: '5px' }}>Mes favoris:</h4>
            <div>
                <div className="Fgrid-container">
                    {annoncesEnVente.map((annonce, index) => (
                        <div className="car-card" key={index}>
                            {annonce.annonce.status == 0 ? (
                                <div>
                                    <></>
                                </div>
                            ) : (
                                <div className="for-sale-badge-vendu">
                                    <span className="badge-text-vendu">Vendu</span>
                                </div>
                            )}

                            <div className='fcard-container'>

                                <img className="car-image" src={annonce.photos[0].lienPhoto} onClick={() => redirectToDetailPage(annonce.annonce.idAnnonce)} alt="imageCAR" />
                                <div className="fcar-owner">
                                    <img className="fowner-avatar" src={annonce.annonce.proprietaire.photoProfil} alt="PDP" />
                                    {/* <div className="owner-info">
                                    <p className="owner-name">{annonce.annonce.proprietaire.nom}</p>
                                </div> */}
                                </div>
                            </div>


                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
