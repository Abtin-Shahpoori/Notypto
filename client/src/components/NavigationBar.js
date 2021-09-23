import React, { Component } from "react";

class NavBar extends Component {
    
    activate () {
        this.className = "active";
    }

    render() {
        return (
            <ul className="navBar">
                <li><a href='./' onClick={this.activate}>Home</a></li>
                <li><a href="./blockchain" onClick={this.activate}>Blockchain</a></li>
                <li><a>Notes</a></li>
                <li><a>Wallet</a></li>
            </ul>
        );
    }
}

export default NavBar;