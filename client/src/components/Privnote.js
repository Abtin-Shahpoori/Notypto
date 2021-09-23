import React, { Component } from "react";
import Note from './Note';

class Privnote extends Component {
    state = { notes: [] };

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-personal-notes`)
            .then(response => response.json())
            .then(json => this.setState({ notes: json }))
    }

    render() {
        console.log(this.state)
        return (
            <div>
                <div className="header"><a href="./Notes"><button className="backButton">&#8249;</button></a><a href="./create-priv-note"><button className="backButton AddButton">+</button></a></div>
                <div className="Notes">
                    {
                        this.state.notes.map(note => {
                            return(
                                <Note key={note.timestamp} timestamp={note.timestamp} senderWallet={note.wallet} message={note.message}/>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Privnote;