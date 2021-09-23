import React, { Component } from "react";
import Qrcode from 'qrcode.react';
import {CopyToClipboard} from 'react-copy-to-clipboard';


class Recieve  extends Component{
    state = { Address: '' }
    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(res => res.json())
            .then(json => this.setState({Address: json.address }))
    }

    render() {
        return (
            <div>
                <div className="header"><a href="./wallet"><button className="backButton">&#8249;</button></a></div>
                <div className='Qr-Code'><Qrcode value={JSON.stringify(this.state.Address)} size="300"/></div>
                <div className='address-holder'>{JSON.stringify(this.state.Address)}</div>
                <CopyToClipboard text={this.state.Address}
                    onCopy={() => this.setState({copied: true})}>
                    <button className="copy-btn">Copy</button>
                </CopyToClipboard>
            </div>
        );
    }
};  

export default Recieve;