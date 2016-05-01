import React from 'react';
import ReactDOM from 'react-dom';
import { View, Text, StyleSheet } from 'react-native-web';

class PointerView extends React.Component {

    componentDidMount() {
        const domNode = ReactDOM.findDOMNode(this);

        // Without this pointer events won't work because events will be handled
        // by the browser's default touch action, usually scroll/pan.
        domNode.setAttribute('touch-action', 'none');

        domNode.addEventListener('pointerdown', (evt) => {
            evt.preventDefault();
            if (this.props.onPointerDown) {
                this.props.onPointerDown(evt);
            }
        });

        domNode.addEventListener('pointerup', (evt) => {
            if (this.props.onPointerUp) {
                this.props.onPointerUp(evt);
            }
        });

        domNode.addEventListener('pointerenter', (evt) => {
            if (this.props.onPointerEnter) {
                this.props.onPointerEnter(evt);
            }
        });

        domNode.addEventListener('pointerleave', (evt) => {
            if (this.props.onPointerLeave) {
                this.props.onPointerLeave(evt);
            }
        });

        domNode.addEventListener('pointermove', (evt) => {
            if (this.props.onPointerMove) {
                this.props.onPointerMove(evt);
            }
        })
    }

    render() {
        const style = {
            ...this.props.style,
            display: 'inline-block'
        };

        return <div style={style}>
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
        };

        // TODO: automaticlaly set pointerEvents none if there are no pointer event listeners
        const colStyle = {
            height: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            pointerEvents: 'none',
        };

        const textStyle = {
            fontFamily: 'sans-serif',
            fontSize: 48,
            pointerEvents: 'none',  // otherwise the child text will steal the event
        };


        return <PointerView
            onPointerEnter={this.handlePointerEnter}
            onPointerLeave={this.handlePointerLeave}
            onPointerDown={this.handlePointerDown}
            onPointerUp={this.handlePointerUp}
            style={buttonStyle}
        >
            <div style={colStyle}>
                <span style={textStyle}>{this.props.label}</span>
            </div>
            {this.props.menu && <div>{this.props.menu}</div>}
        </PointerView>
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

        const menu = this.state.menu ? <div style={menuStyle}>
            <Button label="A" onPointerUp={this.hideMenu}/>
            <Button label="B" onPointerUp={this.hideMenu}/>
            <Button label="C" focused={true} onPointerUp={this.hideMenu}/>
        </div> : null;

        return <div style={colStyle}>
            <div style={rowStyle}>
                <PointerView onPointerMove={this.handlePointerMove}>
                    <Button label="1"/>
                    <Button label="2"/>
                    <Button label="3"/>
                    <Button label="4" onPointerDown={this.showMenu} menu={menu}/>
                </PointerView>
            </div>
        </div>;
    }
}

export { App as default };
