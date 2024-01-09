const HEIGHTS = ['2', '3', '4', '5', '6', '7', '8', '9', 'X', 'J', 'Q', 'K', 'A']
const SUITS = ['♣', '♦', '♥', '♠']

class Card {
    constructor(height, suit) {
        this.index = 13 * suit + height
        this.height = HEIGHTS[height]
        this.suit = SUITS[suit]
    }

    static compare(card1, card2) {
        return card1.index - card2.index
    }
}

const DECK = []
for (let suit = 0; suit < 4; suit++) {
    for (let height = 0; height < 13; height++) {
        DECK.push(new Card(height, suit))
    }
}

const SEPARATED_DECK = [
    DECK.slice(0, 13),
    DECK.slice(13, 26),
    DECK.slice(26, 39),
    DECK.slice(39, 52),
]

function generateShuffledDeck() {
    // Brutal shuffle
    return DECK
        .map(card => [Math.random(), card])
        .sort()
        .map(card => card[1])
}

function generateRandomHands() {
    const cards = generateShuffledDeck()

    return [
        cards.slice(0, 13).sort(Card.compare),
        cards.slice(13, 26).sort(Card.compare),
        cards.slice(26, 39).sort(Card.compare),
        cards.slice(39, 52).sort(Card.compare),
    ]
}

function toName(input) {
    if (Array.isArray(input)) {
        return input.map(e => toName(e))
    } else {
        return input.name
    }
}

function randInt(max) {
    return Math.floor(Math.random() * max)
}

function playRandomly() {
    const hands = generateRandomHands()

    const game = [
        [
            [...hands[0]],
            [...hands[1]],
            [...hands[2]],
            [...hands[3]],
        ]
    ]

    for (let i = 0; i < 13; i++) {
        const cardsLeft = 13 - i

        hands[0].splice(randInt(cardsLeft), 1)
        hands[1].splice(randInt(cardsLeft), 1)
        hands[2].splice(randInt(cardsLeft), 1)
        hands[3].splice(randInt(cardsLeft), 1)

        game.push([
            [...hands[0]],
            [...hands[1]],
            [...hands[2]],
            [...hands[3]],
        ])
    }

    return game
}
