import '../assets/css/annonce2.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaPhoneSquare } from 'react-icons/fa';
import axios from 'axios';
import { MdInsertPhoto } from "react-icons/md";
import { FiMessageCircle } from 'react-icons/fi';

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

    const [marques, setMarque] = useState([]);

    useEffect(() => {
        loadAnnonceEnVente();
        loadMarque();
    }, []);

    const loadMarque = async () => {
        const result = await axios.get("https://ombaikamitadyws-production-1616.up.railway.app/auth/marques", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setMarque(result.data);
    }         

    const loadAnnonceEnVente = async () => {
        const idToUse = userId ? userId.id : 0;
        const result = await axios.get(`https://ombaikamitadyws-production-1616.up.railway.app/auth/annonces/envente?idUser=${idToUse}`, {
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
    const filterAnnonces = () => {
        let filtered = allAnnonces.filter(annonce => {
            return (
                annonce.annonce.description.toLowerCase().includes(searchDescription.toLowerCase()) &&
                (searchMinPrice === "" || annonce.annonce.prix >= parseFloat(searchMinPrice)) &&
                (searchMaxPrice === "" || annonce.annonce.prix <= parseFloat(searchMaxPrice)) &&
                (searchMinDate === "" || new Date(annonce.annonce.date[0], annonce.annonce.date[1] - 1, annonce.annonce.date[2]) >= new Date(searchMinDate)) &&
                (searchMaxDate === "" || new Date(annonce.annonce.date[0], annonce.annonce.date[1] - 1, annonce.annonce.date[2]) <= new Date(searchMaxDate)) &&
                (searchModel === "" || annonce.annonce.modele.idModele == searchModel) &&
                (searchMarque === "" || annonce.annonce.modele.marque.idMarque == searchMarque)
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
        const result = await axios.get(`https://ombaikamitadyws-production-1616.up.railway.app/auth/modeles`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setModeles(result.data);
    };
    const loadModelesMarques = async () => {
        const result = await axios.get(`https://ombaikamitadyws-production-1616.up.railway.app/auth/modeles/${searchMarque}`, {
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

    const Annonce = ({ annonce }) => {
        const [liked, setLiked] = useState(annonce.liked);
        const [nombrePhotos, setNombrePhotos] = useState(annonce.photos.length);

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
            // e.preventDefault();
            console.log("liked");
            try {
                const params = new URLSearchParams();
                params.append("idAnnonce", annonce.annonce.idAnnonce);
                params.append("idUser", userId.id);
                await axios.delete("https://ombaikamitadyws-production-1616.up.railway.app/annoncefavoris/unlike", {
                    params,
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                // window.location.reload();
            } catch (error) {
                navigate("/login");
            }
        };

        const like = async () => {
            // e.preventDefault();
            console.log("disliked");
            try {
                const params = new URLSearchParams();
                params.append("idAnnonce", annonce.annonce.idAnnonce);
                params.append("idUser", userId.id);
                await axios.post("https://ombaikamitadyws-production-1616.up.railway.app/annoncefavoris", params, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                // window.location.reload();
            } catch (error) {
                navigate("/login");
            }
        };

        return (
            <div className="car-card">
                <div className="car-owner">

                    {annonce.annonce.proprietaire.photoProfil && annonce.annonce.proprietaire.photoProfil.includes("https:") ? (
                        <img className="owner-avatar" src={annonce.annonce.proprietaire.photoProfil} alt="PDP" />
                    ) : (
                        <img className="owner-avatar" src="https://i.pinimg.com/736x/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg" alt="PDP" />
                    )}
                    <div className="owner-info">
                        <p className="owner-name">{annonce.annonce.proprietaire.nom}</p>
                        <p className="owner-timestamp"> {annonce.annonce.date[2]} {months[annonce.annonce.date[1] - 1]} {annonce.annonce.date[0]} {annonce.annonce.date[3]}:{annonce.annonce.date[4]}</p>
                    </div>
                </div>
                <div className='imageContainer'>
                    {annonce.photos[0] &&
                        <>
                            <img className="car-image" src={annonce.photos[0].lienPhoto} onClick={() => redirectToDetailPage(annonce.annonce.idAnnonce)} alt="imageCAR" />

                            <div className='nombrePhotos'>
                                <span style={global.nombrePhotosNombre}>+{nombrePhotos}</span>
                                <MdInsertPhoto size={18} color="white" />
                            </div>
                        </>
                    }
                </div>
                <div className="car-details">
                    <div className='marque'>{annonce.annonce.modele.marque.nom} {annonce.annonce.modele.nom}</div>
                    <div className='description'>{annonce.annonce.description}</div>
                    <div className='prix'>{annonce.annonce.prix.toLocaleString('en-US')} MGA</div>
                </div>
                <div className="car-actions">
                    <div className='annonceButtons'>
                        <div onClick={handleLike} style={{ cursor: 'pointer', color: liked ? 'red' : 'inherit' }}>
                            {liked ? <FaHeart size={22} /> : <FaRegHeart size={22} />}
                        </div>

                        {userId && userId.id ? (
                            (annonce.annonce.proprietaire.id === userId.id ? (
                                <></>
                            ) : (
                                <div style={{ cursor: 'pointer' }}onClick={() => redirectToContactPage(annonce.annonce.proprietaire.id)}> <FiMessageCircle size={24} /> </div>
                            ))
                        ) : (
                            <></>
                        )}
                        <div className="annonceDate"> {annonce.annonce.date[2]} {months[annonce.annonce.date[1] - 1]} {annonce.annonce.date[0]} {annonce.annonce.date[3]}:{annonce.annonce.date[4]}</div>

                    </div>
                    {/* <button className="details-button" onClick={() => redirectToDetailPage(annonce.annonce.idAnnonce)}>Détails</button> */}
                </div>
            </div>
        );
    };


    return (
        <div className='home'>
            <div className='threeSpaces'>
                <div className='left'>
                    <div className='recommandations'>
                        <div >
                            <form className="filter" onSubmit={e => e.preventDefault()}>
                                <div className='form-element'>
                                    <label className='details-name' htmlFor="searchDescription">Description :</label>
                                    <input
                                        type="text"
                                        id="searchDescription"
                                        value={searchDescription}
                                        onChange={e => setSearchDescription(e.target.value)}
                                    />
                                </div>

                                <div className='form-element'>

                                    <label className='details-name' htmlFor="searchMarque">Marque :</label>
                                    <select
                                        id="searchMarque"
                                        value={searchMarque}
                                        onChange={e => setSearchMarque(e.target.value)}
                                    >
                                        <option value="">Toutes les marques</option>
                                    </select>
                                </div>

                                <div className='form-element'>

                                    <label className='details-name' htmlFor="searchModel">Modèle :</label>
                                    <select
                                        id="searchModel"
                                        value={searchModel}
                                        onChange={e => setSearchModel(e.target.value)}
                                    >
                                        <option value="">Tous les modèles</option>
                                    </select>
                                </div>

                                <div className='form-element'>

                                    <label className='details-name' htmlFor="searchMinPrice">Prix min :</label>
                                    <input
                                        type="number"
                                        id="searchMinPrice"
                                        value={searchMinPrice}
                                        onChange={e => setSearchMinPrice(e.target.value)}
                                    />

                                </div>
                                <div className='form-element'>

                                    <label className='details-name' htmlFor="searchMaxPrice">Prix max :</label>
                                    <input
                                        type="number"
                                        id="searchMaxPrice"
                                        value={searchMaxPrice}
                                        onChange={e => setSearchMaxPrice(e.target.value)}
                                    />
                                </div>
                                <div className='form-element'>

                                    <label className='details-name' htmlFor="searchMinDate">Date min :</label>
                                    <input
                                        type="date"
                                        id="searchMinDate"
                                        value={searchMinDate}
                                        onChange={e => setSearchMinDate(e.target.value)}
                                    />
                                </div>
                                <div className='form-element'>

                                    <label className='details-name' htmlFor="searchMaxDate">Date max :</label>
                                    <input
                                        type="date"
                                        id="searchMaxDate"
                                        value={searchMaxDate}
                                        onChange={e => setSearchMaxDate(e.target.value)}
                                    />
                                </div>

                                <div className='button-contact' onClick={() => filterAnnonces()}>Rechercher</div>
                            </form>
                        </div>

                    </div>
                </div>
                <div className="middle annonces">

                    {annoncesEnVente.map((annonce, index) => (
                        <Annonce annonce={annonce} />
                    ))}
                </div>
                <div className='right'>
                    <div className='messages'>
                        
                    </div>
                </div>

            </div>
        </div>
    );
}
