import React, { useState, useEffect, Fragment  } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import ReactDatatable from '@ashvin27/react-datatable';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import env from "react-dotenv";
import Swal from "sweetalert2";

function Pengguna() {
	const accessToken = localStorage.getItem('access_token')
	const [values, setValues] = useState([])
	const [selectedRows, setSelectedRows] = useState([]);
	const [Editvalues, setEditValues] = useState({})
	const [startDate, setStartDate] = useState(null);
	const [TanggalLahir, setTanggalLahir] = useState(null);
	const [Agama, setAgama] = useState(null);
	const [PassBay, setPassBay] = useState(null);
	const [flag, setFlag] = useState({
		flagPassEdit: false,
		flagTanggalEdit: false
	})
	const [errors, setErrors] = useState({});
	const [passwordShown, setPasswordShown] = useState(false);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const { search } = useLocation();
  const match = search.match(/page=(.*)/);
  const roleID = 
		match?.[1] === 'administrator' ? '1' : 
		match?.[1] === 'dosen' ? '2' :
		match?.[1] === 'asistendosen' ? '3' :
		match?.[1] === 'guru' ? '4' :
		match?.[1] === 'mahasiswa' ? '5' :
		match?.[1] === 'siswa' ? '6' : '0';
  const title = 
		match?.[1] === 'administrator' ? 'Data Administrator' : 
		match?.[1] === 'dosen' ? 'Data Dosen' :
		match?.[1] === 'asistendosen' ? 'Data Asisten Dosen' :
		match?.[1] === 'guru' ? 'Data Guru' :
		match?.[1] === 'mahasiswa' ? 'Data Mahasiswa' :
		match?.[1] === 'siswa' ? 'Data Siswa' : 'Data Tidak Ditemukan';

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false) 
			getData(roleID)
		}, 2000);
		return () => clearTimeout(timer);
	},[roleID])

	const openDialog = (kondisi = null) => {
		if(kondisi === 'tambah'){
			const randomPass = makeRandom(8)
			setEditValues({
				id: null,
				name: '',
				email: '',
				password: randomPass,
				nomor_induk: '',
				tgl_lahir: '',
				tempat: '',
				jeniskelamin: '',
				agama: '',
				nama_ayah: '',
				nama_ibu: '',
				alamat: '',
				telp: '',
			})
		}
		setOpen(true)
	}

	const onCloseModal = () => {
		setOpen(false)
		setErrors({})
		setEditValues({})
		setStartDate(null)
		setTanggalLahir(null)
	};

	const getData = async(role) => {
		setLoading(true)
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleUser/getusers/?idRole=${role}&idProfile=${localStorage.getItem('idProfile')}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});
			// console.log(response.data.data)
			setLoading(false)
			setValues(response.data.data);
		} catch (error) {
			console.log(error.response.data)
			ResponToast('error', error.response.data.message)
		}
	}

	const prosesSimpan = async(e) => {
		e.preventDefault();
		const payload = {
			id: Editvalues.id === null ? null : Editvalues.id,
			name: Editvalues.name ? Editvalues.name : null,
			email: Editvalues.email ? Editvalues.email : null,
			password: Editvalues.id !== null ? !flag.flagPassEdit ? Editvalues.password : PassBay : Editvalues.password ? Editvalues.password : null,
			nomor_induk: roleID !== '1' ? Editvalues.nomor_induk : null,
			tgl_lahir: Editvalues.id === null ? TanggalLahir : !flag.flagTanggalEdit ? Editvalues.tgl_lahir : TanggalLahir,
			tempat: Editvalues.tempat ? Editvalues.tempat : null,
			agama: Agama ? Agama.value : null,
			jeniskelamin: Editvalues.jeniskelamin ? Editvalues.jeniskelamin : null,
			nama_ayah: roleID === '5' || roleID === '6' ? Editvalues.nama_ayah : null,
			nama_ibu: roleID === '5' || roleID === '6' ? Editvalues.nama_ibu : null,
			alamat: Editvalues.alamat ? Editvalues.alamat : null,
			telp: Editvalues.telp ? Editvalues.telp : null,
			roleID: roleID,
			jenis: Editvalues.id === null ? 'ADD' : 'EDIT',
			kodeOTP: Editvalues.id !== null ? PassBay : null,
		}
		// console.log(payload)
		setErrors(validateInput(Editvalues))
		// setLoading(true) 
		// Loading('Sedang melakukan proses konfirmasi pendaftaran akun ke alamat email anda')
		// try {
		// 	const dataUsers = await axios.post(`${env.SITE_URL}restApi/moduleUser/createupdateusers`, payload);
		// 	getData(roleID)
		// 	setOpen(false)
		// 	setLoading(false) 
		// 	ResponToast('success', dataUsers.data.message)
		// 	navigate(`/pengguna?page=${match?.[1]}`);
		// } catch (error) {
		// 	if(error.response){
		// 		const message = error.response.data.message
		// 		getData(roleID)
		// 		setLoading(false) 
		// 		ResponToast('error', message)
		// 		navigate(`/pengguna?page=${match?.[1]}`);
		// 	}
		// }
	}

	const selectRecord = (e) => {
		if (e.target.checked === true) {
			selectedRows.push(e.target.id);
    } else {
			selectedRows.pop(e.target.id);
    }
	}

	const selectActiveAkun = async(e) => {
		let activeAkun = e.target.checked === true ? '1' : '0'
		try {
			const aktifAkun = await axios.post(`${env.SITE_URL}restApi/moduleUser/updateuserby`, {
				id: e.target.value,
				jenis: 'activeAkun',
				activeAkun: activeAkun
			});
			ResponToast('success', aktifAkun.data.message)
			navigate(`/pengguna?page=${match?.[1]}`);
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				ResponToast('error', message)
			}
		}
	}
	
	const editRecord = (record) => {
		// console.log("Edit Record", record);
		setEditValues(record)
		setPassBay(makeRandom(8))
		setAgama({
			value: record.agama,
			label: record.agama,
		})
		setFlag({
			flagPassEdit: false,
			flagTanggalEdit: false
		})
		setPasswordShown(false)
		openDialog()
	}

	const deleteRecord = async(record) => {
		// console.log("Delete Record", record);
		setLoading(true) 
		try {
			const dataUsers = await axios.delete(`${env.SITE_URL}restApi/moduleUser/getusers/${record.id}`);
			getData(roleID)
			setLoading(false) 
			ResponToast('success', dataUsers.data.message)
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				ResponToast('error', message)
			}
		}
	}

	const togglePassword = (aksi) => {
    setPasswordShown(aksi);
  }

	const toggleFlagPass = (aksi) => {
    setFlag({
			flagPassEdit: aksi,
			flagTanggalEdit: flag.flagTanggalEdit
		});
  }

	const toggleFlagTanggal = (aksi) => {
    setFlag({
			flagPassEdit: flag.flagPassEdit,
			flagTanggalEdit: aksi
		});
  }

	const handleChange = (e) => {
		const { name, value } = e.target
		setEditValues({
			...Editvalues,
			[name]: value
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

	const Loading = (msg) => {
    Swal.fire({
			title: 'Harap Menunggu',
			html: msg,
			allowOutsideClick: false,
			showConfirmButton: false,
		});
		Swal.showLoading()
	}

	const makeRandom = (n) => {
		let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < n; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   	}
   	return result;
	}

	const validateInput = (Editvalues) => {
		// console.log(Editvalues)
		let error = {}
		let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if(!Editvalues.name.trim()){
			error.name = 'Nama Lengkap tidak boleh kosong'
		}
		
		if(!Editvalues.email.trim()){
			error.email = 'Email tidak boleh kosong'
		}else if(!regEmail.test(Editvalues.email)){
			error.email = 'Email tidak sesuai'
		}

		if (Editvalues.nomor_induk.length > 18 && roleID === '2') { error.nomor_induk = "Maksimal 18 angka" }
		else if (Editvalues.nomor_induk.length > 9 && (roleID === '3' || roleID === '5')) { error.nomor_induk = "Maksimal 9 angka" }
		else if (Editvalues.nomor_induk.length > 15 && roleID === '4') { error.nomor_induk = "Maksimal 15 angka" }
		else if (Editvalues.nomor_induk.length > 10 && roleID === '6') { error.nomor_induk = "Maksimal 10 angka" }
		else if (!Editvalues.nomor_induk) { error.nomor_induk = "Nomor Induk tidak boleh kosong" }

		// console.log(error)
		return error
	} 

	const handlertanggalLahir = (str) => {
		let date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  	const tanggal = [date.getFullYear(), mnth, day].join("-");
		setStartDate(str)
		setTanggalLahir(tanggal)
	}

	const handlerAgama = (select) => {
		setAgama(select)
		// console.log(select)
	}

	const handlerTelepon = (e) => {
		if (!/[0-9]/.test(e.key)) { e.preventDefault(); setErrors({telepon: "Hanya boleh angka"}) }
		else if (e.target.value.length >= 15) { e.preventDefault(); setErrors({telepon: "Maksimal 15 angka"}) }
	}

	const handlerNomorInduk = (e) => {
		if (!/[0-9]/.test(e.key)) { e.preventDefault(); setErrors({nomor_induk: "Hanya boleh angka"}) }
	}

	const columns = [
		{
			key: "check",
			text: "#",
			className: "check",
			align: "center",
			width: '5%',
			cell: record => { 
				return (
					<Fragment>
						<div style={{textAlign: 'center'}}>
							<div className="custom-control custom-checkbox">
								<input className="custom-control-input custom-control-input-danger custom-control-input-outline" type="checkbox" onChange={(e) => selectRecord(e)} id={record.id} />
								<label htmlFor={record.id} className="custom-control-label"></label>
							</div>
						</div>
					</Fragment>
				);
			}
		},
		{
			key: "item_no",
			text: "No",
			className: "item_no",
			align: "center",
			width: '5%',
			sortable: true,
			cell: record => {
				return(
					<div style={{textAlign: 'center'}}>{record.item_no}</div>
				)
			}
		},
		{
			key: "name",
			text: "Nama Lengkap",
			className: "name",
			align: "center",
			width: '15%',
			sortable: true,
		},
		{
			key: "email",
			text: "Email",
			className: "email",
			width: '15%',
			align: "center",
		},
		{
			key: "telp",
			text: "Telepon",
			className: "telp",
			width: '10%',
			align: "center",
		},
		{
			key: "alamat",
			text: "Alamat",
			className: "alamat",
			width: '30%',
			align: "center",
		},
		{
			key: "activeAkun",
			text: "Aktif Akun",
			className: "activeAkun",
			width: '10%',
			align: "center",
			cell: record => { 
				return (
					<Fragment>
						<div style={{textAlign: 'center'}}>
							<div className="form-group">
								<div className="custom-control custom-switch custom-switch-off-default custom-switch-on-success">
									<input type="checkbox" className="custom-control-input" id={"aktivAkun"+record.id} value={record.id} onChange={(e) => selectActiveAkun(e)} defaultChecked={record.activeAkun === 0 ? '' : 'checked' } />
									<label className="custom-control-label" htmlFor={"aktivAkun"+record.id}></label>
								</div>
							</div>
						</div>
					</Fragment>
				);
			}
		},
		{
			key: "action",
			text: "Aksi",
			className: "action",
			width: '10%',
			align: "center",
			cell: record => { 
				return (
					<Fragment>
						<div style={{textAlign: 'center'}}>
							<button
								className="btn btn-primary btn-xs"
								title="Ubah Data"
								onClick={() => editRecord(record)}
								style={{marginRight: '5px'}}>
								<i className="fa fa-pencil-alt"></i>
							</button>
							<button 
								className="btn btn-danger btn-xs"
								title="Hapus Data"
								onClick={() => deleteRecord(record)}>
								<i className="fa fa-trash-alt"></i>
							</button>
						</div>
					</Fragment>
				);
			}
		}
	]

	const config = {
		key_column: 'name',
		page_size: 10,
		length_menu: [ 10, 20, 50 ],
		pagination: 'advance',
		language: {
			loading_text: "Harap Menunggu ...",
			no_data_text: "Tidak ada data ...",
			filter: "Cari data ...",
			length_menu: "Menampilkan _MENU_ Data per halaman",
			info: "Menampilkan _START_ sampai _END_ dari total _TOTAL_ Data",
			pagination: {
				first: "Awal",
				previous: "Sebelumnya",
				next: "Selanjutnya",
				last: "Akhir"
			},
		}
	}

	const extraButtons = [
		{
			className:"btn btn-primary",
			title:"Export TEst",
			children:[
				<span>
				<i className="glyphicon glyphicon-print fa fa-print" aria-hidden="true"></i>
				</span>
			],
			onClick:(event)=>{
				console.log(event);
			},
		},
		{
			className:"btn btn-primary buttons-pdf",
			title:"Export TEst",
			children:[
				<span>
				<i className="glyphicon glyphicon-print fa fa-print" aria-hidden="true"></i>
				</span>
			],
			onClick:(event)=>{
				console.log(event);
			},
			onDoubleClick:(event)=>{
				console.log("doubleClick")
			}
		},
	]

	const optionsAgama = [
		{ value: 'Islam', label: 'Islam' },
		{ value: 'Katolik', label: 'Katolik' },
		{ value: 'Protestan', label: 'Protestan' },
		{ value: 'Hindu', label: 'Hindu' },
		{ value: 'Budha', label: 'Budha' },
	]

	return (
		<div>
			<div className="content-wrapper">
				<section className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1>{title}</h1>
							</div>
							<div className="col-sm-6">
								<ol className="breadcrumb float-sm-right">
									<li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
									<li className="breadcrumb-item active">{title}</li>
								</ol>
							</div>
						</div>
					</div>
				</section>

				<section className="content">
					<div className="card card-primary card-outline">
						<div className="card-header">
							<h3 className="card-title"><b>{title}</b></h3>
							<div className="card-tools">
								<button onClick={() => openDialog('tambah')}  className="btn btn-primary btn-xs" title="Tambah Data">
									<i className="fas fa-plus" /> Tambah
								</button>
								<button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
									<i className="fas fa-minus" />
								</button>
								<button type="button" className="btn btn-tool" data-card-widget="remove" title="Remove">
									<i className="fas fa-times" />
								</button>
							</div>
						</div>
						<div className="card-body">
							<ReactDatatable
								config={config}
								records={values}
								columns={columns}
								extraButtons={extraButtons}
								loading={loading}
							/>
						</div>
					</div>
					<div style={{marginTop: '1000px'}}>
						<Modal 
							open={open} 
							showCloseIcon={false}
							closeOnOverlayClick={false}
							classNames={{
								overlay: 'customOverlay',
								modal: 'customModal',
							}}>
							<div className="modal-header">
								<h4 className="modal-title" id="my-modal-title">Form {title}</h4>
								<button onClick={onCloseModal} className="close" aria-label="Close">
									<span aria-hidden="true">×</span>
								</button>
							</div>
							{roleID !== '1' &&
								<>
									<div className="form-group">
										<label htmlFor="name">Nomor Induk</label>
										<input type="text" className="form-control" name='nomor_induk' placeholder="Nomor Induk" autoComplete="off" value={Editvalues.nomor_induk} onChange={handleChange} onKeyPress={(e) => {handlerNomorInduk(e)}} />
									</div>
									<p className='errorMsg'>{errors.nomor_induk}</p>
									<p><b>NB: Diinput tanpa menggunakan spasi</b></p>
								</>
							}
							<div className="form-group">
								<label htmlFor="name">Nama Lengkap</label>
								<input type="text" className="form-control" name='name' placeholder="Nama Lengkap" autoComplete="off" value={Editvalues.name} onChange={handleChange} />
							</div>
							<p className='errorMsg'>{errors.name}</p>
							<div className="form-group">
								<label htmlFor="email">Email</label>
								<input type="email" className="form-control" name='email' placeholder="Email" autoComplete="off" value={Editvalues.email} onChange={handleChange} />
							</div>
							<p className='errorMsg'>{errors.email}</p>
							<div className="form-group">
								<label htmlFor="password">Kata Sandi</label>
								<div className="input-group mb-3">
									<input type={passwordShown ? "text" : "password"} className="form-control" name="password" placeholder="Kata Sandi" autoComplete="off" value={Editvalues.id !== null ? !flag.flagPassEdit ? '********' : PassBay : Editvalues.password} onChange={handleChange} disabled={Editvalues.id !== null ? !flag.flagPassEdit : true} />
									<div className="input-group-append">
										<div className="input-group-text">
											<span onClick={(aksi) => {!flag.flagPassEdit ? togglePassword(false) : togglePassword(!passwordShown)}} className={!passwordShown ? "fas fa-eye" : "fas fa-eye-slash"} />
										</div>
									</div>
									{Editvalues.id !== null &&
										<div className="input-group-append">
											<div className="input-group-text">
												<span onClick={(aksi) => {toggleFlagPass(!flag.flagPassEdit)}} className={!flag.flagPassEdit ? "fas fa-unlock" : "fas fa-lock"} />
											</div>
										</div>
									}
								</div>
								{Editvalues.id !== null ? 
									<p><b>NB: Jika ingin mengubah password aktifkan input password terlebih dahulu</b></p>
									:
									<p><b>NB: Password sudah di generate acak</b></p>
								}
							</div>
							<div className="form-group">
								<label htmlFor="tempat">Tempat Lahir</label>
								<input type="text" className="form-control" name='tempat' placeholder="Tempat Lahir" autoComplete="off" value={Editvalues.tempat} onChange={handleChange} />
							</div>
							<div className="form-group">
								<label>Tanggal Lahir</label>
								<div className="input-group-date mb-3">
									{Editvalues.id !== null ?
										!flag.flagTanggalEdit ? 
											<input type="text" className="form-control" name='tgl_lahir' placeholder="Tanggal Lahir" autoComplete="off" disabled value={Editvalues.tgl_lahir} onChange={handleChange} />
										:
											<DatePicker
												className="form-control"
												dateFormat="yyyy-MM-dd"
												placeholderText="Tanggal Lahir"
												selected={startDate}
												onChange={(date) => handlertanggalLahir(date)}
												peekNextMonth
												showMonthDropdown
												showYearDropdown
												dropdownMode="select"
											/>
									:
										<DatePicker
											className="form-control"
											dateFormat="yyyy-MM-dd"
											placeholderText="Tanggal Lahir"
											selected={startDate}
											onChange={(date) => handlertanggalLahir(date)}
											peekNextMonth
											showMonthDropdown
											showYearDropdown
											dropdownMode="select"
										/>
									}
									{Editvalues.id !== null &&
										<div className="input-group-append">
											<div className="input-group-text">
												<span onClick={(aksi) => {toggleFlagTanggal(!flag.flagTanggalEdit)}} className={!flag.flagTanggalEdit ? "fas fa-unlock" : "fas fa-lock"} />
											</div>
										</div>
									}
								</div>
								{Editvalues.id !== null &&
									<p><b>NB: Jika ingin mengubah tanggal lahir aktifkan input tanggal lahir terlebih dahulu</b></p>
								}
							</div>
							<div className="form-group">
								<label>Agama</label>
								<Select
									placeholder='Pilih Agama'
									value={Agama}
									onChange={(x) => {handlerAgama(x)}}
									options={optionsAgama}
								/>
							</div>
							<div className="form-group">
								<label>Jenis Kelamin</label>
								<div className="form-check">
									<input className="form-check-input" type="radio" name="jeniskelamin" value="Laki - Laki" onChange={handleChange} checked={Editvalues.jeniskelamin === 'Laki - Laki' ? 'checked' : '' } />
									<label className="form-check-label">Laki - Laki</label>
								</div>
								<div className="form-check">
									<input className="form-check-input" type="radio" name="jeniskelamin" value="Perempuan" onChange={handleChange} checked={Editvalues.jeniskelamin === 'Perempuan' ? 'checked' : '' } />
									<label className="form-check-label">Perempuan</label>
								</div>
							</div>
							{roleID === '5' || roleID === '6' &&
								<>
									<div className="form-group">
										<label htmlFor="name">Nama Ayah</label>
										<input type="text" className="form-control" name='nama_ayah' placeholder="Nama Ayah" autoComplete="off" value={Editvalues.nama_ayah} onChange={handleChange} />
									</div>
									<div className="form-group">
										<label htmlFor="name">Nama Ibub</label>
										<input type="text" className="form-control" name='nama_ibu' placeholder="Nama Ibu" autoComplete="off" value={Editvalues.nama_ibu} onChange={handleChange} />
									</div>
								</>
							}
							<div className="form-group">
								<label htmlFor="telp">Telepon</label>
								<input type="text" className="form-control" name='telp' placeholder="Telepon" autoComplete="off" value={Editvalues.telp} onChange={handleChange} onKeyPress={(e) => {handlerTelepon(e)}} />
							</div>
							<p className='errorMsg'>{errors.telepon}</p>
							<div className="form-group">
								<label htmlFor="alamat">Alamat</label>
								<textarea className="form-control" rows="3" name='alamat' placeholder="Alamat" autoComplete="off" value={Editvalues.alamat} onChange={handleChange} ></textarea>
							</div>
							<div className="modal-footer right-content-between">
								<button onClick={onCloseModal} className="btn btn-primary btn-sm align-right">Batal</button>
								<button onClick={prosesSimpan} className="btn btn-primary btn-sm align-right">Simpan</button>
							</div>
						</Modal>		
					</div>		
				</section>
			</div>
		</div>
	)
}

export default Pengguna
