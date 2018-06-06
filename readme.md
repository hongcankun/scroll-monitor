# scroll-monitor
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=alhUZjJoT011bjkxWURzRUcrYm5TclNRRnVVL090Ulk5ODlrczNHUjB1QT0tLWFrNW9YbkdFMEwrTlI0RkZmQ1NoV2c9PQ==--3a4c5f45c55eb7fb7e942937938a217444f5c16a)](https://www.browserstack.com/automate/public-build/alhUZjJoT011bjkxWURzRUcrYm5TclNRRnVVL090Ulk5ODlrczNHUjB1QT0tLWFrNW9YbkdFMEwrTlI0RkZmQ1NoV2c9PQ==--3a4c5f45c55eb7fb7e942937938a217444f5c16a)
[![Build Status](https://travis-ci.org/swgrhck/scroll-monitor.svg?branch=master)](https://travis-ci.org/swgrhck/scroll-monitor)
[![Coverage Status](https://coveralls.io/repos/github/swgrhck/scroll-monitor/badge.svg?branch=master)](https://coveralls.io/github/swgrhck/scroll-monitor?branch=master)

This is a JavaScript plugin that monitors and responds to scroll event, and supports the usage via data attributes to separate html from script.

## Installation

Include `scroll-monitor.umd.min.js` script, or standalone JS files, such as `monitor.min.js`, if you only want to use partial components:

```html
<script src="scroll-monitor.umd.min.js"></script>

<!-- or if you only want to use partial components -->
<script src="monitor.min.js"></script>
<!-- other components -->
```

## Basic Usage

The core component of ScrollMonitor is `Monitor`, which monitor and resolve scroll events of targets, then dispatch resolved events to subscribers, so subscribers can listen to classified scroll event, such as scroll up.

The easiest and preferred way to use `Monitor` is by data attribute `data-monitor="scroll"`:

```html
<div data-monitor="scroll"></div>
```

The `div` above will monitor scroll events of `window`, so once window scrolled, `Monitor` would dispatch events to subscribers.

You can also specify the targets of `Monitor` by data attribute `data-monitor-target="<querySelector>"`:

```html
<div class="monitored">
    <div data-monitor="scroll" data-monitor-target=".monitored"></div>
</div>
```

Now the `div` will monitor scroll events of all elements with class `monitored`.

The other way to use `Monitor` is by JavaScript:

```javascript
const Monitor = window.Monitor || window.scrollMonitor.Monitor
let monitor = Monitor.of(target)
monitor.subscribe(subscriber)
```

You can invoke `Monitor.of(target)` to get the monitor of target, and then add subscriber by invoking `monitor.subscribe(subscriber)`.

> The target must be an instance of [Window](https://developer.mozilla.org/en-US/docs/Web/API/Window) or [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element).
>
> The subscriber must be an instance of [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget).

## Scroll Direction Resolver

`ScrollDirectionResolver` is a resolver registered to `Monitor`, which can resolve scroll events to recognize the scroll direction.

The easiest and preferred way to use `ScrollDirectionResolver` is by data attribute `data-monitor="scroll-direction"`:

```html
<div data-monitor="scroll scroll-direction"></div>
```

The `div` above will monitor scroll events of `window`, and toggle the classes according to scroll direction:

* toggle class `scroll-up` when window scroll up.
* toggle class `scroll-down` when window scroll down.
* toggle class `scroll-left` when window scroll left.
* toggle class `scroll-right` when window scroll right.

You can also specify the classes toggled by data attributes:

* `data-scroll-up-class="<class>"`
* `data-scroll-down-class="<class>"`
* `data-scroll-left-class="<class>"`
* `data-scroll-right-class="<class>"`

For example:

```html
<div data-monitor="scroll scroll-direction" data-scroll-up-class="up"></div>
```

Now when window scrolling up, the `div` will toggle class `up` instead of `scroll-up`.

The other way to use `ScrollDirectionResolver` is by Javascript. When target scrolls, `ScrollDirectionResolver` will resolve and dispatch 4 events:

* `scroll.up.scroll-monitor` when target scrolls up

* `scroll.down.scroll-monitor` when target scrolls down

* `scroll.left.scroll-monitor` when target scrolls left

* `scroll.right.scroll-monitor` when target scrolls right

This means that you can add event listeners to subscribers to do anything you want:

```javascript
Monitor.of(window).subscribe(window)

window.addEventListener('scroll.up.scroll-monitor', event => {
    // anything you want to do
})
```

## Extend ScrollMonitor

The `ScrollMonitor` is flexible and pluggable, this means you can extend `ScrollMonitor` easily if present components can't satisfy your needs.

```javascript
const customResolver = {
    resolve(lastMetric, crtMetric, event) {
        const resolvedEvents = []
        
        // resolve and add your own events to resolvedEvents
        
        return resolvedEvents
    }
}

Monitor.registerResolver(customResolver)
```

The code above briefly demostrates how to register new `Resolver` to `Monitor`,  the only requirement of `Resolver` is it must define a funtion named `resolve` returing an array of `Event`s.

The `require` function of `Resolver` receive 3 arguments:

1. `lastMetric`: the `ScrollMetric` before target scrolled.
2. `crtMetric `: the `ScrollMetric` after target scrolled.
3. `event`: the origin scroll event emitted by target.

The `ScrollMetric` have 4 read-only properties:

1. `height`: the height of an target's content, including content not visible on the screen due to overflow. 
2. `width`:  the width of an target's content, including content not visible on the screen due to overflow. 
3. `top`: the number of pixels that an target's content is scrolled to the top. 
4. `left`: the number of pixels that an target's content is scrolled to the left. 

For more information about these properties, see [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element), and search `scrollHeight`, `scrollWidth`, `scrollTop` and `scrollLeft`.

Once you register your own `Register`, you can add `EventListener` to subscribers so that they can respond to events defined by yourself properly.

## Browser support

[![BrowserStack Logo](./assert/browserstack-logo.png)](http://browserstack.com/)

[BrowserStack](https://www.browserstack.com/) is a cross browser and real device web-based testing platform. BrowserStack can be used for interactive as well as automated testing through frameworks like Selenium, Karma and others.

This plugin is tested on multiple platforms and browsers under supports of [BrowserStack](https://www.browserstack.com/):

* Windows
* Mac OS
* Android
* Chrome
* Firefox
* Safari
* Microsoft Edge
