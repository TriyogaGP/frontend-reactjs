import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router';
import jwt_decode from "jwt-decode";
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import env from "react-dotenv";
import Swal from "sweetalert2";

function Layout() {
	const [values, setValues] = useState({})
	const [expire, setExpire] = useState('');
	const navigate = useNavigate();
	const location = useLocation();
	const roleID = localStorage.getItem('roleID')
	const namaLengkap = localStorage.getItem('namaLengkap')
	const accessToken = localStorage.getItem('access_token')
	
	useEffect(() => {
		cekData()	
	},[location])

	const getData = async() => {
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleLogin/getusers/${localStorage.getItem('idProfile')}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});
			setValues(response.data.data);
		} catch (error) {
			console.log(error.response.data)
			ResponToast('info', error.response.data.message)
			navigate('/lockscreen');
		}
	}

	const refreshToken = async() => {
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleLogin/token/${localStorage.getItem('idProfile')}`);
			localStorage.setItem('access_token', response.data.access_token)
			const decoded = jwt_decode(response.data.access_token);
			setExpire(decoded.exp);
		} catch (error) {
			if(error.response){
				navigate('/');
			}
		}
	}

	const axiosJWT = axios.create();

	axiosJWT.interceptors.request.use(async(config) => {
		const currentDate = new Date();
		if(expire * 1000 < currentDate.getTime()){
				const response = await axios.get(`${env.SITE_URL}restApi/moduleLogin/token/${localStorage.getItem('idProfile')}`);
				config.headers.Authorization = `Bearer ${response.data.access_token}`;
				localStorage.setItem('access_token', response.data.access_token)
				const decoded = jwt_decode(response.data.access_token);
				setExpire(decoded.exp);
		}
		return config;
	}, (error) => {
		return Promise.reject(error);
	});

	const ResponToast = (icon, msg) => {
    Swal.fire({  
      title: 'Pemberitahuan',  
      text: msg,  
      icon: icon,    
			confirmButtonText: 'Tutup',
			allowOutsideClick: false
    });
	}
	
	const cekData = () => {
		if(accessToken == null || values.activeAkun === 0){
			ResponToast('error', 'Anda tidak boleh masuk panel ini, Login terlebih dahulu .. Terima Kasih !')
			localStorage.clear()
			navigate('/');
		}else{
			// refreshToken()
			getData()
		}
	}

	return (
		<>
			<Header namaLengkap={namaLengkap} dataUser={values} />
			<Menu roleID={roleID} namaLengkap={namaLengkap} dataUser={values} />
			<Footer />			
		</>
	)
}

export default Layout
