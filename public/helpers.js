const HandleClick = (icon, msg) => {
	Swal.fire({  
		title: 'Konfirmasi',  
		text: msg,  
		icon: icon,  
		showCancelButton: true,  
		confirmButtonColor: '#3085d6',  
		cancelButtonColor: '#d33',  
		confirmButtonText: 'Yes!',  
		cancelButtonText: 'cancel',
		allowOutsideClick: false
	}).then(function(value){
		if(value.isConfirmed == true){
			Swal.fire('Sukses', '', 'success')
		}
	});
}

const click = () => {
	HandleClick('question', 'Are you sure?')
}