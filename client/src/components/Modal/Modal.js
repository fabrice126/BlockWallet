import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Slide from 'material-ui/transitions/Slide';

function Transition(props) {
    props.timeout.enter = 500;
    props.timeout.exit = 500;
    return <Slide direction="down" {...props} />;
}

export default class Modal extends Component {
    constructor() {
        super();
        this.state = {
            open: false,
        };
    }

    handleClickOpen = () => this.setState({ open: true });
    handleClose = (e) => this.setState({ open: false });

    render() {
        return (
            <div id="Modal">
                <Dialog open={this.state.open} transition={Transition} onClose={this.handleClose} >
                    <div className="dialog-content">
                        <div>
                            {"Vous pouvez ajouter une nouvelle crypto"}
                        </div>
                        <div>
                            <Button onClick={this.handleClose} color="primary">Disagree</Button>
                            <Button onClick={this.handleClose} color="primary">Agree</Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

