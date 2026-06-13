'use client'

import { useEffect, useMemo, useState } from 'react'

type Suit = '♠' | '♥' | '♦' | '♣'
const SUITS: Suit[] = ['♠', '♥', '♦', '♣']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

interface Card {
  id: string
  suit: Suit
  rank: string
  rankValue: number
  red: boolean
  faceUp: boolean
}

interface GameState {
  stock: Card[]
  waste: Card[]
  foundations: Card[][] // 4 piles
  tableau: Card[][]     // 7 piles
}

function buildDeck(): Card[] {
  const deck: Card[] = []
  SUITS.forEach((suit) => {
    RANKS.forEach((rank, i) => {
      deck.push({
        id: `${rank}${suit}`,
        suit,
        rank,
        rankValue: i + 1,
        red: suit === '♥' || suit === '♦',
        faceUp: false,
      })
    })
  })
  return deck
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function dealGame(): GameState {
  const deck = shuffle(buildDeck())
  const tableau: Card[][] = Array.from({ length: 7 }, () => [])
  let idx = 0
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = deck[idx++]
      card.faceUp = row === col
      tableau[col].push(card)
    }
  }
  const stock = deck.slice(idx)
  stock.forEach((c) => { c.faceUp = false })
  return {
    stock,
    waste: [],
    foundations: [[], [], [], []],
    tableau,
  }
}

interface Source {
  pile: 'tableau' | 'waste' | 'foundation'
  pileIndex: number
  cardIndex: number
}

