import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import Popup from "./Popup";
import remarkGfm from 'remark-gfm'

class Note extends Component {
    state = { PupupIsOpen: false };

    togglePopup = () => {
        this.setState({PupupIsOpen: !this.state.PupupIsOpen})
    }

    showNote = () => {
        return (
            <div>
                <h4 className="mini">{new Date(Number(this.props.timestamp)).toLocaleString()}</h4>
                <hr color="orange"/>
                <ReactMarkdown children={this.props.message} remarkPlugins={[remarkGfm]} />
            </div>
        )
    }

    render() {
        console.log(this.props.timestamp);
        return (
            <div className='block notePad' onClick={this.showNote}>
                <div className="infoDisplay" onClick={this.togglePopup}>
                    <h1 className="mini-text">{new Date(Number(this.props.timestamp)).toLocaleString()}</h1>
                    <h1 className="mini-text">{JSON.stringify(this.props.senderWallet)}</h1>
                    <p className="message-preview"><ReactMarkdown children={JSON.stringify(this.props.message).substring(0, 150)} /></p>
                </div>
                {this.state.PupupIsOpen && <Popup
                    content={
                        <div>
                            <h4 className="mini">{new Date(Number(this.props.timestamp)).toLocaleString()}</h4>
                            <hr color="orange"/>
                            <ReactMarkdown children={this.props.message} remarkPlugins={[remarkGfm]} />
                        </div>
                    }
                    handleClose={this.togglePopup}
                />}
                
            </div>
        );
    }
}

export default Note;