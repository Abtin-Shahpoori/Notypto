import React, { Component } from 'react';
import Block from './Block';
import { Button } from 'react-bootstrap';

class Blocks extends Component {
    state = { blocks: [], paginatedId: 1, blocksLength: 0 }; 
    componentDidMount() {
        fetch(`${document.location.origin}/api/blocks/length`)
            .then(res => res.json())
            .then(json => this.setState({ blocksLength: json }))
        this.fetchPaginatedBlocks(this.state.paginatedId)();
    }

    fetchPaginatedBlocks = paginatedId => () => {
        fetch(`${document.location.origin}/api/blocks/${paginatedId}`)
            .then(response => response.json())
            .then(json => this.setState({ blocks: json }))
    }

    render() {
        return (
            <div>
                <div className="Title">Blocks</div>
                <hr color="orange" size="4" className="seprator"/>

                <div className="blocks">
                    {
                        this.state.blocks.map(block => {
                            return(
                                <Block key={block.hash} block={block} />
                            );
                        })
                    }
                </div>
                <div>
                    {
                        // this.state.blocksLength
                        [...Array(Math.ceil(this.state.blocksLength/9)).keys()].map(key => {
                            const paginatedId = key+1;
                            return (
                                <span key={key} onClick={this.fetchPaginatedBlocks(paginatedId)} className="holder">
                                    <button className="pageNav">{paginatedId}</button>{' '}
                                </span>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Blocks;