import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaEnvelope, FaHeart, FaUser, FaSignOutAlt, FaSignInAlt, FaSearch } from 'react-icons/fa';
import "../assets/css/Nav.css";
import logo from "../assets/img/omby.png";

export default function Navbar() {
  const user = localStorage.getItem('user');
  console.log(user);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const userId = JSON.parse(user);
  const redirectToMessage = () => {
    try{
      navigate(`/message/${userId.id}`);
    }
    catch(error){
      navigate('/login');
    }
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          <img src={logo} alt="Logo" style={{ width: '50px', height: '50px', marginRight: '15px' }} />
          <Link className="navbar-brand" to="/"> Ombaika-Mitady</Link>

          <div className="nav-container">
            <input
              className="form-control search-input"
              type="text"
              placeholder="Rechercher des annonces"
            />
          </div>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item" style={{marginTop: '0.5%', paddingTop: '0.5%'}} >
                <Link className="nav-link" to="/">
                  <FaHome />{' '}
                  <span className="link-text">Accueil</span>
                </Link>
              </li>
              <li className="nav-item" style={{marginTop: '0.5%', paddingTop: '0.5%'}} >
                {/* <Link className="nav-link" to="/message/${userId.id}">
                  <FaEnvelope />{' '}
                  <span className="link-text">Message</span>
                </Link> */}
                <button className="btn btn-link nav-link" onClick={redirectToMessage}>
                <FaEnvelope />{' '}
                <span className="link-text">Message</span>
              </button>
              </li>
              <li className="nav-item" style={{marginTop: '0.5%', paddingTop: '0.5%'}} >
                <Link className="nav-link" to="/favoris">
                  <FaHeart />{' '}
                  <span className="link-text">Favoris</span>
                </Link>
              </li>
              <li className="nav-item" style={{marginTop: '0.5%', paddingTop: '0.5%'}} >
                <Link className="nav-link" to="/profil">
                  <FaUser />{' '}
                  <span className="link-text">Profil</span>
                </Link>
              </li>
              {user == null ? (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  <button className="btn btn-outline-dark" type="button">
                    <FaSignInAlt />{' '}
                    <span className="link-text">Se connecter</span>
                  </button>
                </Link>
              </li>
              ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/logout">
                  <button className="btn btn-outline-dark" type="button">
                    <FaSignOutAlt />{' '}
                    <span className="link-text">Deconnexion</span>
                  </button>
                </Link>
              </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <br />
      <br />
    </div>
  );
}
