const addEventListener = HTMLElement.prototype.addEventListener;

const elements = new Map();

HTMLElement.prototype.addEventListener = function(type, listener, useCapture = false) {
    addEventListener.call(this, type, listener, useCapture);
    if (!elements.has(this)) {
        elements.set(this, { focused: false });
    }
};

ClientRect.prototype.contains = function(touch) {
    return  touch.pageX >= this.left &&
        touch.pageX <= this.right &&
        touch.pageY >= this.top &&
        touch.pageY <= this.bottom;
};

document.addEventListener('touchstart', (evt) => {
    evt.preventDefault();

    for (const touch of evt.changedTouches) {
        const element = document.elementFromPoint(touch.pageX, touch.pageY);

        const event = new CustomEvent('pointerdown', {
            pageX: touch.pageX,
            pageY: touch.pageY,
            bubbles: true,
            cancelable: true,
        });

        element.dispatchEvent(event);

        // TODO: fix dispatch order
        for (const [element, state] of elements) {
            const bounds = element.getBoundingClientRect();
            if (bounds.contains(touch)) {

                const event = new CustomEvent('pointerenter', {
                    pageX: touch.pageX,
                    pageY: touch.pageY,
                    bubbles: false,
                    // Don't bubble otherwise we'll get leave events from all
                    // of our children.
                    // TODO: figure out what the spec does by checking IE/Edge
                    cancelable: true,
                });

                element.dispatchEvent(event);

                state.focused = true;
            }
        }
    }
});

document.addEventListener('touchend', (evt) => {
    evt.preventDefault();

    for (const touch of evt.changedTouches) {
        const element = document.elementFromPoint(touch.pageX, touch.pageY);

        const event = new CustomEvent('pointerup', {
            pageX: touch.pageX,
            pageY: touch.pageY,
            bubbles: true,
            cancelable: true,
        });

        element.dispatchEvent(event);

        // TODO: fix dispatch order
        for (const [element, state] of elements) {
            const bounds = element.getBoundingClientRect();
            if (bounds.contains(touch)) {

                const event = new CustomEvent('pointerleave', {
                    pageX: touch.pageX,
                    pageY: touch.pageY,
                    bubbles: false,
                    // Don't bubble otherwise we'll get leave events from all
                    // of our children.
                    // TODO: figure out what the spec does by checking IE/Edge
                    cancelable: true,
                });

                element.dispatchEvent(event);

                state.focused = false;
            }
        }
    }
});

document.addEventListener('touchmove', (evt) => {
    for (const touch of evt.changedTouches) {
        const element = document.elementFromPoint(touch.pageX, touch.pageY);

        const event = new CustomEvent('pointermove', {
            pageX: touch.pageX,
            pageY: touch.pageY,
            bubbles: true,
            cancelable: true,
        });

        element.dispatchEvent(event);

        // not support by safari :(
        // console.log(document.elementsFromPoint(touch.pageX, touch.pageY));

        // TODO: correct the order of dispatching these events by doing the following
        // 1. filter elements to find those which should be dispatched to
        // 2. determine which contains which
        // 3. dispatch events in the correct order
        for (const [element, state] of elements) {
            const bounds = element.getBoundingClientRect();
            const focused = bounds.contains(touch);

            if (state.focused && !focused) {
                const event = new CustomEvent('pointerleave', {
                    pageX: touch.pageX,
                    pageY: touch.pageY,
                    bubbles: false,
                    // Don't bubble otherwise we'll get leave events from all
                    // of our children.
                    // TODO: figure out what the spec does by checking IE/Edge
                    cancelable: true,
                });

                element.dispatchEvent(event);
            } else if (!state.focused && focused) {
                const event = new CustomEvent('pointerenter', {
                    pageX: touch.pageX,
                    pageY: touch.pageY,
                    bubbles: false,
                    // Don't bubble otherwise we'll get leave events from all
                    // of our children.
                    // TODO: figure out what the spec does by checking IE/Edge
                    cancelable: true,
                });

                element.dispatchEvent(event);
            }

            state.focused = focused;
        }
    }
});


const container = document.getElementById('container');
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');


container.addEventListener('pointerdown', (evt) => {
    console.log('container: pointerdown');
});

button1.addEventListener('pointerdown', (evt) => {
    console.log('button1: pointerdown');
});

button2.addEventListener('pointerdown', (evt) => {
    console.log('button1: pointerdown');
});


container.addEventListener('pointerenter', (evt) => {
    console.log('enter container');
    container.classList.add('focused');
});

button1.addEventListener('pointerenter', (evt) => {
    console.log('enter button');
    button1.classList.add('focused');
});

container.addEventListener('pointerleave', (evt) => {
    console.log('leave container');
    container.classList.remove('focused');
});

button1.addEventListener('pointerleave', (evt) => {
    console.log('leave button');
    button1.classList.remove('focused');
});