export default function SolitaireApp() {
  const [game, setGame] = useState<GameState>(() => dealGame())
  const [selected, setSelected] = useState<Source | null>(null)

  const won = useMemo(
    () => game.foundations.every((p) => p.length === 13),
    [game]
  )

  const newGame = () => {
    setGame(dealGame())
    setSelected(null)
  }

  const drawFromStock = () => {
    if (game.stock.length === 0) {
      const recycled = game.waste.slice().reverse().map((c) => ({ ...c, faceUp: false }))
      setGame({ ...game, stock: recycled, waste: [] })
      return
    }
    const next = { ...game }
    const card = next.stock[next.stock.length - 1]
    next.stock = next.stock.slice(0, -1)
    next.waste = [...next.waste, { ...card, faceUp: true }]
    setGame(next)
  }

  const moveCards = (from: Source, toPile: 'tableau' | 'foundation', toIndex: number) => {
    const next: GameState = {
      stock: game.stock.slice(),
      waste: game.waste.slice(),
      foundations: game.foundations.map((p) => p.slice()),
      tableau: game.tableau.map((p) => p.slice()),
    }
    let movingCards: Card[]
    if (from.pile === 'tableau') {
      movingCards = next.tableau[from.pileIndex].slice(from.cardIndex)
      next.tableau[from.pileIndex] = next.tableau[from.pileIndex].slice(0, from.cardIndex)
      const remaining = next.tableau[from.pileIndex]
      if (remaining.length > 0 && !remaining[remaining.length - 1].faceUp) {
        remaining[remaining.length - 1] = { ...remaining[remaining.length - 1], faceUp: true }
      }
    } else if (from.pile === 'waste') {
      movingCards = [next.waste[next.waste.length - 1]]
      next.waste = next.waste.slice(0, -1)
    } else {
      movingCards = [next.foundations[from.pileIndex][next.foundations[from.pileIndex].length - 1]]
      next.foundations[from.pileIndex] = next.foundations[from.pileIndex].slice(0, -1)
    }
    if (toPile === 'tableau') next.tableau[toIndex] = [...next.tableau[toIndex], ...movingCards]
    else next.foundations[toIndex] = [...next.foundations[toIndex], ...movingCards]
    setGame(next)
    setSelected(null)
  }

  const canDropOnTableau = (cards: Card[], pile: Card[]) => {
    if (cards.length === 0) return false
    const first = cards[0]
    if (pile.length === 0) return first.rank === 'K'
    const top = pile[pile.length - 1]
    return first.red !== top.red && first.rankValue === top.rankValue - 1
  }

  const canDropOnFoundation = (cards: Card[], pile: Card[]) => {
    if (cards.length !== 1) return false
    const card = cards[0]
    if (pile.length === 0) return card.rank === 'A'
    const top = pile[pile.length - 1]
    return card.suit === top.suit && card.rankValue === top.rankValue + 1
  }

  const handleClick = (src: Source, cards: Card[]) => {
    if (!selected) {
      if (cards.every((c) => c.faceUp)) setSelected(src)
      return
    }
    // Re-selecting same pile cancels
    if (selected.pile === src.pile && selected.pileIndex === src.pileIndex) {
      setSelected(null)
      return
    }
    const movingCards =
      selected.pile === 'tableau'
        ? game.tableau[selected.pileIndex].slice(selected.cardIndex)
        : selected.pile === 'waste'
        ? [game.waste[game.waste.length - 1]]
        : [game.foundations[selected.pileIndex][game.foundations[selected.pileIndex].length - 1]]
    if (src.pile === 'tableau' && canDropOnTableau(movingCards, game.tableau[src.pileIndex])) {
      moveCards(selected, 'tableau', src.pileIndex)
    } else if (src.pile === 'foundation' && canDropOnFoundation(movingCards, game.foundations[src.pileIndex])) {
      moveCards(selected, 'foundation', src.pileIndex)
    } else {
      setSelected(src)
    }
  }

  // Auto-route to foundations: double-click on a top card moves it if it can land
  const autoMove = (src: Source) => {
    const card =
      src.pile === 'waste'
        ? game.waste[game.waste.length - 1]
        : src.pile === 'tableau'
        ? game.tableau[src.pileIndex][game.tableau[src.pileIndex].length - 1]
        : null
    if (!card) return
    for (let i = 0; i < 4; i++) {
      if (canDropOnFoundation([card], game.foundations[i])) {
        moveCards({ ...src, cardIndex: src.pile === 'tableau' ? game.tableau[src.pileIndex].length - 1 : 0 }, 'foundation', i)
        return
      }
    }
  }

  useEffect(() => {
    if (won) setTimeout(() => alert('You won! 🎉'), 200)
  }, [won])

  return (
    <div
      style={{
        height: '100%',
        background: '#008000',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        fontFamily: 'var(--font-w95)',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', fontSize: 11 }}>
        <span>Klondike Solitaire</span>
        <button className="w95-btn" onClick={newGame}>New Deal</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, justifyItems: 'center' }}>
        <PileSlot onClick={drawFromStock}>
          {game.stock.length > 0 ? <CardBack count={game.stock.length} /> : <span style={{ color: '#fff', fontSize: 10 }}>↺</span>}
        </PileSlot>
        <PileSlot
          onClick={() => game.waste.length && handleClick({ pile: 'waste', pileIndex: 0, cardIndex: game.waste.length - 1 }, [game.waste[game.waste.length - 1]])}
          onDoubleClick={() => game.waste.length && autoMove({ pile: 'waste', pileIndex: 0, cardIndex: game.waste.length - 1 })}
          highlight={selected?.pile === 'waste'}
        >
          {game.waste.length > 0 ? <CardFace card={game.waste[game.waste.length - 1]} /> : null}
        </PileSlot>
        <div />
        {game.foundations.map((pile, i) => (
          <PileSlot
            key={i}
            onClick={() => handleClick({ pile: 'foundation', pileIndex: i, cardIndex: pile.length - 1 }, pile.length ? [pile[pile.length - 1]] : [])}
            highlight={selected?.pile === 'foundation' && selected.pileIndex === i}
          >
            {pile.length > 0 ? <CardFace card={pile[pile.length - 1]} /> : <span style={{ color: '#fff', fontSize: 11 }}>{SUITS[i]}</span>}
          </PileSlot>
        ))}
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, minHeight: 0 }}>
        {game.tableau.map((pile, ci) => (
          <div key={ci} style={{ position: 'relative', minHeight: 90 }}>
            {pile.length === 0 ? (
              <PileSlot
                onClick={() => selected && handleClick({ pile: 'tableau', pileIndex: ci, cardIndex: 0 }, [])}
              />
            ) : (
              pile.map((c, ri) => (
                <div
                  key={c.id}
                  onClick={() => handleClick({ pile: 'tableau', pileIndex: ci, cardIndex: ri }, pile.slice(ri))}
                  onDoubleClick={() => autoMove({ pile: 'tableau', pileIndex: ci, cardIndex: ri })}
                  style={{
                    position: 'absolute',
                    top: ri * 20,
                    left: 0,
                    right: 0,
                    cursor: c.faceUp ? 'pointer' : 'default',
                  }}
                >
                  {c.faceUp ? (
                    <CardFace
                      card={c}
                      highlight={
                        selected?.pile === 'tableau' &&
                        selected.pileIndex === ci &&
                        ri >= selected.cardIndex
                      }
                    />
                  ) : (
                    <CardBack />
                  )}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function PileSlot({
  children, onClick, onDoubleClick, highlight,
}: {
  children?: React.ReactNode
  onClick?: () => void
  onDoubleClick?: () => void
  highlight?: boolean
}) {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{
        width: '100%',
        aspectRatio: '0.7 / 1',
        maxWidth: 70,
        border: '1px dashed rgba(255,255,255,0.4)',
        borderRadius: 4,
        background: highlight ? 'rgba(255,255,0,0.18)' : 'rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </div>
  )
}

function CardFace({ card, highlight }: { card: Card; highlight?: boolean }) {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '0.7 / 1',
        maxWidth: 70,
        background: '#fff',
        border: `1px solid ${highlight ? '#ffd900' : '#222'}`,
        borderRadius: 4,
        boxShadow: highlight ? '0 0 0 2px #ffd900' : '0 1px 2px rgba(0,0,0,0.4)',
        color: card.red ? '#c00' : '#000',
        padding: '3px 4px',
        position: 'relative',
        fontFamily: '"Times New Roman", serif',
        fontSize: 12,
        lineHeight: 1,
      }}
    >
      <div>{card.rank}</div>
      <div>{card.suit}</div>
      <div style={{ position: 'absolute', bottom: 3, right: 4, transform: 'rotate(180deg)' }}>
        <div>{card.rank}</div>
        <div>{card.suit}</div>
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 22 }}>
        {card.suit}
      </div>
    </div>
  )
}

function CardBack({ count }: { count?: number }) {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '0.7 / 1',
        maxWidth: 70,
        background:
          'repeating-linear-gradient(45deg, #0066cc 0 5px, #003a85 5px 10px)',
        border: '1px solid #001f4d',
        borderRadius: 4,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
      }}
    >
      {count ? `× ${count}` : ''}
    </div>
  )
}
