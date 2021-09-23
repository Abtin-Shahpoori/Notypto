import React, { Component } from 'react';
import Blocks from './Blocks';
import NavBar from './NavigationBar';

class Blockchain extends Component{
    state = { walletInfo: {} };
    
    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`).then((response) => response.json())
            .then(json => this.setState({ walletInfo: json}));
    }

    render() {
        return (
            <div>
                <ul className="navBar">
                    <li><a href='./'>Home</a></li>
                    <li><a href="./blockchain" className="active">Blockchain</a></li>
                    <li><a href="./wallet">Wallet</a></li>
                    <li><a href="./notes">Notes</a></li>
                </ul><br /><br />
                <Blocks />
            </div>
        );
        
    }1
}

export default Blockchain;