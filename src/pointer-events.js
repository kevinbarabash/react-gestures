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

document.addEventListener('touchmove', (evt) => {
    for (const touch of evt.changedTouches) {
        const element = document.elementFromPoint(touch.pageX, touch.pageY);

        if (!element) {
            // This occurs when the pointer goes outside the bounds of the page.
            // This usually only happense on desktop browsers.
            return;
        }
        
        const event = new CustomEvent('pointermove', {
            detail: {
                pageX: touch.pageX,
                pageY: touch.pageY,
            },
            bubbles: true,
            cancelable: true,
        });

        element.dispatchEvent(event);

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

document.addEventListener('touchend', (evt) => {
    evt.preventDefault();

    for (const touch of evt.changedTouches) {
        const element = document.elementFromPoint(touch.pageX, touch.pageY);

        if (!element) {
            // This occurs when the pointer goes outside the bounds of the page.
            // This usually only happense on desktop browsers.
            return;
        }
        
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

document.addEventListener('touchcancel', (evt) => {
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
