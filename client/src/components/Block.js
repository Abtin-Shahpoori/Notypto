import React, { Component } from "react";
import Popup from  './Popup'

class Block extends Component {
    state = { displayTransaction: false, displayNotes: false, PupupIsOpen: false};

    toggleTransaction = () => {
        this.setState({ displayTransaction: !this.state.displayTransaction });
    };

    togglePopup = () => {
        this.setState({PupupIsOpen: !this.state.PupupIsOpen})
    }

    get displayTransaction() {
        const { Data } = this.props.block;
        const stringifiedData = JSON.stringify(Data.Transactions);
        const dataDisplay = stringifiedData.length > 35 ?`
        ${stringifiedData.substring(1, 35)}...`:
        stringifiedData;  
        return <div>Transactions: {dataDisplay}</div>
    }

    render() {
        const { timestamp, hash, Data } = this.props.block;

        const hashDisplay = `${hash.substring(0, 15)}...`;

        return (
            <div className='block' onClick={this.togglePopup}>
                <div className="infoDisplay">
                    <div>Hash: {hashDisplay}</div><br/>
                    <div>Timestamp: {new Date(timestamp).toLocaleString()}</div><br/>
                    {this.displayTransaction}<br/>
                    <div>Notes: {JSON.stringify(Data.Notes).substring(0, 15)}</div>
                    
                </div>
                {this.state.PupupIsOpen && <Popup
                    content={<div>
                        <div>Hash: {hash}</div><hr />
                        <div>Timestamp: {new Date(timestamp).toLocaleString()}</div><hr />
                        <pre id="json">Transactions: <br />{JSON.stringify(Data.Transactions, undefined, 2)}</pre><hr />
                        <pre id="json">Notes: <br />{JSON.stringify(Data.Notes, undefined, 2)}</pre><hr />
                    </div>}
                    handleClose={this.togglePopup}
                />}
            </div>
        );
    }
};

export default Block;