import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import env from "react-dotenv";
import Swal from "sweetalert2"; 

function VerificationAkun() {	
	const hours = 0, minutes = 5, seconds = 0
  const [[hrs, mins, secs], setTime] = useState([hours, minutes, seconds]);
	const [values, setValues] = useState({
		kodeVerifikasi: '',
	});
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		if(localStorage.getItem('kodeOTP') === null || localStorage.getItem('kodeOTP') === 'undefined') return navigate('/register') 
		timerMundur()	
		window.addEventListener('beforeunload', (event) => {
      unloadCallback(event)
    });
	}, [hrs, mins, secs])

	const timerMundur = (e) => {
		const timer = setTimeout(() => {
			tick()
		}, 1000);

		return () => clearTimeout(timer);
	}

	const unloadCallback = (event) => {
		event.preventDefault();
		event.returnValue = "";
		localStorage.removeItem('kodeOTP')
		localStorage.removeItem('dataReg')
	};

	const handleChange = (e) => {
		const { name, value } = e.target
		setValues({
			...values,
			[name]: value
		})
	}

	const validateInput = (values) => {
		let error = {}
		if(!values.kodeVerifikasi.trim()){
			error.kode = 'Kode Verifikasi tidak boleh kosong'
		}

		return error
	}

	const tick = () => {
		if (hrs === 0 && mins === 0 && secs === 0){
			localStorage.removeItem('kodeOTP')
			ResponToast('info', 'Waktu habis')
			reset()
		} else if (mins === 0 && secs === 0) {
			setTime([hrs - 1, 59, 59]);
		} else if (secs === 0) {
			setTime([hrs, mins - 1, 59]);
		} else {
			setTime([hrs, mins, secs - 1]);
		}
	};
	
	const reset = () => setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);
	
	const Loading = (msg) => {
    Swal.fire({
			title: 'Harap Menunggu',
			html: msg,
			allowOutsideClick: false,
			showConfirmButton: false,
		});
		Swal.showLoading()
	}

	const ResponToast = (icon, msg) => {
		Swal.fire({  
      title: 'Pemberitahuan',  
      text: msg,  
      icon: icon,    
			confirmButtonText: 'Tutup',
			allowOutsideClick: false
    });
	}

	const confirm = async(e) => {
		e.preventDefault();
		setErrors(validateInput(values))
		if(values.kodeVerifikasi !== localStorage.getItem('kodeOTP')) return ResponToast('info', 'Kode Verifikasi tidak cocok')
		let dataRender = JSON.parse(localStorage.getItem("dataReg"));
		setTimeout(() => {
			Loading('Sedang melakukan proses penyimpanan ke database')
		}, 2000);
		try {
			const register = await axios.post(`${env.SITE_URL}restApi/moduleLogin/confirmation`, {
				name: dataRender.name,
				email: dataRender.email,
				password: dataRender.password,
				kodeOTP: dataRender.kodeOTP,
				roleID: dataRender.roleID
			});
			// console.log(register)
			localStorage.removeItem('kodeOTP')
			localStorage.removeItem('dataReg')
			Swal.hideLoading()
			ResponToast('success', register.data.message)
			navigate('/');
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				ResponToast('error', message)
			}
		}
	}
	
	return (
		<div>
			<div className="lockscreen-wrapper">
				<div className="lockscreen-logo">
					<a href="../../index2.html"><b>Aplikasi</b></a>
				</div>
				<div className="lockscreen-logo">
					<p>{`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}</p>
				</div>
				<div className="lockscreen-item" style={{width: '100%'}}>
					<div className="lockscreen-image">
						<img src='dist/img/otp.png' alt="User Image" />
					</div>
					<div className="lockscreen-credentials">
						<div className="input-group">
							<input type="text" className="form-control" name='kodeVerifikasi' placeholder="Masukan kode verifikasi" autoComplete="off" value={values.kodeVerifikasi} onChange={handleChange} />
							<div className="input-group-append">
								<button type="button" className="btn">
									<i onClick={confirm} className="fas fa-arrow-right text-muted" />
								</button>
							</div>
						</div>
					</div>
				</div>
				<p className='errorMsg' style={{paddingLeft: '65px'}}>{errors.kode}</p>
				<div className="help-block text-center">
					<b>Halaman ini tidak akan bisa di buka jika anda refresh, Terimakasih..</b>
				</div>
				<div className="lockscreen-footer text-center">
					Copyright © 2014-2021 <b className="text-black">AdminLTE.io</b><br />
					All rights reserved
				</div>
			</div>			
		</div>
	)
}

export default VerificationAkun
