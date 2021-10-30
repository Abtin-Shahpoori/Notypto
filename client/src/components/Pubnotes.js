import React, { Component } from "react";
import Note from "./Note";

class Pubnotes extends Component {
  state = { notes: [], paginatedId: 1, noteLength: 0 };

  componentDidMount() {
    fetch(`${document.location.origin}/api/public-notes`)
    fetch(`${document.location.origin}/api/public-notes/length`)
      .then((res) => res.json())
      .then((json) => this.setState({ noteLength: json }));
    this.fetchPaginatedNote(this.state.paginatedId)();
  }

  fetchPaginatedNote = (paginatedId) => () => {
    fetch(`${document.location.origin}/api/public-notes/${paginatedId}`)
      .then((response) => response.json())
      .then((json) => this.setState({ notes: json }));
  };

  render() {
    return (
      <div>
        <div className="header">
          <a href="./">
            <button className="backButton">&#8249;</button>
          </a>
        </div>
        <div className="Notes">
          {this.state.notes.map((note) => {
            return (
              <Note
                key={note.timestamp}
                timestamp={note.timestamp}
                senderWallet={note.wallet}
                message={note.message}
              />
            );
          })}
        </div>
        <div>
          {
            [...Array(Math.ceil(this.state.noteLength / 9)).keys()].map(
              (key) => {
                const paginatedId = key + 1;
                return (
                  <span
                    key={key}
                    onClick={this.fetchPaginatedNote(paginatedId)}
                    className="holder"
                  >
                    <button className="pageNav">{paginatedId}</button>{" "}
                  </span>
                );
              }
            )
          }
        </div>
      </div>
    );
  }
}

export default Pubnotes;
