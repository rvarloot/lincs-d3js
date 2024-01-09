# Displaying cards with D3.js

## What is D3.js?

- "Data Driven Documents"
- Populate an HTML document based on a data structure (typically JSON)
- Keep the HTML and data in sync
- Animate transitions

## Boilerplate code

- `README.md`
- `index.html`
- `style.css`
- `deck.js`
- **`draw.js`** <- You’ll be working here!

### The HTML

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Displaying cards with D3.js</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <main>
        <!-- D3.js will insert content here -->
    </main>

    <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
    <script src="deck.js"></script>
    <script src="draw.js"></script>
</body>
</html>
```

### Data exposed by `deck.js`

```javascript
const DECK = [
    { height: '2', suit: '♣' },
    { height: '3', suit: '♣' },
    /* ... */
    { height: 'K', suit: '♣' },
    { height: 'A', suit: '♣' },
    { height: '2', suit: '♦' },
    { height: '3', suit: '♦' },
    /* ... */
    { height: '9', suit: '♠' },
    { height: 'X', suit: '♠' },
    { height: 'J', suit: '♠' },
    { height: 'Q', suit: '♠' },
    { height: 'K', suit: '♠' },
    { height: 'A', suit: '♠' },
]   /* size: 52 */

const SEPARATED_DECK = [
    [{ height: '2', suit: '♣' }, /* ... */ { height: 'A', suit: '♣' }],
    [{ height: '2', suit: '♦' }, /* ... */ { height: 'A', suit: '♦' }],
    [{ height: '2', suit: '♥' }, /* ... */ { height: 'A', suit: '♥' }],
    [{ height: '2', suit: '♠' }, /* ... */ { height: 'A', suit: '♠' }],
]   /* size: 4 × 13 */

generateShuffledDeck() /* as DECK, but randomized */
generateRandomHands() /* as SEPARATED_DECK, but randomized (hands are sorted) */

playRandomly() /* List of 14 SEPARATED_DECK-like structures with decreasing hand sizes */
```

## First steps with D3.js

### Selection and modifying nodes

```javascript
/* Remember: we’re working in `draw.js` */

d3.select('main')
    .attr('id', 'main')
    .text('Lorem ipsum')
```

Output:

```html
<main id="main">Lorem ipsum</main>
```

### Adding nodes

```javascript
d3.select('main')
    .append('div')
        .text('Lorem ipsum')
```

Output:

```html
<main>
    <!-- D3.js will insert content here -->
    <div>Lorem ipsum</div>
</main>
```

_Note how the inner comment was not removed, unlike what happened when calling `text()`._

### Binding data

Let’s display all the cards!

```javascript
d3.select('main')
    .selectChildren('div')   //
    .data(DECK)         // Binding data
    .join('div')        //
        .attr('class', d => d.suit)     // Using data
        .text(d => d.suit + d.height)   //
```

Output:

```html
<main>
    <!-- D3.js will insert content here -->
    <div class="♣">♣2</div>
    <div class="♣">♣3</div>
    <!-- ... -->
    <div class="♠">♠A</div>
</main>
```

Yes, we could just use `append` inside a loop, but we'll see later that this is **much more powerful!**

### Nesting

```javascript
d3.select('main')
    .append('table')
        .selectChildren('tr')
        .data(SEPARATED_DECK)
        .join('tr')
            .selectChildren('td')
            .data(d => d)
            .join('td')
                .text(d => d.suit + d.height)
```

Output:

```html
<table>
    <tr> <td>♣2</td> <td>♣3</td> <!-- ... --> <td>♣A</td> </tr>
    <tr> <td>♦2</td> <td>♦3</td> <!-- ... --> <td>♦A</td> </tr>
    <tr> <td>♥2</td> <td>♥3</td> <!-- ... --> <td>♥A</td> </tr>
    <tr> <td>♠2</td> <td>♠3</td> <!-- ... --> <td>♠A</td> </tr>
