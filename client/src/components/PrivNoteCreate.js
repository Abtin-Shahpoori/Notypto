import React, { useState } from "react";
import MDEditor from '@uiw/react-md-editor';
import { Button } from "react-bootstrap";


const PrivNoteCreate = () => {
    const [message, setMessage] = React.useState({ message: "" });
    const [bmessage, bsetMessage] = React.useState();


    const handleSubmit = e => {
      e.preventDefault();
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({message: bmessage})
      };
      fetch(`${document.location.origin}/api/pub-message`, requestOptions)
        .then(res => res.json())
        .then(json => console.log(json));
    };
        
    return(
        <div>
            <div className="header"><a href="./notes"><button className="backButton">&#8249;</button></a></div>
            <h1 className="SeTitle">Create Private Note</h1>
            <hr color="orange" className="note-sep" />
            <MDEditor value={bmessage}  onChange={bsetMessage}/>
            <Button onClick={handleSubmit}>Send</Button>
        </div>
    );
};

export default PrivNoteCreate;
