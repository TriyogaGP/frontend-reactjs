import React, { Component } from 'react'

export default class Loading extends Component {
    render() {
        return (
            <div className="preloader flex-column justify-content-center align-items-center">
            	<img className="animation__wobble" src="dist/img/AdminLTELogo.png" alt="AdminLTELogo" height={60} width={60} />
            </div>
        )
    }
}