</table>
```

### Building complex elements

```javascript
const div = d3.select('main')
    .selectChildren('div')
    .data(DECK)
    .join('div')
        .attr('class', d => d.suit)

div.append('span')
    .text(d => d.suit)
    .style('text-decoration', 'underline')

div.append('span')
    .text(d => d.height)
    .style('font-weight', 'bold')
```

```html
<main>
    <div class="♣">
        <span style="text-decoration: underline;">♣</span>
        <span style="font-weight: bold;">2</span>
    </div>
    <div class="♣">
        <span style="text-decoration: underline;">♣</span>
        <span style="font-weight: bold;">3</span>
    </div>
    <!-- ... -->
    <div class="♠">
        <span style="text-decoration: underline;">♠</span>
        <span style="font-weight: bold;">A</span>
    </div>
</main>
```

## Understanding bindings

What happens if we run our code _twice_?

```javascript
d3.select('main')
    .selectChildren('div')
    .data(DECK)
    .join('div')
        .attr('class', d => d.suit)
        .text(d => d.suit + d.height)

d3.select('main')
    .selectChildren('div')
    .data(DECK)
    .join('div')
        .attr('class', d => d.suit)
        .text(d => d.suit + d.height)
```

Surprise: **the output is unchanged!** The deck only appears once.

Explanation: the following code **updates** a one-to-one binding between DOM elements and data entries.

```javascript
.selectChildren('div')   // Designates the DOM elements
.data(DECK)         // Designates the dataset
.join('div')        // Updates the DOM elements to match the dataset
```

### `data`

In order to properly bind elements, `d3.js` requires a way of identifying data. This is done by providing an identifier function to the `data` function:

```javascript
.data(DECK, d => d.index)
```


### `join`

`.join('div')` is in fact a shorthand. The `.join` function generally looks like this:

```javascript
.join(
    onEnter,    // Called when a dataset entry has no DOM counterpart
    onUpdate,   // Called when a dataset entry has a DOM counterpart
    onExit,     // Called when a DOM element has no dataset counterpart
)
```

`.join(name)` is equivalent to:

```javascript
.join(
    parent => parent.append(name),
    element => element,
    element => element.remove()
)
```

### Example

```javascript
function update(data) {
    d3.select('main')
        .selectChildren('div')
        .data(data, d => d.index)
        .join(
            parent => parent.append('div')
                .text(d => d.suit + d.height + ' <-------'),
            element => element
                .text(d => d.suit + d.height),
            element => element.remove(),
        )
            .attr('class', d => d.suit) // Selection containing a merge of new and updated elements
}

for (let i = 0; i <= 62; i++) {
    setTimeout(() => update(DECK.slice(Math.max(i - 10, 0), Math.min(i, 52))), i * 100)
}
```

## Working with SVGs

Let's start "simple": we'll draw the cards from `SEPARATED_HANDS` as follows:

```html
<svg viewBox="-100 -100 200 200">
    <g> <!-- One group per suit -->
        <g class="♣"> <!-- One group per height -->
            <rect x="-4.5" y="-7" width="9" height="14" class="back"></rect>
            <text y="-1" text-anchor="middle">♣</text>
            <text y="6" text-anchor="middle">2</text>
        </g>
        <g class="♣">
            <rect x="-4.5" y="-7" width="9" height="14" class="back"></rect>
            <text y="-1" text-anchor="middle">♣</text>
            <text y="6" text-anchor="middle">2</text>
        </g>
        <!-- ... -->
    </g>
    <g>
        <g class="♦">
            <rect x="-4.5" y="-7" width="9" height="14" class="back"></rect>
            <text y="-1" text-anchor="middle">♦</text>
            <text y="6" text-anchor="middle">2</text>
        </g>
        <!-- ... -->
    </g>
    <!-- ... -->
