import React, { Component } from "react";
import { Link } from "react-router-dom";

class Wallet extends Component {
    state = { Balance: 0 };

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(res => res.json())
            .then(json => this.setState({ Balance: json.balance }))
    }
    
    render (){
        return (
            <div className="Wallet-body">
                <div className="header"><a href="./"><button className="backButton">&#8249;</button></a></div>
                <div className="Balance-Circle"><div className="balance">{JSON.stringify(this.state.Balance)}</div></div>
                <button className="send-button"><a className="btn-text" href='./transact-send'><h className="btn-text">Send</h></a></button>
                <button className="recieve-button"><a className="btn-text" href='./transact-recieve'><h className="btn-text">Recieve</h></a></button>
            </div>
        );
    };
}

export default Wallet