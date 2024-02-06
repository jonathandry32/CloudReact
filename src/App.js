import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import DetailAnnonce from './pages/DetailAnnonce';
import Favoris from './pages/Favoris';
import Profil from './pages/Profil';
import Login from './pages/Login';
import Logout from './pages/Deconnexion';
import Message from './pages/Message';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

function App() {
  return (
    <div className="sApp">
      <Router>
      <Navbar />
        <Routes>
          <Route excat path='/' element={<Home/>} />
          <Route excat path='/detailannonce/:id' element={<DetailAnnonce/>} />
          <Route excat path='/favoris' element={<Favoris/>} />
          <Route excat path='/profil' element={<Profil/>} />
          <Route excat path='/login' element={<Login/>} />
          <Route excat path='/logout' element={<Logout/>} />
          <Route excat path='/message/:id' element={<Message/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
