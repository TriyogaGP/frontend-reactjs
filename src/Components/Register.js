import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom'
import env from 'react-dotenv'
import Swal from "sweetalert2";

function Register() {
	const [values, setValues] = useState({
		namalengkap: '',
		email: '',
		password: '',
		confPassword: ''
	});
	const [errors, setErrors] = useState({});
	const [passwordShown, setPasswordShown] = useState(false);
	const [confPasswordShown, setconfPasswordShown] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target
		setValues({
			...values,
			[name]: value
		})
	}

	const validateInput = (values) => {
		// console.log(values)
		let error = {}
		let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if(!values.namalengkap.trim()){
			error.namalengkap = 'Nama Lengkap tidak boleh kosong'
		}
		
		if(!values.email.trim()){
			error.email = 'Email tidak boleh kosong'
		}else if(!regEmail.test(values.email)){
			error.email = 'Email tidak sesuai'
		}

		if(!values.password){
			error.password = 'Kata Sandi tidak boleh kosong'
		}else if(values.password.length < 8){
			error.password = 'Kata Sandi harus 8 karakter'
		}

		if(!values.confPassword){
			error.confPassword = 'Konfirmasi Kata Sandi tidak boleh kosong'
		}else if(values.confPassword !== values.password){
			error.confPassword = 'Konfirmasi Kata Sandi harus sama dengan Kata Sandi'
		}

		// console.log(error)
		return error
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

	const Loading = (msg) => {
    Swal.fire({
			title: 'Harap Menunggu',
			html: msg,
			allowOutsideClick: false,
			showConfirmButton: false,
		});
		Swal.showLoading()
	}

	const daftar = async(e) => {
		e.preventDefault();
		setErrors(validateInput(values))
		Loading('Sedang melakukan proses mengirim kode verifikasi ke alamat email anda')
		try {
			const register = await axios.post(`${env.SITE_URL}restApi/moduleLogin/register`, {
				name: values.namalengkap,
				email: values.email,
				password: values.password,
				confPassword: values.confPassword
			});
			// console.log(register)
			localStorage.setItem('kodeOTP', register.data.data.kodeOTP)
			localStorage.setItem('dataReg', JSON.stringify(register.data.data))
			Swal.hideLoading()
			ResponToast('success', register.data.message)
			navigate('/verifikasiAkun');
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				ResponToast('error', message)
			}
		}
	}

	const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

	const toggleConfPassword = () => {
    setconfPasswordShown(!confPasswordShown);
  };

	return (
		<div>
			<div className='register-page'>
				<div className="register-box">
					<div className="login-logo-css">
						<b>APLIKASI</b>
					</div>
					<div className="card">
						<div className="card-body register-card-body">
							<p className="login-box-msg">Daftarkan akun anda</p>
							<form onSubmit={daftar}>
								<div className="input-group mb-3">
									<input type="text" className="form-control" name="namalengkap" placeholder="Nama Lengkap" autoComplete="off" value={values.namalengkap} onChange={handleChange} />
									<div className="input-group-append">
										<div className="input-group-text">
											<span className="fas fa-user" />
										</div>
									</div>
								</div>
								<p className='errorMsg'>{errors.namalengkap}</p>
								<div className="input-group mb-3">
									<input type="email" className="form-control" name="email" placeholder="Email" autoComplete="off" value={values.email} onChange={handleChange} />
									<div className="input-group-append">
										<div className="input-group-text">
											<span className="fas fa-envelope" />
										</div>
									</div>
								</div>
								<p className='errorMsg'>{errors.email}</p>
								<div className="input-group mb-3">
									<input type={passwordShown ? "text" : "password"} className="form-control" name="password" placeholder="Kata Sandi" autoComplete="off" value={values.password} onChange={handleChange} />
									<div className="input-group-append">
										<div className="input-group-text">
											<span onClick={togglePassword} className={!passwordShown ? "fas fa-eye" : "fas fa-eye-slash"} />
										</div>
									</div>
								</div>
								<p className='errorMsg'>{errors.password}</p>
								<div className="input-group mb-3">
									<input type={confPasswordShown ? "text" : "password"} className="form-control" name="confPassword" placeholder="Konfirmasi Kata Sandi" autoComplete="off" value={values.confPassword} onChange={handleChange} />
									<div className="input-group-append">
										<div className="input-group-text">
											<span onClick={toggleConfPassword} className={!confPasswordShown ? "fas fa-eye" : "fas fa-eye-slash"} />
										</div>
									</div>
								</div>
								<p className='errorMsg'>{errors.confPassword}</p>
								<div className="row">
									<div className="col-12">
										<button type="submit" className="btn btn-primary btn-block">Daftar Akun</button>
									</div>
								</div>
							</form>
							Sudah punya akun ? <Link to='/'>Masuk</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Register
