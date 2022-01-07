import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios';
import env from 'react-dotenv'
import Swal from 'sweetalert2';

function Profile(props) {
	const navigate = useNavigate();
	const [values, setValues] = useState({})
	const [ubahData, setUbahData] = useState({
		namalengkap: '',
		passwordlama: '',
		passwordbaru: '',
		confpasswordbaru: ''
	})
	const [flag, setFlag] = useState({
		flagNama: false
	})
	const [errors, setErrors] = useState({});
	const [passwordShown, setPasswordShown] = useState({
		password_lama: false,
		password_baru: false,
		konf_password_baru: false
	});
	const [upload, setUpload] = useState({
		id: localStorage.getItem('idProfile'),
		nama: localStorage.getItem('namaLengkap'),
		jenis: 'images'
	});	
	const gbr = values.codeLog === 1 ? values.gambar != null ? `${env.SITE_URL}images/${values.gambar}` : 'dist/img/user.png' : values.codeLog === 2 ? values.gambarGmail : 'dist/img/user.png';

	useEffect(() => {
		getData()
	},[])

	const getData = async() => {
		const response = await axios.get(`${env.SITE_URL}restApi/moduleLogin/getusers/${localStorage.getItem('idProfile')}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			}
		});
		setValues(response.data.data);
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setUbahData({
			...ubahData,
			[name]: value
		})
	}

	const keluar = async() => {
		try {
			await axios.get(`${env.SITE_URL}restApi/moduleLogin/logout/${localStorage.getItem('idProfile')}`);
			localStorage.clear()
			ResponToast('success', 'Anda berhasil keluar dari panel ini .. Terima Kasih !')
			navigate('/');
		} catch (error) {
			console.log(error);
		}
	}

	const ubahNama = async(nilai) => {
		setFlag({
			flagNama: nilai
		})
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

	const uploadFile = async(dataFile) => {
		console.log(dataFile)
		const size = (dataFile.size/1024)
		if(size > 5120){
			ResponToast('warning', 'Ukuran gambar terlalu besar !')
		}else{
			const formData = new FormData();
			formData.append("id", upload.id);
			formData.append("jenis", upload.jenis);
			formData.append("nama", upload.nama);
			formData.append("file", dataFile);
			try {
				const uploadImage = await axios.post(`${env.SITE_URL}restApi/moduleLogin/updateImage`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				}
			});
				// console.log(uploadImage)
				getData()
				ResponToast('success', uploadImage.data.message)
				navigate('/profile')
			} catch (error) {
				if(error.response){
					const message = error.response.data.message
					ResponToast('error', message)
				}
			}
		}
	}

	const togglePasswordlama = (aksi) => {
    setPasswordShown({
			password_lama: aksi,
			password_baru: passwordShown.password_baru,
			konf_password_baru: passwordShown.konf_password_baru
		});
  }

	const togglePasswordbaru = (aksi) => {
    setPasswordShown({
			password_lama: passwordShown.password_lama,
			password_baru: aksi,
			konf_password_baru: passwordShown.konf_password_baru
		});
  }

	const toggleConfPasswordbaru = (aksi) => {
    setPasswordShown({
			password_lama: passwordShown.password_lama,
			password_baru: passwordShown.password_baru,
			konf_password_baru: aksi
		});
  }

	const validateInput = (ubahData) => {
		let error = {}

		if(!ubahData.passwordlama){
			error.passwordlama = 'Kata Sandi Lama tidak boleh kosong'
		}else if(ubahData.passwordlama.length < 8){
			error.passwordlama = 'Kata Sandi Lama harus 8 karakter'
		}

		if(!ubahData.passwordbaru){
			error.passwordbaru = 'Kata Sandi Baru tidak boleh kosong'
		}else if(ubahData.passwordbaru.length < 8){
			error.passwordbaru = 'Kata Sandi Baru harus 8 karakter'
		}

		if(!ubahData.confpasswordbaru){
			error.confpasswordbaru = 'Konfirmasi Kata Sandi Baru tidak boleh kosong'
		}else if(ubahData.confpasswordbaru !== ubahData.passwordbaru){
			error.confpasswordbaru = 'Konfirmasi Kata Sandi Baru harus sama dengan Kata Sandi'
		}

		return error
	}

	const clearForm = () => {
		setUbahData({
			nama: '',
			passwordlama: '',
			passwordbaru: '',
			confpasswordbaru: ''
		})
	}
	const ubahProfile = async(ubahJenis) => {
		// e.preventDefault();
		setErrors(validateInput(ubahData))
		const kirimData = {
			id: localStorage.getItem('idProfile'),
			ubah: ubahJenis,
			name: ubahJenis === 'nama' ? ubahData.namalengkap : null,
			passwordlama: ubahJenis === 'nama' ? null : ubahData.passwordlama,
			passwordbaru: ubahJenis === 'nama' ? null : ubahData.passwordbaru,
			confPasswordbaru: ubahJenis === 'nama' ? null : ubahData.confpasswordbaru
		}
		try {
			const profile_ubah = await axios.post(`${env.SITE_URL}restApi/moduleLogin/updateusers`, kirimData);
			// console.log(register)
			if(ubahJenis === 'nama'){
				ubahNama(false)
				localStorage.setItem('namaLengkap', ubahData.namalengkap)
			}
			clearForm()
			getData()
			ResponToast('success', profile_ubah.data.message)
			navigate('/profile');
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				ResponToast('error', message)
			}
		}
	}

	return (
		<div className="content-wrapper">
			<section className="content-header">
				<div className="container-fluid">
					<div className="row mb-2">
						<div className="col-sm-6">
							<h1>{props.title}</h1>
						</div>
						<div className="col-sm-6">
							<ol className="breadcrumb float-sm-right">
								<li className="breadcrumb-item active">{props.title}</li>
							</ol>
						</div>
					</div>
				</div>
			</section>

			<section className="content">
				<div className="card">
					<div className="card-body">
						<div className="row">
							<div className="col-md-8">
								<div className="card card-primary card-outline">
									<div className="card-header p-2">
										<ul className="nav nav-pills">
											<li className="nav-item"><a className="nav-link active" href="#activity" data-toggle="tab">Activity</a></li>
											<li className="nav-item"><a className="nav-link" href="#timeline" data-toggle="tab">Timeline</a></li>
											{values.codeLog === 1 &&
												<li className="nav-item"><a className="nav-link" href="#ubah-katasandi" data-toggle="tab">Ubah Kata Sandi</a></li>
											}
										</ul>
									</div>
									<div className="card-body">
										<div className="tab-content">
											<div className="active tab-pane" id="activity">
												pane 1
											</div>
											<div className="tab-pane" id="timeline">
												pane 2
											</div>
											<div className="tab-pane" id="ubah-katasandi">
												<>
													<div className="input-group mb-3">
														<input type={passwordShown.password_lama ? "text" : "password"} className="form-control" name="passwordlama" placeholder="Kata Sandi Lama" autoComplete="off" value={ubahData.passwordlama} onChange={handleChange} />
														<div className="input-group-append">
															<div className="input-group-text">
																<span onClick={(aksi) => {togglePasswordlama(!passwordShown.password_lama)}} className={!passwordShown.password_lama ? "fas fa-eye" : "fas fa-eye-slash"} />
															</div>
														</div>
													</div>
													<p className='errorMsg'>{errors.passwordlama}</p>
													<div className="input-group mb-3">
														<input type={passwordShown.password_baru ? "text" : "password"} className="form-control" name="passwordbaru" placeholder="Kata Sandi Baru" autoComplete="off" value={ubahData.passwordbaru} onChange={handleChange} />
														<div className="input-group-append">
															<div className="input-group-text">
																<span onClick={(aksi) => {togglePasswordbaru(!passwordShown.password_baru)}} className={!passwordShown.password_baru ? "fas fa-eye" : "fas fa-eye-slash"} />
															</div>
														</div>
													</div>
													<p className='errorMsg'>{errors.passwordbaru}</p>
													<div className="input-group mb-3">
														<input type={passwordShown.konf_password_baru ? "text" : "password"} className="form-control" name="confpasswordbaru" placeholder="Konfirmasi Kata Sandi Baru" autoComplete="off" value={ubahData.confpasswordbaru} onChange={handleChange} />
														<div className="input-group-append">
															<div className="input-group-text">
																<span onClick={(aksi) => {toggleConfPasswordbaru(!passwordShown.konf_password_baru)}} className={!passwordShown.konf_password_baru ? "fas fa-eye" : "fas fa-eye-slash"} />
															</div>
														</div>
													</div>
													<p className='errorMsg'>{errors.confpasswordbaru}</p>
													<div className="modal-footer right-content-between">
														<button onClick={clearForm} className="btn btn-primary btn-sm align-right">Batal</button>
														<button onClick={(x) => {ubahProfile('katasandi')}} className="btn btn-primary btn-sm align-right">Ubah Kata Sandi</button>
													</div>
												</>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-4">
								<div className="card card-primary card-outline">
									<div className="card-body box-profile">
										<div className="text-center">
											<img className="profile-user-img img-fluid img-circle" src={gbr} alt="User profile picture" />
										</div>
										{flag.flagNama === true &&
											<div className="input-group mb-3" style={{marginTop: '10px'}}>
												<input type="text" className="form-control" name="namalengkap" placeholder="Nama Lengkap" autoComplete="off" value={ubahData.namalengkap} onChange={handleChange} />
												<div className="input-group-append">
													<div className="input-group-text">
														<i onClick={(x) => {ubahProfile('nama')}} className="fas fa-arrow-right text-muted" style={{cursor: 'pointer'}} />
													</div>
													<div className="input-group-text">
														<i onClick={(nilai) => {ubahNama(false)}} className="fas fa-times text-muted" title='Batal ' style={{cursor: 'pointer'}} />
													</div>
												</div>
											</div>
										}
										{flag.flagNama === false &&
											<h3 className="profile-username text-center">{values.name} <i onClick={(nilai) => {ubahNama(true)}} className="fas fa-pencil-alt" style={{cursor: 'pointer'}} /></h3>
										}
										<p className="text-muted text-center">{values.roleName}</p>
										<ul className="list-group list-group-unbordered mb-3">
											<li className="list-group-item">
												<b>Followers</b> <a className="float-right">1,322</a>
											</li>
											<li className="list-group-item">
												<b>Following</b> <a className="float-right">543</a>
											</li>
											<li className="list-group-item">
												<b>Friends</b> <a className="float-right">13,287</a>
											</li>
										</ul>
										<div className="form-group" style={values.codeLog === 1 ? {display: 'block'} : {display: 'none'}}>
											<div className="btn btn-default btn-file btn-block">
												<i className="fas fa-paperclip" /> Ubah Foto Profile
												<input type="file" id='file' accept='image/*' title={values.codeLog === 1 ? 'Ubah Foto Profile' : 'Tidak bisa ubah Foto Profile'} onChange={(e) => {uploadFile(e.target.files[0])}} />
												{/* <input type="file" id='file' accept='image/*' onChange={(e) => {setFiles({selectedFiles: e.target.files[0]})}} /> */}
											</div>
											<p className="help-block">Max. 5MB</p>
										</div>
										<a onClick={keluar} className="btn btn-primary btn-block"><b>Keluar</b></a>
									</div>
								</div>
								<div className="card card-primary card-outline">
									<div className="card-header">
										<h3 className="card-title">About Me</h3>
									</div>
									<div className="card-body">
										<strong><i className="fas fa-book mr-1" /> Education</strong>
										<p className="text-muted">
											B.S. in Computer Science from the University of Tennessee at Knoxville
										</p>
										<hr />
										<strong><i className="fas fa-map-marker-alt mr-1" /> Location</strong>
										<p className="text-muted">Malibu, California</p>
										<hr />
										<strong><i className="fas fa-pencil-alt mr-1" /> Skills</strong>
										<p className="text-muted">
											<span className="tag tag-danger">UI Design</span>
											<span className="tag tag-success">Coding</span>
											<span className="tag tag-info">Javascript</span>
											<span className="tag tag-warning">PHP</span>
											<span className="tag tag-primary">Node.js</span>
										</p>
										<hr />
										<strong><i className="far fa-file-alt mr-1" /> Notes</strong>
										<p className="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam fermentum enim neque.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

export default Profile
