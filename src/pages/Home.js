import '../assets/css/annonce.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaPhoneSquare } from 'react-icons/fa';
import axios from 'axios';

export default function Home() {
    let navigate = useNavigate();
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const userId = JSON.parse(user);
    const [annoncesEnVente, setAnnoncesEnVente] = useState([]);
    const [allAnnonces, setAllAnnonces] = useState([]);
    const [searchDescription, setSearchDescription] = useState("");
    const [searchMarque, setSearchMarque] = useState("");
    const [searchModel, setSearchModel] = useState("");
    const [searchMinPrice, setSearchMinPrice] = useState("");
    const [searchMaxPrice, setSearchMaxPrice] = useState("");
    const [searchMinDate, setSearchMinDate] = useState("");
    const [searchMaxDate, setSearchMaxDate] = useState("");

    const [marques,setMarque]=useState([]);

    useEffect(() => {
        loadAnnonceEnVente();
        loadMarque();
    }, []);
    
    const loadMarque =async ()=>{
        const result=await axios.get("http://localhost:8080/auth/marques", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setMarque(result.data);
    }

    const loadAnnonceEnVente = async () => {
        const idToUse = userId ? userId.id : 0;
        const result = await axios.get(`http://localhost:8080/auth/annonces/envente?idUser=${idToUse}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setAllAnnonces(result.data);
        setAnnoncesEnVente(result.data);
        console.log(result.data);
    };
    

    const redirectToDetailPage = (idAnnonce) => {
        navigate(`/detailannonce/${idAnnonce}`);
    };
    
    const redirectToContactPage = (proprio) => {
        navigate(`/message/${proprio}`);
    };

    const months = [
        "Jan", "Feb", "Mar", "Apr", "Mai", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
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
    const filterAnnonces = () => {
        let filtered = allAnnonces.filter(annonce => {
            return (
                annonce.annonce.description.toLowerCase().includes(searchDescription.toLowerCase()) &&
                (searchMinPrice === "" || annonce.annonce.prix >= parseFloat(searchMinPrice)) &&
                (searchMaxPrice === "" || annonce.annonce.prix <= parseFloat(searchMaxPrice)) &&
                (searchMinDate === "" || new Date(annonce.annonce.date[0],annonce.annonce.date[1]-1,annonce.annonce.date[2]) >= new Date(searchMinDate)) &&
                (searchMaxDate === "" || new Date(annonce.annonce.date[0],annonce.annonce.date[1]-1,annonce.annonce.date[2]) <= new Date(searchMaxDate)) &&
                (searchModel === "" || annonce.annonce.modele.idModele==searchModel) &&
                (searchMarque === "" || annonce.annonce.modele.marque.idMarque==searchMarque)
            );
        });

        setAnnoncesEnVente(filtered);
    };

    useEffect(() => {
        filterAnnonces();
    }, [searchDescription, searchMinPrice, searchMaxPrice, searchMinDate, searchMaxDate, searchModel, searchMarque]);
    
    const [modeles, setModeles] = useState([]);
    useEffect(() => {
        if (searchMarque === "") {
            loadModeles();
        } else {
            loadModelesMarques();
        }
    }, [searchMarque]);

    const loadModeles = async () => {
        const result = await axios.get(`http://localhost:8080/auth/modeles`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setModeles(result.data);
    };
    const loadModelesMarques = async () => {
        const result = await axios.get(`http://localhost:8080/auth/modeles/${searchMarque}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setModeles(result.data);
    };
    const resetForm = () => {
        setSearchDescription("");
        setSearchMarque("");
        setSearchModel("");
        setSearchMinPrice("");
        setSearchMaxPrice("");
        setSearchMinDate("");
        setSearchMaxDate("");
    };
    
    return (
        <>
            <body>
                <form>
                    <div className="search-bar">
                        <label htmlFor="searchDescription">Description :</label>
                        <input
                            type="text"
                            id="searchDescription"
                            value={searchDescription}
                            onChange={e => setSearchDescription(e.target.value)}
                        />

                        <label htmlFor="searchMarque">Marque :</label>
                        <select
                            id="searchMarque"
                            value={searchMarque}
                            onChange={e => setSearchMarque(e.target.value)}
                        >
                            <option value="">Toutes les marques</option>
                            {
                                marques.map((m)=>(
                                    <option value={m.idMarque}>{m.nom}</option>
                                ))
                            }
                        </select>

                        <label htmlFor="searchModel">Modèle :</label>
                        <select
                            id="searchModel"
                            value={searchModel}
                            onChange={e => setSearchModel(e.target.value)}
                        >
                            <option value="">Tous les modèles</option>
                            {
                                modeles.map((modele) => (
                                    <option value={modele.idModele}>{modele.nom}</option>
                                ))
                            }
                        </select>
                        </div>
            <div className="search-bar">
                        <label htmlFor="searchMinPrice">Prix min :</label>
                        <input
                            type="number"
                            id="searchMinPrice"
                            value={searchMinPrice}
                            onChange={e => setSearchMinPrice(e.target.value)}
                        />

                        <label htmlFor="searchMaxPrice">Prix max :</label>
                        <input
                            type="number"
                            id="searchMaxPrice"
                            value={searchMaxPrice}
                            onChange={e => setSearchMaxPrice(e.target.value)}
                        />
                    </div>
            <div className="search-bar">
                        <label htmlFor="searchMinDate">Date min :</label>
                        <input
                            type="date"
                            id="searchMinDate"
                            value={searchMinDate}
                            onChange={e => setSearchMinDate(e.target.value)}
                        />

                        <label htmlFor="searchMaxDate">Date max :</label>
                        <input
                            type="date"
                            id="searchMaxDate"
                            value={searchMaxDate}
                            onChange={e => setSearchMaxDate(e.target.value)}
                        />
                    <button type="reset" onClick={() => resetForm()}>Réinitialiser</button>
                </div>
                </form>
                <div className="grid-container">
                
                    {annoncesEnVente.map((annonce, index) => (
                        <div className="car-card" key={index}>
                            {annonce.annonce.status==0?(
                            <div className="for-sale-badge-envente">
                                <span className="badge-text-envente">En vente</span>
                            </div>
                            ):(
                            <div className="for-sale-badge-vendu">
                                <span className="badge-text-vendu">Vendu</span>
                            </div>
                            )}
                            <div className="car-owner">
               
                            {annonce.annonce.proprietaire.photoProfil && annonce.annonce.proprietaire.photoProfil.includes("https:") ? (
                                <img className="owner-avatar" src={annonce.annonce.proprietaire.photoProfil} alt="PDP" />
                                ) : (
                                <img className="owner-avatar" src="https://i.pinimg.com/736x/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg" alt="PDP" />
                            )}
                                <div className="owner-info">
                                    <p className="owner-name">{annonce.annonce.proprietaire.nom}</p>
                                    <p className="owner-timestamp"> {annonce.annonce.date[2]} {months[annonce.annonce.date[1]-1]} {annonce.annonce.date[0]} {annonce.annonce.date[3]}:{annonce.annonce.date[4]}</p>
                                </div>
                            </div>
                            {annonce.photos && annonce.photos.length > 0 && annonce.photos[0].lienPhoto ? (
                                <img className="car-image" src={annonce.photos[0].lienPhoto} alt="imageCAR" />
                            ) : (
                                <img className="car-image" src="https://i.pinimg.com/736x/a4/2d/4b/a42d4ba0e127ea3f62026ace6803f94d.jpg" alt="imageCAR" />
                            )}
                            <div className="car-details">
                                <h2>{annonce.annonce.modele.marque.nom} {annonce.annonce.modele.nom}</h2>
                                <p>{annonce.annonce.description}</p>
                                <br />
                                <b>Prix: {annonce.annonce.prix.toLocaleString('en-US')} MGA</b>
                            </div>
                            <div className="car-actions">
                                <div>
                                    {annonce.liked.toString() === 'true' ? (
                                        <button 
                                            style={{ fontSize: '1.5em', border: 'none', backgroundColor: '#f8f8f8' }}
                                            onClick={(e) => onClickLiked(e, annonce.annonce.idAnnonce)}
                                        >
                                        <FaHeart className="nav-icons" style={{ color: 'red' }} />
                                    </button>
                                        ) : (
                                            <button 
                                            style={{ fontSize: '1.5em', border: 'none', backgroundColor: '#f8f8f8' }}
                                            onClick={(e) => onClickDislike(e, annonce.annonce.idAnnonce)}
                                        >
                                            <FaRegHeart className="nav-icons" />
                                        </button>
                                    )}
                                    {userId && userId.id ? (
                                        (annonce.annonce.proprietaire.id === userId.id ? (
                                            <p></p>
                                        ) : (
                                            <button style={{ fontSize: '1.5em',border:'none',backgroundColor:'#f8f8f8' }}
                                            onClick={() => redirectToContactPage(annonce.annonce.proprietaire.id)}
                                            > <FaPhoneSquare className="nav-icons" /> </button>
                                        ))
                                    ) : (
                                        <p></p>
                                    )}
                                    </div>
                                <button className="details-button" onClick={() => redirectToDetailPage(annonce.annonce.idAnnonce)}>Détails</button>
                            </div>
                        </div>
                    ))}
                </div>
            </body>
        </>
    );
}
