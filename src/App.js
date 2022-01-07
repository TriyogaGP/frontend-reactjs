import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Profile from './Components/Profile';
import Login from './Components/Login';
import Bootcamp from './Components/Master/Bootcamp';
import Pengguna from './Components/Master/Pengguna';
import Register from './Components/Register';
import Lockscreen from './Components/Lockscreen';
import VerificationAkun from './Components/VerificationAkun';
import Layout from './Layout/Layout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verifikasiAkun' element={<VerificationAkun />} />
        <Route path='/lockscreen' element={<Lockscreen />} />
        <Route exact path='/dashboard' element={<div className='wrapper'><Layout /><Dashboard title='Dashboard'/></div>} />
        <Route exact path='/profile' element={<div className='wrapper'><Layout /><Profile title='Profile'/></div>} />
        <Route path='/pengguna' element={<div className='wrapper'><Layout /><Pengguna /></div>} />
        <Route path='/bootcamp' element={<div className='wrapper'><Layout /><Bootcamp title='Data Bootcamp' /></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
