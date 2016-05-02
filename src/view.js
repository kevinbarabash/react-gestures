import React from 'react';
import ReactDOM from 'react-dom';

import './pointer-events';

class View extends React.Component {
    static propTypes = {
        onPointerDown: React.PropTypes.func,
    };

    componentDidMount() {
        const domNode = ReactDOM.findDOMNode(this);

        this.listeners = {};

        if (this.props.onPointerDown) {
            this.listeners['pointerdown'] = (evt) => {
                evt.preventDefault();
                this.props.onPointerDown(evt);
            }
            domNode.addEventListener('pointerdown', this.listeners['pointerdown']);
        }

        if (this.props.onPointerMove) {
            this.listeners['pointermove'] = (evt) => this.props.onPointerMove(evt);
            domNode.addEventListener('pointermove', this.listeners['pointermove']);
        }

        if (this.props.onPointerUp) {
            this.listeners['pointerup'] = (evt) => this.props.onPointerUp(evt);
            domNode.addEventListener('pointerup', this.listeners['pointerup']);
        }

        if (this.props.onPointerEnter) {
            this.listeners['pointerenter'] = (evt) => this.props.onPointerEnter(evt);
            domNode.addEventListener('pointerenter', this.listeners['pointerenter']);
        }

        if (this.props.onPointerLeave) {
            this.listeners['pointerleave'] = (evt) => this.props.onPointerLeave(evt);
            domNode.addEventListener('pointerleave', this.listeners['pointerleave']);
        }
    }

    componentWillUnmount() {
        const domNode = ReactDOM.findDOMNode(this);

        for (const [name, listener] of Object.entries(this.listeners)) {
            domNode.removeEventListener(name, listener);
        }
    }

    render() {
        return <div style={this.props.style}>
            {this.props.children}
        </div>
    }
}

export { View as default };
