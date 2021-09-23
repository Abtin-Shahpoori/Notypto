import React, { Component } from 'react';
import { FormGroup, FormControl, Button} from 'react-bootstrap';

class Send extends Component {
    state = { recipient: '', amount: 0 };

    updateRecipient = event => {
        this.setState({ recipient: event.target.value });
    }

    updateAmount = event => {
        this.setState({ amount: Number(event.target.value) });
    }

    conductTransaction = () => {
        const { recipient, amount } = this.state;

        fetch(`${document.location.origin}/api/transact`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ recipient, amount })
        }).then(response => response.json())
            .then(json => {
                alert(json.message || json.type);
            });
    }

    render() {
        return (
            <div>
                <div className="header"><a href="./wallet"><button className="backButton">&#8249;</button></a></div>
                <h1 className="SeTitle">Send</h1>
                <hr color="orange"/>
                <div className='ConductTransaction'>
                    <FormGroup>
                        <FormControl 
                            input='text'
                            placeholder='recipient'
                            value={this.state.recipient}
                            onChange={this.updateRecipient}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormControl 
                            input='number'
                            placeholder='amount'
                            value={this.state.amount}
                            onChange={this.updateAmount}
                        />
                    </FormGroup>
                </div>
                <div>
                    <Button onClick={this.conductTransaction}>Submit</Button>
                </div>
            </div>
        )
    }
}

export default Send;