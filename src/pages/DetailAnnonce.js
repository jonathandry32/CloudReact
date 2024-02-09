import '../assets/css/detailannonce.css';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart, FaPhoneSquare } from 'react-icons/fa';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMessageCircle } from 'react-icons/fi';


export default function DetailAnnonce() {
    let navigate = useNavigate();
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const userId = JSON.parse(user);
    const [detailannonce, setDetailAnnonce] = useState({
        annonce: {
            idAnnonce: 0,
            description: '',
            proprietaire: {
                id: 0,
                nom: '',
                email: '',
                password: '',
                photoProfil: null,
            },
            modele: {
                idModele: 0,
                marque: {
                    nom: '',
                },
                nom: '',
            },
            carburant: {
                idCarburant: 0,
                nom: '',
            },
            boite: '',
            kilometrage: 0,
            date: [],
            prix: 0,
        },
        liked: false,
        photos: []
    });

    const { id } = useParams();

    useEffect(() => {
        loadDetailAnnonce();
    }, [id]);

    useEffect(() => {
        const carGallery = document.querySelector('.dcar-gallery');
        const mainImage = document.querySelector('.dmain-image');
        if (carGallery && mainImage) {
            carGallery.addEventListener('click', (event) => {
                if (event.target.classList.contains('dcar-image')) {
                    mainImage.src = event.target.src;
                    mainImage.alt = event.target.alt;
                }
            });
        }
        console.log(detailannonce);
        loadCategorie();
        loadBuy();
    }, [detailannonce]);

    const loadDetailAnnonce = async () => {
        try {
            const idToUse = userId ? userId.id : 0;
            const response = await axios.get(`http://localhost:8080/auth/annonces/details/${id}?idUser=` + idToUse, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setDetailAnnonce(response.data);
            setLiked(response.data.liked)

        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    const months = [
        "Jan", "Feb", "Mar", "Apr", "Mai", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const [categorie, setCategorie] = useState([]);
    const loadCategorie = async () => {
        const result = await axios.get("http://localhost:8080/auth/modele/categories/" + detailannonce.annonce.modele.idModele, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setCategorie(result.data);
    }
    const [isBuy, setBuy] = useState([]);
    const loadBuy = async () => {
        const idToUse = userId ? userId.id : 0;
        const result = await axios.get("http://localhost:8080/auth/venteannonce/check?idAnnonce=" + detailannonce.annonce.idAnnonce + "&&idUser=" + idToUse, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setBuy(result.data);
    }
    const onClickLiked = async (e, idAnnonce) => {
        e.preventDefault();
        console.log("liked");
        try {
            const params = new URLSearchParams();
            params.append("idAnnonce", idAnnonce);
            params.append("idUser", userId.id);
            await axios.delete("http://localhost:8080/annoncefavoris/unlike", {
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
            await axios.post("http://localhost:8080/annoncefavoris", params, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            window.location.reload();
        } catch (error) {
            navigate("/login");
        }
    };
    const acheter = async (e, idAnnonce) => {
        e.preventDefault();
        try {
            const params = new URLSearchParams();
            params.append("idAnnonce", idAnnonce);
            params.append("idUser", userId.id);
            await axios.post("http://localhost:8080/annonces/demandeachat", params, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            window.location.reload();
        } catch (error) {
            console.log(error);
            navigate("/login");
        }
    };

    const redirectToContactPage = (proprio) => {
        navigate(`/message/${proprio}`);
    };

    const [liked, setLiked] = useState(detailannonce.liked);

    const handleLike = () => {
        if (liked) {
            unlike();
        }
        else {
            like();
        }
        setLiked(!liked);
    };

    const unlike = async () => {
        console.log("unliked");
        try {
            const params = new URLSearchParams();
            params.append("idAnnonce", detailannonce.annonce.idAnnonce);
            params.append("idUser", userId.id);
            await axios.delete("http://localhost:8080/annoncefavoris/unlike", {
                params,
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            navigate("/login");
        }
    };

    const like = async () => {
        console.log("liked");
        try {
            const params = new URLSearchParams();
            params.append("idAnnonce", detailannonce.annonce.idAnnonce);
            params.append("idUser", userId.id);
            await axios.post("http://localhost:8080/annoncefavoris", params, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            navigate("/login");
        }
    };


    return (
        <>
            <div class="dcar-details-page">
                <div class="downer-info">
                    {detailannonce.annonce.proprietaire.photoProfil &&
                        <>
                            <img class="downer-avatar" src={detailannonce.annonce.proprietaire.photoProfil} alt="Avatar" />
                            <div>
                                <div class="downer-name">{detailannonce.annonce.proprietaire.nom}</div>
                                <div class="downer-timestamp">{detailannonce.annonce.date[2]} {months[detailannonce.annonce.date[1] - 1]} {detailannonce.annonce.date[0]} {detailannonce.annonce.date[3]}:{detailannonce.annonce.date[4]}</div>
                            </div>
                        </>
                    }
                </div>
                <div class="dmain-image-container">
                    {detailannonce.photos && detailannonce.photos.length > 0 && detailannonce.photos[0].lienPhoto ? (
                        <img class="dmain-image" src={detailannonce.photos[0].lienPhoto} alt="Voiture principale" />
                    ) : (
                        <img className="car-image" src="https://i.pinimg.com/736x/a4/2d/4b/a42d4ba0e127ea3f62026ace6803f94d.jpg" alt="imageCAR" />
                    )}
                </div>
                <div className="dcar-gallery">
                    {detailannonce.photos && detailannonce.photos.length > 0 ? (
                        detailannonce.photos.map((photo, index) => (
                            <img
                                key={index}
                                className="dcar-image"
                                src={photo.lienPhoto}
                                alt="v1"
                            />
                        ))
                    ) : (
                        <>
                            <img className="dcar-image" src="https://i.pinimg.com/736x/a4/2d/4b/a42d4ba0e127ea3f62026ace6803f94d.jpg" alt="v1" />
                            <img className="dcar-image" src="https://i.pinimg.com/736x/a4/2d/4b/a42d4ba0e127ea3f62026ace6803f94d.jpg" alt="v1" />
                            <img className="dcar-image" src="https://i.pinimg.com/736x/a4/2d/4b/a42d4ba0e127ea3f62026ace6803f94d.jpg" alt="v1" />
                            <img className="dcar-image" src="https://i.pinimg.com/736x/a4/2d/4b/a42d4ba0e127ea3f62026ace6803f94d.jpg" alt="v1" />
                        </>
                    )}
                </div>

                <div className="dannonceButtons">
                    <div onClick={handleLike} style={{ cursor: 'pointer', color: liked ? 'red' : 'inherit' }}>
                        {liked ? <FaHeart size={26} /> : <FaRegHeart size={22} />}
                    </div>
                    <div onClick={(e) => redirectToContactPage(detailannonce.annonce.proprietaire.id)} className="button-contact"><FiMessageCircle size={24} />Contacter</div>
                </div>

                <div class="dcar-details">
                    {detailannonce.annonce.status == 0 ? (
                        <p className="dstatusenvente">  En vente </p>
                    ) : (
                        <p className="dstatusvendu">  Vendu </p>
                    )}
                    <div className='marque'>{detailannonce.annonce.modele.marque.nom} {detailannonce.annonce.modele.nom}</div>
                    <div class="description">
                        <p>{detailannonce.annonce.description}</p>
                    </div>
                    <p class="prix">{detailannonce.annonce.prix.toLocaleString('en-US')} MGA</p>

                    {detailannonce.annonce.status == 0 && detailannonce.annonce.proprietaire.id !== userId?.id ? (
                        isBuy.toString() === 'false' ? (
                            <button className="dbuy-button"
                                onClick={(e) => acheter(e, detailannonce.annonce.idAnnonce)}
                            >
                                Acheter
                            </button>
                        ) : (
                            <button className="dbuy-button">
                                En cours de demande...
                            </button>
                        )
                    ) : (
                        <p></p>
                    )}
                    <div class="dcategory-list">
                        {
                            categorie.map((cat) => (
                                <div class="dcategory-item">{cat.categorie.nom}</div>
                            ))
                        }
                    </div>
                </div>

                <div class="dadditional-details">
                    <div class="ddetails-section">
                        <div className='details-name'>Source d'energie</div>
                        <div className='details-value'>{detailannonce.annonce.carburant.nom}</div>
                    </div>
                    <div class="ddetails-section">
                        <div className='details-name'>Boite de vitesse</div>
                        <div className='details-value'>{detailannonce.annonce.boite}</div>
                    </div>
                    <div class="ddetails-section">
                        <div className='details-name'>Kilometrage</div>
                        <div className='details-value'>{detailannonce.annonce.kilometrage} km </div>
                    </div>
                    <div class="ddetails-section">
                        <div className='details-name'>Histoire d'entretien</div>
                        <ul>
                            <li className='details-value'>Entretien régulier effectué chez le concessionnaire</li>
                            <li className='details-value'>Aucun accident signalé</li>
                        </ul>

                    </div>
                    <div class="ddetails-section">
                        <div className='details-name'>Contact</div>
                        <div className='details-value'>{detailannonce.annonce.contact}</div>
                    </div>
                </div>

                {/* <div className="dbutton-container">
                    <button className="dcontacter-button"
                        onClick={() => redirectToContactPage(detailannonce.annonce.proprietaire.id)}
                    ><FaPhoneSquare /> Contacter</button>
                    {detailannonce.liked.toString() === 'true' ? (
                        <button className="dfavoris-button"
                            onClick={(e) => onClickLiked(e, detailannonce.annonce.idAnnonce)}
                        ><FaHeart /> Supprimer favoris</button>
                    ) : (
                        <button className="dfavoris-button"
                            onClick={(e) => onClickDislike(e, detailannonce.annonce.idAnnonce)}
                        ><FaHeart /> Ajouter favoris</button>
                    )}
                </div> */}
            </div>
        </>
    )
}
