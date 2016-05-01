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
            this.listeners['pointermove'] = (evt) => {
                this.props.onPointerMove(evt);
            }
            domNode.addEventListener('pointermove', this.listeners['pointermove']);
        }
        
        if (this.props.onPointerUp) {
            this.listeners['pointerup'] = (evt) => {
                this.props.onPointerUp(evt);
            }
            domNode.addEventListener('pointerup', this.listeners['pointerup']);
        }
        
        if (this.props.onPointerEnter) {
            this.listeners['pointerenter'] = (evt) => {
                this.props.onPointerEnter(evt);
            }
            domNode.addEventListener('pointerenter', this.listeners['pointerenter']);
        }
        
        if (this.props.onPointerLeave) {
            console.log('registering pointerleave');
            this.listeners['pointerleave'] = (evt) => {
                this.props.onPointerLeave(evt);
            }
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
        console.log('render');
        console.log(this.props);

        return <div style={this.props.style}>
            {this.props.children}
        </div>
    }
}

class Button extends React.Component {
    state = {
        focused: false,
    };

    static propTypes = {
        label: React.PropTypes.string.isRequired,
    };

    handlePointerEnter = (evt) => {
        this.setState({ focused: true });
    };

    handlePointerLeave = (evt) => {
        this.setState({ focused: false });
    };

    handlePointerDown = (evt) => {
        if (this.props.onPointerDown) {
            this.props.onPointerDown(evt);
        } else {
            // TODO: if props.onPointerDown returns true don't set state
            this.setState({ focused: true });
        }
    };

    handlePointerUp = (evt) => {
        if (this.props.onPointerUp) {
            this.props.onPointerUp(evt);
        }
        this.setState({ focused: false });
    };

    componentDidMount() {
        if (this.props.focused) {
            this.setState({ focused: true });
        }
    };

    render() {
        const focused = this.state.focused;

        const buttonStyle = {
            position: 'relative',
            width: 64,
            height: 64,
            backgroundColor: focused ? 'red' : 'lightgray',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        };

        const textStyle = {
            fontFamily: 'sans-serif',
            fontSize: 48,
        };
        
        return <View
            onPointerEnter={this.handlePointerEnter}
            onPointerLeave={this.handlePointerLeave}
            onPointerDown={this.handlePointerDown}
            onPointerUp={this.handlePointerUp}
            style={buttonStyle}
        >
            <span style={textStyle}>{this.props.label}</span>
            {this.props.menu}
        </View>
    }
}

class App extends React.Component {
    state = {
        menu: false,
    };

    handlePointerMove = (evt) => {
        console.log('row move')
    };

    showMenu = (evt) => {
        this.setState({
            menu: true
        });
    };

    hideMenu = (evt) => {
        this.setState({
            menu: false
        });
    };

    render() {
        const colStyle = {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        };

        const rowStyle = {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
        };

        const menuStyle = {
            position: 'absolute',
            bottom: 0,
        };

        const menu = this.state.menu ? <View style={menuStyle} onPointerLeave={this.hideMenu}>
            <Button label="A" onPointerUp={this.hideMenu}/>
            <Button label="B" onPointerUp={this.hideMenu}/>
            <Button label="C" onPointerUp={this.hideMenu} focused={true} />
        </View> : null;

        return <div style={colStyle}>
            <View style={rowStyle} onPointerMove={this.handlePointerMove}>
                <Button label="1"/>
                <Button label="2"/>
                <Button label="3"/>
                <Button label="4" onPointerDown={this.showMenu} menu={menu}/>
            </View>
        </div>;
    }
}

export { App as default };