</svg>
```

```javascript
const groups = d3.select('main')
    .append('svg')
        .attr('viewBox', "-100 -100 200 200")
        .selectChildren('g')
        .data(SEPARATED_DECK)
        .join('g')
            .selectChildren('g')
            .data(d => d)
            .join('g')
                .attr('class', d => d.suit)

groups.append('rect')
    .attr('x', -4.5)
    .attr('y', -7)
    .attr('width', 9)
    .attr('height', 14)
    .classed('back', true) // Apply a class, here for a white background

groups.append('text')
    .attr('y', -1)
    .attr('text-anchor', 'middle')
    .text(d => d.suit)

groups.append('text')
    .attr('y', 6)
    .attr('text-anchor', 'middle')
    .text(d => d.height)
```

### Placement

For now, the cards are stacked. To place SVG elements:

- Shapes such as `rect` and `text` use the `x` and `y` attributes
- Groups (`g`) can't use `x` and `y`, and must use the `transform` attribute

For this, we can use the index of a data entry, which is given by the second argument to functions:

```javascript
.attr('transform', (_, i) => `rotate(${90 * i}) translate(0 80)`)   // For suit groups
.attr('transform', (_, i) => `translate(${10 * (i - 6)} 0)`)        // For card groups
```

The third argument contains the dataset, which can be useful, e.g., if the hand sizes change over time:

```javascript
.attr('transform', (_, i, n) => `translate(${10 * (i - (n.length - 1) / 2)} 0)`)
```

### Updating the game

First, let’s place our update operations inside an `updateGame` function, passing the data as a parameter:

```javascript
const svg = d3.select('main')               // Move this out as we only do it once
        .append('svg')
        .attr('viewBox', "-100 -100 200 200")

function updateGame(data) {
    const groups = svg
        .selectChildren('g')
        .data(data, (_, i) => i)            // Index defined by position
        .join('g')
            .attr('transform', (_, i) => `rotate(${90 * i}) translate(0 80)`)
            .selectChildren('g')
            .data(d => d, d => d.index)     // card.index allows us to quickly identify each card
            .join('g')
                .attr('class', d => d.suit)
                .attr('transform', (_, i, n) => `translate(${10 * (i - (n.length - 1) / 2)} 0)`)

    groups.append('rect')
        .attr('x', -4.5)
        .attr('y', -7)
        .attr('width', 9)
        .attr('height', 14)
        .classed('back', true)

    groups.append('text')
        .attr('y', -1)
        .attr('text-anchor', 'middle')
        .text(d => d.suit)

    groups.append('text')
        .attr('y', 6)
        .attr('text-anchor', 'middle')
        .text(d => d.height)
}
```

And now, the magic:

```javascript
const game = playRandomly()
game.forEach((hands, i) => setTimeout(() => updateGame(hands), 1000 * (i+1)))
```

There’s a problem, however: the `.append` calls should only happen once, on the first run.
Rather than duplicate code, let’s properly define the `enter`, `update` and `exit` methods for cards:

```javascript
function enter(parent) {
    const g = parent.append('g')
        .attr('class', d => d.suit) // Might as well move this here as well

    g.append('rect')
        .attr('x', -4.5)
        .attr('y', -7)
        .attr('width', 9)
        .attr('height', 14)
        .classed('back', true)

    g.append('text')
        .attr('y', -1)
        .attr('text-anchor', 'middle')
        .text(d => d.suit)

    g.append('text')
        .attr('y', 6)
        .attr('text-anchor', 'middle')
        .text(d => d.height)

    return g
}

function update(element) {
    return element
}

