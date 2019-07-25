import React, { Component } from 'react'
import './header.scss'

class Header extends Component {

    constructor(props) {
        super(props)
    }


    render() {
        return (
            <div className="header-section">
                <div className="text-center">
                    <h2 className="font-weight-normal">STOCK MANAGEMENT APP</h2>
                </div>
            </div>
        )
    }
}

export default Header;