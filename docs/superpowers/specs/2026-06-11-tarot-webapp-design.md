# Tarot Web App Design

Date: 2026-06-11
Project: bulltarot
Status: Approved design for implementation planning

## 1. Goal and Scope

Build a web-based tarot card thrower in the existing React Router 7 app.

User journey in v1:

- User lands on homepage and taps Begin.
- User selects spread type.
- User selects reading focus.
- User goes through guided reveal one card at a time.
- App shows meaning for each revealed card.
- App shows final summary after all cards are revealed.

In scope:

- Spread selection: single card, past-present-future, Celtic Cross.
- Focus selection: general, love, career.
- Full 78-card deck.
- Upright and reversed card orientation.
- No duplicate cards within a single reading.
- Ephemeral sessions only (no persisted history).

Out of scope for v1:

- User accounts.
- Backend database storage.
- Admin content editor UI.
- Cross-device sync.

## 2. Architecture Decision

Selected approach: client-only implementation with local data files and modular session logic.

Rationale:

- Fastest path for v1.
- Matches ephemeral requirement.
- Low operational complexity and zero backend cost.
- Keeps upgrade path open for future persistence.

## 3. Route and UI Flow

Primary route flow:

1. Home route with Begin action.
2. Session setup view:
   - Choose spread type.
   - Choose focus (general, love, career).
3. Guided reveal view:
   - Show one spread position at a time.
   - Reveal card.
   - Show interpretation for selected focus and orientation.
   - Continue until all cards are revealed.
4. Final summary view:
   - Show all cards in spread order with position labels and meanings.
   - Offer restart action.

## 4. Component and Module Boundaries

Proposed component structure:

- App shell and route frame.
- Landing view with Begin button.
- Setup form view for spread and focus.
- Guided reveal view.
- Reusable card meaning panel.
- Results summary view.

Proposed logic module:

- Session controller hook or service responsible for:
  - Shuffle and draw operations.
  - No-duplicate enforcement.
  - Orientation assignment.
  - Interpretation resolution.
  - Reveal progression state.

Boundary rule:

- UI components must not perform random draw logic directly.
- Tarot rules and randomness stay centralized in session logic module.

## 5. Data Model

### 5.1 Card catalog

Card images:

- Source directory: public/cards
- Filename convention: {id}.webp
- Example: The Fool is 0.webp

Card catalog fields:

- id: number (0-77)
- name: string
- arcana: major | minor
- suit: cups | pentacles | swords | wands | null
- rank: ace..king | null

### 5.2 Interpretation schema

Each card must include:

- upright:
  - general: string
  - love: string
  - career: string
- reversed:
  - general: string
  - love: string
  - career: string

### 5.3 Spread templates

- single:
  - positions: ["Insight"]
- three_card:
  - positions: ["Past", "Present", "Future"]
- celtic_cross:
  - positions:
    - Present
    - Challenge
    - Distant Past
    - Recent Past
    - Possible Outcome
    - Near Future
    - Self
    - Environment
    - Hopes/Fears
    - Final Outcome

### 5.4 Runtime reading object (ephemeral)

- id: transient session id
- createdAt: timestamp
- spreadType: single | three_card | celtic_cross
- focus: general | love | career
- cards[]:
  - cardId
  - positionLabel
  - orientation: upright | reversed
  - resolvedMeaning (for selected focus)
- revealIndex: current guided reveal position
- isComplete: all cards revealed

## 6. Rules and Algorithms

Draw and reveal rules:

- Shuffle full deck with Fisher-Yates.
- Draw N cards without replacement, where N = spread position count.
- Assign random orientation (upright or reversed) to each drawn card.
- Resolve meaning using selected focus plus orientation.

Deterministic image mapping:

- imageUrl = /cards/{cardId}.webp

## 7. Error Handling and Guards

- Missing card image:
  - Render fallback placeholder card UI and card name.
  - Continue session (no crash).
- Missing interpretation content:
  - Block session start.
  - Show explicit "deck content incomplete" message.
- Deck insufficient for spread:
  - Guard exists although full deck size covers all defined spreads.
- Mid-session refresh:
  - Session resets (expected behavior for ephemeral v1).

## 8. Testing Strategy

Unit tests:

- Shuffle preserves all ids and uniqueness.
- Draw logic enforces no duplicates.
- Orientation assignment only returns upright or reversed.
- Meaning resolver returns exact orientation + focus entry.
- Spread templates expose correct position count and order.

Component tests:

- Setup form validation and transitions.
- Guided reveal progression and completion.
- Results summary renders all positions.
- Missing-image fallback rendering.

Integration tests (lightweight):

- One full reading flow per spread type:
  - single
  - three_card
  - celtic_cross

## 9. Non-Functional Notes

- Keep implementation client-only in v1.
- Keep session logic isolated from presentation code.
- Keep data schema explicit and validated at app startup where feasible.

## 10. Future Extensions (Not v1)

- Optional local history in browser storage.
- Server-backed reading history.
- Admin UI for card meaning/content management.
- Optional interpretation mode toggle to show all focuses.
- Optional deck filters and custom spreads.
