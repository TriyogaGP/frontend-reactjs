import React, { useState, useEffect, Fragment  } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
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
	const [flag, setFlag] = useState({
		flagPassEdit: false
	})
	const [errors, setErrors] = useState({});
	const [passwordShown, setPasswordShown] = useState(false);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const onCloseModal = () => setOpen(false);
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
			setEditValues({
				id: null,
				name: '',
				email: '',
				address: '',
				description: '',
				phone: '',
				website: '',
			})
		}
		setOpen(true)
	}

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
		setLoading(true) 
		try {
			const dataUsers = await axios.post(`${env.SITE_URL}restApi/moduleUser/updateusers`, {
				id: Editvalues.id === null ? null : Editvalues.id,
				name: Editvalues.name,
				email: Editvalues.email,
				alamat: Editvalues.alamat,
				telp: Editvalues.telp,
				roleID: roleID,
				jenis: Editvalues.id === null ? 'ADD' : 'EDIT',
			});
			setOpen(false)
			setLoading(false) 
			getData(roleID)
			ResponToast('success', dataUsers.data.message)
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				setOpen(false)
				setLoading(false) 
				getData(roleID)
				ResponToast('error', message)
			}
		}
	}

	const selectRecord = (e) => {
		if (e.target.checked === true) {
			selectedRows.push(e.target.id);
    } else {
			selectedRows.pop(e.target.id);
    }
	}

	const editRecord = (record) => {
		// console.log("Edit Record", record);
		setEditValues(record)
		openDialog()
	}

	const deleteRecord = async(record) => {
		// console.log("Delete Record", record);
		setLoading(true) 
		try {
			const dataUsers = await axios.delete(`${env.SITE_URL}restApi/moduleApi/bootcamp/${record.id}`);
			setOpen(false)
			setLoading(false) 
			getData(roleID)
			ResponToast('success', dataUsers.data.message)
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				setOpen(false)
				ResponToast('error', message)
			}
		}
	}

	const togglePassword = (aksi) => {
    setPasswordShown(aksi);
  }

	const toggleFlag = (aksi) => {
    setFlag({
			flagPassEdit: aksi
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
							<div className="form-group">
								<label htmlFor="name">Nama Lengkap</label>
								<input type="text" className="form-control" name='name' placeholder="Nama Lengkap" autoComplete="off" value={Editvalues.name} onChange={handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="email">Email</label>
								<input type="email" className="form-control" name='email' placeholder="Email" autoComplete="off" value={Editvalues.email} onChange={handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="password">Kata Sandi</label>
								<div className="input-group mb-3">
									<input type={passwordShown ? "text" : "password"} className="form-control" name="password" placeholder="Kata Sandi" autoComplete="off" value={Editvalues.passassword} onChange={handleChange} disabled={Editvalues.id !== null ? !flag.flagPassEdit : false} />
									<div className="input-group-append">
										<div className="input-group-text">
											<span onClick={(aksi) => {togglePassword(!passwordShown)}} className={!passwordShown ? "fas fa-eye" : "fas fa-eye-slash"} />
										</div>
									</div>
									{Editvalues.id !== null &&
										<div className="input-group-append">
											<div className="input-group-text">
												<span onClick={(aksi) => {toggleFlag(!flag.flagPassEdit)}} className={!flag.flagPassEdit ? "fas fa-unlock" : "fas fa-lock"} />
											</div>
										</div>
									}
								</div>
							<p><b>NB: Jika ingin mengubah password aktifkan input password terlebih dahulu</b></p>
							</div>
							<div className="form-group">
								<label htmlFor="alamat">Alamat</label>
								<textarea className="form-control" rows="3" name='alamat' placeholder="Alamat" autoComplete="off" value={Editvalues.alamat} onChange={handleChange} ></textarea>
							</div>
							<div className="form-group">
								<label htmlFor="telp">Telepon</label>
								<input type="text" className="form-control" name='telp' placeholder="Telepon" autoComplete="off" value={Editvalues.telp} onChange={handleChange} />
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
