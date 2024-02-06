import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Deconnexion() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  }, [navigate]);

  return <div>Loading...</div>;
}

export default Deconnexion;
