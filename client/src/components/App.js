import React, { Component } from 'react';
import ReactRotatingText from 'react-rotating-text';
import NoteImage from '../Pics/Notes.png';
import MainImage from '../Pics/abtin-project-min.png';

class App extends Component{
    render() {
        return (
            <div>
                    <ul className="navBar">
                        <li><a href='./' className="active">Home</a></li>
                        <li><a href="./blockchain">Blockchain</a></li>
                        <li><a href="./notes">Notes</a></li>
                    </ul>                
                <img src={MainImage} className="HomePage"></img>
                <h1 className="welcome">Welcome to <ReactRotatingText items={['freedom', 'privacy', 'Notypto']} /></h1>
                <div className="introduction">
                    <img src={NoteImage} className="Image"/>
                    <h1 className="summaryTitle">Writing Notes and sharing Ideas on blockchain</h1>
                    <p className="IntroText">Notypto is an open and fast blockchain built for privacy and security, used for note keeping, global payment, and sharing ideas with others on the network.</p>
                </div>
            </div>
        );
    }1
}

export default App;