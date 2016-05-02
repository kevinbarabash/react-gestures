import React from 'react';
import ReactDOM from 'react-dom';

import View from './view';
import Button from './button';

class Keypad extends React.Component {
    state = {
        menu: false,
        swiping: false,
        lastX: null,
        translateX: 0,
    };

    handlePointerMove = (evt) => {
        // if the pointermove events have enough horizontal velocity this should
        // trigger a swipe gesture which should consume all events until the gesture
        // stops.

        const { lastX, menu, translateX } = this.state;

        if (lastX == null) {
            // TODO: create a synthetic event with pageX directly on the event
            // or... use mouse events in stead of custom DOM events
            this.setState({ lastX: evt.pageX });
        } else {
            const dx = evt.pageX - lastX;

            let swiping = this.state.swiping;

            // start swiping if the velocity if fast enough and the menu isn't showing
            // TODO: only allow swiping during the first 50 ms of the event stream
            if (Math.abs(dx) > 20 && !menu && !swiping) {
                swiping = true;
            }

            this.setState({
                swiping: swiping,
                lastX: evt.pageX,
                translateX: swiping ? translateX + dx : 0,
            });
        }
    };

    handlePointerUp = (evt) => {
        if (this.state.swiping) {
            this.setState({
                swiping: false,
                lastX: null,
                translateX: 0,
            });
        } else {
            this.setState({ lastX: null });
        }
    }

    showMenu = (evt) => {
        const menuStyle = {
            position: 'absolute',
            bottom: 0,
        };

        this.setState({
            menu: <View
                onPointerLeave={this.hideMenu}
                style={menuStyle}
            >
                <Button label="A" onPointerUp={this.hideMenu}/>
                <Button label="B" onPointerUp={this.hideMenu}/>
                <Button label="C" onPointerUp={this.hideMenu} focused={true} />
            </View>
        });
    };

    hideMenu = (evt) => {
        this.setState({
            menu: null
        });
    };

    render() {
        const { swiping, menu, translateX } = this.state;

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
            transform: `translate(${translateX}px, 0px)`,
        };

        // TODO: instead of having to disable all buttons, there should be a solo mode
        // where a component says to the system that it wants to be the only component
        // receiving events.
        return <View style={colStyle}>
            <View
                onPointerMove={this.handlePointerMove}
                onPointerUp={this.handlePointerUp}
                style={rowStyle}
            >
                <Button label="1" disabled={swiping} />
                <Button label="2" disabled={swiping} />
                <Button label="3" disabled={swiping} />
                <Button label="4" disabled={swiping} onPointerDown={this.showMenu} menu={menu}/>
            </View>
        </View>;
    }
}

export { Keypad as default };