function exit(element) {
    return element.remove()
}
```

Don’t forget to replace the `.join('g')` call for cards with `.join(enter, update, exit)`:

```javascript
function updateGame(data) {
    svg
        .selectChildren('g')
        .data(data, (_, i) => i)
        .join('g')
            .attr('transform', (_, i) => `rotate(${90 * i}) translate(0 80)`)
            .selectChildren('g')
            .data(d => d, d => d.index)
            .join(enter, update, exit)
                // Returns a merge of entering and updated elements
                .attr('transform', (_, i, n) => `translate(${10 * (i - (n.length - 1) / 2)} 0)`)
}
```

### Animating cards

To animate cards, we add a `.transition()`. Let’s start with the placement:

```javascript
/* ... */
    .join(enter, update, exit)
        .transition().duration(500)
            .attr('transform', (_, i, n) => `translate(${10 * (i - (n.length - 1) / 2)} 0)`)
```

Now, let’s actually play the cards inside the `exit` method:

```javascript
function exit(element) {
    return element
        .transition().duration(500)
        .attr('transform', () => `translate(0 -50)`)
            .transition().duration(500)     // Notice the chaining of transitions
                .style('opacity', 0)
                    .remove()
}
```

And finally, let’s not forget to deal the cards:

```javascript
function enter(parent) {
    const g = parent.append('g')
        .attr('class', d => d.suit)
        .attr('transform', () => `translate(0 -80)`)
        .style('opacity', '0')      // Fix the initial value

    /* ... */
}

/* ... */
    .join(enter, update, exit)
        .transition().duration(500)
            .attr('transform', (_, i, n) => `translate(${10 * (i - (n.length - 1) / 2)} 0)`)
            .style('opacity', '1')  // Fix the "normal" value
```

You can also insert delays and define specific interpolation techniques. D3.js provides a number of builtin functions for common use case, including easing curves, color interpolation, etc.

## Useful utilities

### `call`

`selection.call(func, ...args)` applies `func` to the selection, and is useful when applying the same code to multiple selections. It return the selection (not the return value of `func`) for easy chaining. Additional arguments `...args` are passed as parameters to `func`.

```javascript
function populate(element) {
    element.append('rect')
        .attr('x', -4.5)
        .attr('y', -7)
        .attr('width', 9)
        .attr('height', 14)
        .classed('back', true)


    element.append('text')
        .attr('y', -1)
        .attr('text-anchor', 'middle')
        .text(d => d.suit)

    element.append('text')
        .attr('y', 6)
        .attr('text-anchor', 'middle')
        .text(d => d.height)
}

function enter(parent) {
    return parent.append('g')
        .call(populate)
        .attr('class', d => d.suit)
        .attr('transform', (_, i, n) => `translate(0 -80)`)
        .style('opacity', '0')
}
```

This is also useful for debugging: `.call(d => console.log(d))`.

### `each`

`selection.each(func)` calls `func` on each element of selection. Unlike `call`, it therefore has access to the datum for that element.

```javascript
function exit(delay) {
    return element => element
        .transition().delay(100 * delay).duration(200)
        .attr('transform', () => `translate(0 -50)`)
            .transition().delay(100 * (3 - delay)).duration(500)
                .style('opacity', 0)
                    .remove()
}

function updateHand(_, index) {
    d3.select(this)     // `this` points to the element
        .selectChildren('g')
        .data(d => d, d => d.index)
        .join(enter, update, exit(index))
            .transition().duration(500)
                .attr('transform', (_, i, n) => `translate(${10 * (i - (n.length - 1) / 2)} 0)`)
                .style('opacity', '1')
}

function updateGame(data) {
    svg
        .selectChildren('g')
        .data(data, (_, i) => i)
        .join('g')
            .attr('transform', (_, i) => `rotate(${90 * i}) translate(0 80)`)
            .each(updateHand)
}
```

### And much more…

- `.datum()` can be used to update the data attached to elements in a selection;
- `.merge()` can merge selections;
- `.on()` can attach event listeners to elements;
- A bunch of visualization utilities! These automatically provide:
  - Coordinate computations
  - Dynamic placement
  - Interpolations
  - Axis placements
  - Etc.

Have a look [here](https://observablehq.com/@d3/gallery) to see what D3.js has to provide.
