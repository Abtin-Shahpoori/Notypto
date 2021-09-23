import React, { useState } from "react";
import MDEditor from '@uiw/react-md-editor';
import { Button } from "react-bootstrap";


const PrivNoteCreate = () => {
    const [message, setMessage] = React.useState({ message: "**Hello world!!!**" });
    const [bmessage, bsetMessage] = React.useState("**Hello world!!!**");


    const handleSubmit = e => {
      e.preventDefault();
      setMessage({message: bmessage});
      const data = { message };
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message)
      };
      fetch(`${document.location.origin}/api/priv-message`, requestOptions)
        .then(res => res.json())
        .then(json => alert(json.message || json.type));
    };
        
    return(
        <div>
            <div className="header"><a href="./notes"><button className="backButton">&#8249;</button></a></div>
            <h1 className="SeTitle">Create Private Note</h1>
            <hr color="orange" className="note-sep" />
            {/* <input value={JSON.stringify(message)} onChange={e => setMessage(e.target.value)} /> */}
            <MDEditor value={bmessage}  onChange={bsetMessage}/>
            <Button onClick={handleSubmit}>Send</Button>
        </div>
    );
};

export default PrivNoteCreate;
