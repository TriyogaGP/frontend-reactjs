import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import env from "react-dotenv";

function Dashboard(props) {
	const [expire, setExpire] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		// refreshToken()
	},[])

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
						<h2>SELAMAT DATANG</h2>
					</div>
				</div>				
			</section>
		</div>
	)
}

export default Dashboard
