import React, { useState, useEffect, Fragment  } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router';
import axios from 'axios';
import ReactDatatable from '@ashvin27/react-datatable';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import jwt_decode from "jwt-decode";
import env from "react-dotenv";
import Swal from "sweetalert2";

function Bootcamp(props) {
	const accessToken = localStorage.getItem('access_token')
	const [values, setValues] = useState([])
	const [selectedRows, setSelectedRows] = useState([]);
	const [Editvalues, setEditValues] = useState({})
	const [expire, setExpire] = useState('');
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const onCloseModal = () => setOpen(false);
	const navigate = useNavigate();

	useEffect(() => {
		const timer = setTimeout(() => {
      setLoading(false) 
			getData()
    }, 2000);
		return () => clearTimeout(timer);
	},[])

	const handleChange = (e) => {
		const { name, value } = e.target
		setEditValues({
			...Editvalues,
			[name]: value
		})
	}

	const prosesSimpan = async(e) => {
		e.preventDefault();
		setLoading(true) 
		const link = Editvalues.id === null ? `${env.SITE_URL}restApi/moduleApi/bootcamp` : `${env.SITE_URL}restApi/moduleApi/bootcamp/${Editvalues.id}`
		try {
			const dataBootcamps = await axios.post(`${link}`, {
				name: Editvalues.name,
				email: Editvalues.email,
				address: Editvalues.address,
				description: Editvalues.description,
				phone: Editvalues.phone,
				website: Editvalues.website,
			});
			setOpen(false)
			setLoading(false) 
			getData()
			ResponToast('success', dataBootcamps.data.message)
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				setOpen(false)
				ResponToast('error', message)
			}
		}
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
			key: "phone",
			text: "Telepon",
			className: "phone",
			width: '10%',
			align: "center",
		},
		{
			key: "address",
			text: "Alamat",
			className: "address",
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
		// button: {
		// 	excel: true,
		// 	print: true,
		// 	extra: true,
		// },
		// filename: 'Data Bootcamps',
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

	const ResponToast = (icon, msg) => {
    Swal.fire({  
      title: 'Pemberitahuan',  
      text: msg,  
      icon: icon,    
			confirmButtonText: 'Tutup',
			allowOutsideClick: false
    });
	}
	
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
			const dataBootcamps = await axios.delete(`${env.SITE_URL}restApi/moduleApi/bootcamp/${record.id}`);
			setOpen(false)
			setLoading(false) 
			getData()
			ResponToast('success', dataBootcamps.data.message)
		} catch (error) {
			if(error.response){
				const message = error.response.data.message
				setOpen(false)
				ResponToast('error', message)
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

	const getData = async() => {
		try {
			const response = await axios.get(`${env.SITE_URL}restApi/moduleApi/bootcamp`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});
			// console.log(response.data.data)
			setValues(response.data.data);
		} catch (error) {
			console.log(error.response.data)
			ResponToastConfirm('error', error.response.data.message)
		}
	}

	const ResponToastConfirm = (icon, msg) => {
    Swal.fire({  
      title: 'Pemberitahuan',  
      text: msg,  
      icon: icon,    
			confirmButtonText: 'Tutup',
			allowOutsideClick: false
    }).then((result) => {
			if(result.isConfirmed == true){
				localStorage.clear()
				navigate('/')
			}
		});
	}
	
	return (
		<div>
			<div className="content-wrapper">
				<section className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1>{props.title}</h1>
							</div>
							<div className="col-sm-6">
								<ol className="breadcrumb float-sm-right">
									<li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
									<li className="breadcrumb-item active">{props.title}</li>
								</ol>
							</div>
						</div>
					</div>
				</section>

				<section className="content">
					<div className="card card-primary card-outline">
						<div className="card-header">
							<h3 className="card-title"><b>Data Bootcamp</b></h3>
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
								<h4 className="modal-title" id="my-modal-title">Form Bootcamp</h4>
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
								<label htmlFor="address">Alamat</label>
								<textarea className="form-control" rows="3" name='address' placeholder="Alamat" autoComplete="off" value={Editvalues.address} onChange={handleChange} ></textarea>
							</div>
							<div className="form-group">
								<label htmlFor="phone">Telepon</label>
								<input type="text" className="form-control" name='phone' placeholder="Telepon" autoComplete="off" value={Editvalues.phone} onChange={handleChange} />
							</div>
							<div className="form-group">
								<label htmlFor="description">Description</label>
								<textarea className="form-control" rows="3" name='description' placeholder="Alamat" autoComplete="off" value={Editvalues.description} onChange={handleChange} ></textarea>
							</div>
							<div className="form-group">
								<label htmlFor="website">Website</label>
								<input type="text" className="form-control" name='website' placeholder="Website" autoComplete="off" value={Editvalues.website} onChange={handleChange} />
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

export default Bootcamp
