import React, { Component } from 'react';

class Notes extends Component {
    render() {
        return (
            <div>
                    <ul className="navBar">
                        <li><a href='./'>Home</a></li>
                        <li><a href="./blockchain">Blockchain</a></li>
                        <li><a href="./wallet">Wallet</a></li>
                        <li><a href="./notes" className="active">Notes</a></li>
                    </ul>
                    <div>
                        <a href="./pub-notes"><div className="PublicNote-Starter"><h1>Public Notes</h1></div></a>
                        <a href="./priv-notes"><div className="PrivNote-Starter"><h1>Private Notes</h1></div></a>
                    </div>            
            </div>
        )
    };
}

export default Notes;