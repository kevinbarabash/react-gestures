import React from 'react';

import View from './view';

class Button extends React.Component {
    state = {
        focused: false,
    };

    static propTypes = {
        label: React.PropTypes.string.isRequired,
        disabled: React.PropTypes.bool,  
    };
    
    static defaultProps = {
        disabled: false,
    }

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
            this.setState({ focused: true });
        }
    };

    handlePointerUp = (evt) => {
        if (this.props.onPointerUp) {
            this.props.onPointerUp(evt);
        } else {
            this.setState({ focused: false });
        }
    };

    componentDidMount() {
        if (this.props.focused) {
            this.setState({ focused: true });
        }
    };

    render() {
        const focused = this.state.focused;
        const disabled = this.props.disabled;

        const buttonStyle = {
            position: 'relative',
            width: 64,
            height: 64,
            backgroundColor: (focused && !disabled) ? 'red' : 'lightgray',
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

export { Button as default };
