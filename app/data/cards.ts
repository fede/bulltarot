import type {
  TarotCardContent,
  TarotRank,
  TarotSuit,
} from "~/lib/tarot/content";

const MAJOR_ARCANA = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "Judgement",
  "The World",
] as const;

const WANDS = [
  "Ace of Wands",
  "Two of Wands",
  "Three of Wands",
  "Four of Wands",
  "Five of Wands",
  "Six of Wands",
  "Seven of Wands",
  "Eight of Wands",
  "Nine of Wands",
  "Ten of Wands",
  "Page of Wands",
  "Knight of Wands",
  "Queen of Wands",
  "King of Wands",
] as const;

const CUPS = [
  "Ace of Cups",
  "Two of Cups",
  "Three of Cups",
  "Four of Cups",
  "Five of Cups",
  "Six of Cups",
  "Seven of Cups",
  "Eight of Cups",
  "Nine of Cups",
  "Ten of Cups",
  "Page of Cups",
  "Knight of Cups",
  "Queen of Cups",
  "King of Cups",
] as const;

const SWORDS = [
  "Ace of Swords",
  "Two of Swords",
  "Three of Swords",
  "Four of Swords",
  "Five of Swords",
  "Six of Swords",
  "Seven of Swords",
  "Eight of Swords",
  "Nine of Swords",
  "Ten of Swords",
  "Page of Swords",
  "Knight of Swords",
  "Queen of Swords",
  "King of Swords",
] as const;

const PENTACLES = [
  "Ace of Pentacles",
  "Two of Pentacles",
  "Three of Pentacles",
  "Four of Pentacles",
  "Five of Pentacles",
  "Six of Pentacles",
  "Seven of Pentacles",
  "Eight of Pentacles",
  "Nine of Pentacles",
  "Ten of Pentacles",
  "Page of Pentacles",
  "Knight of Pentacles",
  "Queen of Pentacles",
  "King of Pentacles",
] as const;

const TAROT_NAMES: readonly string[] = [
  ...MAJOR_ARCANA,
  ...WANDS,
  ...CUPS,
  ...SWORDS,
  ...PENTACLES,
];

type MinorSuit = "Wands" | "Cups" | "Swords" | "Pentacles";
type MinorRank =
  | "Ace"
  | "Two"
  | "Three"
  | "Four"
  | "Five"
  | "Six"
  | "Seven"
  | "Eight"
  | "Nine"
  | "Ten"
  | "Page"
  | "Knight"
  | "Queen"
  | "King";

type MinorCardName = `${MinorRank} of ${MinorSuit}`;
type InterpretationSet = TarotCardContent["interpretations"];

const MAJOR_MEANINGS: Readonly<
  Record<(typeof MAJOR_ARCANA)[number], InterpretationSet>
> = {
  "The Fool": {
    upright: {
      general:
        "The Fool: step snout-first into a new chapter, curious and brave before every detail is known.",
      love: "The Fool: romance feels fresh, playful, and ready for a goofy little leap of trust.",
      career:
        "The Fool: say yes to the new path, then learn quickly as your paws hit the ground.",
    },
    reversed: {
      general:
        "The Fool reversed: pause before chasing the shiny thing; timing and consequences matter.",
      love: "The Fool reversed: mixed signals ask for caution before bounding into big promises.",
      career:
        "The Fool reversed: avoid underprepared risks; pack the essentials before the adventure.",
    },
  },
  "The Magician": {
    upright: {
      general:
        "The Magician: intention, skill, and timing align like a clever terrier with the perfect trick.",
      love: "The Magician: clear communication and initiative spark a charming, meaningful connection.",
      career:
        "The Magician: you have the tools; focused execution turns the idea into a treat-worthy result.",
    },
    reversed: {
      general:
        "The Magician reversed: scattered focus or showy tricks weaken your results.",
      love: "The Magician reversed: charm without sincerity creates confusion in intimacy.",
      career:
        "The Magician reversed: tighten priorities and avoid promising more tricks than you can perform.",
    },
  },
  "The High Priestess": {
    upright: {
      general:
        "The High Priestess: trust the quiet nose-twitch of intuition; subtle cues reveal what logic misses.",
      love: "The High Priestess: emotional depth grows through listening, patience, and trust.",
      career:
        "The High Priestess: observe before acting; the scent trail has hidden context.",
    },
    reversed: {
      general:
        "The High Priestess reversed: ignoring intuition leaves you chasing the wrong stick.",
      love: "The High Priestess reversed: secrets or silence can cloud emotional clarity.",
      career:
        "The High Priestess reversed: verify assumptions before deciding behind the scenes.",
    },
  },
  "The Empress": {
    upright: {
      general:
        "The Empress: growth, comfort, and creative abundance are ready for warm, blanket-soft care.",
      love: "The Empress: affection deepens through care, warmth, and shared pleasure.",
      career:
        "The Empress: nurture ideas steadily and they will mature into something worth wagging about.",
    },
    reversed: {
      general:
        "The Empress reversed: over-giving leaves the bowl empty; nourish yourself first.",
      love: "The Empress reversed: unmet needs call for softer honesty and reciprocity.",
      career:
        "The Empress reversed: restore sustainability before expanding commitments.",
    },
  },
  "The Emperor": {
    upright: {
      general:
        "The Emperor: structure, boundaries, and a sturdy fence create safety for long-term progress.",
      love: "The Emperor: commitment strengthens through reliability and clear expectations.",
      career:
        "The Emperor: leadership and discipline keep the pack moving in one direction.",
    },
    reversed: {
      general:
        "The Emperor reversed: rigidity or leash-tugging control can block necessary adaptation.",
      love: "The Emperor reversed: power struggles ease when vulnerability is allowed.",
      career:
        "The Emperor reversed: review authority dynamics and loosen bottlenecks before they bite.",
    },
  },
  "The Hierophant": {
    upright: {
      general:
        "The Hierophant: tradition, mentorship, and shared values offer trusted obedience-school wisdom.",
      love: "The Hierophant: aligned beliefs support commitment and meaningful rituals.",
      career:
        "The Hierophant: learn from proven systems or a mentor who knows the trail.",
    },
    reversed: {
      general:
        "The Hierophant reversed: challenge outdated rules and define your own path around the yard.",
      love: "The Hierophant reversed: relationships improve when expectations become explicit.",
      career:
        "The Hierophant reversed: innovation may require stepping outside the standard playbook.",
    },
  },
  "The Lovers": {
    upright: {
      general:
        "The Lovers: alignment comes from values-based choice and choosing your true pack.",
      love: "The Lovers: intimacy deepens through honest desire, mutual respect, and tail-wagging sincerity.",
      career:
        "The Lovers: choose the path that matches both purpose and integrity.",
    },
    reversed: {
      general:
        "The Lovers reversed: inner conflict appears when choices split your values.",
      love: "The Lovers reversed: disconnection heals through direct, compassionate conversation.",
      career:
        "The Lovers reversed: indecision fades once you clarify your non-negotiables.",
    },
  },
  "The Chariot": {
    upright: {
      general:
        "The Chariot: disciplined will turns wild zoomies into a focused dash toward victory.",
      love: "The Chariot: shared direction keeps passion from pulling the leash in opposite ways.",
      career:
        "The Chariot: determined focus and stamina carry this project forward.",
    },
    reversed: {
      general:
        "The Chariot reversed: scattered ambition leads to stalls, skids, and overcorrection.",
      love: "The Chariot reversed: emotional tug-of-war needs coordinated effort.",
      career:
        "The Chariot reversed: regain control by narrowing scope and priorities.",
    },
  },
  Strength: {
    upright: {
      general:
        "Strength: gentle courage and self-mastery calm the inner terrier without force.",
      love: "Strength: tenderness and patience create secure emotional trust.",
      career:
        "Strength: steady confidence outperforms pressure, barking, and ego battles.",
    },
    reversed: {
      general:
        "Strength reversed: self-doubt grows loud; return to grounded inner support.",
      love: "Strength reversed: defensiveness softens when vulnerability feels safe.",
      career:
        "Strength reversed: burnout risk is high; pace yourself for consistency.",
    },
  },
  "The Hermit": {
    upright: {
      general:
        "The Hermit: solitude and reflection illuminate the next wise step from your quiet corner.",
      love: "The Hermit: clarity in love begins with honest self-understanding.",
      career:
        "The Hermit: strategic pause and research sharpen your direction.",
    },
    reversed: {
      general:
        "The Hermit reversed: hiding in the kennel becomes avoidance if left unchecked.",
      love: "The Hermit reversed: emotional distance closes through intentional outreach.",
      career:
        "The Hermit reversed: overthinking delays action; set a decision deadline.",
    },
  },
  "Wheel of Fortune": {
    upright: {
      general:
        "Wheel of Fortune: cycles turn; chase the ball when opportunity rolls your way.",
      love: "Wheel of Fortune: timing shifts can renew connection unexpectedly.",
      career:
        "Wheel of Fortune: adapt fast; external changes can work in your favor.",
    },
    reversed: {
      general:
        "Wheel of Fortune reversed: resistance to change keeps you circling the same yard.",
      love: "Wheel of Fortune reversed: recurring patterns need conscious interruption.",
      career:
        "Wheel of Fortune reversed: prepare contingencies instead of forcing outcomes.",
    },
  },
  Justice: {
    upright: {
      general:
        "Justice: truth, accountability, and fair treat-counting restore equilibrium.",
      love: "Justice: fairness and transparency are essential for trust.",
      career:
        "Justice: decisions should be evidence-based and ethically sound.",
    },
    reversed: {
      general:
        "Justice reversed: bias or avoidance distorts what is actually fair.",
      love: "Justice reversed: unresolved resentment asks for honest repair.",
      career:
        "Justice reversed: unclear standards create conflict; define them now.",
    },
  },
  "The Hanged Man": {
    upright: {
      general:
        "The Hanged Man: roll over, surrender the old angle, and let insight arrive.",
      love: "The Hanged Man: patience in uncertainty can deepen emotional understanding.",
      career: "The Hanged Man: pause execution to reframe the problem.",
    },
    reversed: {
      general:
        "The Hanged Man reversed: stalling without purpose drains your energy.",
      love: "The Hanged Man reversed: indecision keeps the relationship in limbo.",
      career:
        "The Hanged Man reversed: move from analysis to one concrete action.",
    },
  },
  Death: {
    upright: {
      general:
        "Death: shed the old collar so transformation and authentic renewal can begin.",
      love: "Death: release old relationship patterns so intimacy can evolve.",
      career: "Death: retire what no longer works to enable stronger growth.",
    },
    reversed: {
      general:
        "Death reversed: clinging to the chewed-up past delays necessary change.",
      love: "Death reversed: fear of letting go can freeze emotional progress.",
      career:
        "Death reversed: transition is overdue; stop patching obsolete systems.",
    },
  },
  Temperance: {
    upright: {
      general:
        "Temperance: moderation and integration keep the water bowl steady between extremes.",
      love: "Temperance: emotional balance supports steady, mature affection.",
      career:
        "Temperance: combine skills thoughtfully for sustainable results.",
    },
    reversed: {
      general:
        "Temperance reversed: impatience splashes the bowl; restore rhythm before moving on.",
      love: "Temperance reversed: mixed signals resolve with calmer pacing.",
      career:
        "Temperance reversed: re-balance workload and expectations before scaling.",
    },
  },
  "The Devil": {
    upright: {
      general:
        "The Devil: notice the treat bag you cannot stop guarding and the habits keeping you bound.",
      love: "The Devil: intense chemistry needs clear boundaries to stay healthy.",
      career: "The Devil: ambition can become overwork if unchecked.",
    },
    reversed: {
      general:
        "The Devil reversed: awareness drops the chew toy and restores your agency.",
      love: "The Devil reversed: releasing control patterns opens cleaner intimacy.",
      career:
        "The Devil reversed: step out of toxic loops and renegotiate terms.",
    },
  },
  "The Tower": {
    upright: {
      general:
        "The Tower: a sudden shake-up barrels through, dismantling what cannot stand.",
      love: "The Tower: truth arrives abruptly and demands authentic rebuilding.",
      career:
        "The Tower: disruptive change clears weak foundations in your plans.",
    },
    reversed: {
      general:
        "The Tower reversed: delayed upheaval still asks for honest restructuring.",
      love: "The Tower reversed: resisting necessary conversations increases strain.",
      career:
        "The Tower reversed: proactive fixes reduce the impact of larger failures.",
    },
  },
  "The Star": {
    upright: {
      general:
        "The Star: hope, healing, and the first real tail-wag after hardship return.",
      love: "The Star: openness and emotional honesty invite gentle renewal.",
      career: "The Star: long-range vision becomes believable again.",
    },
    reversed: {
      general:
        "The Star reversed: discouragement eases when you reconnect to purpose.",
      love: "The Star reversed: guardedness softens through small acts of sincerity.",
      career: "The Star reversed: restore morale with realistic milestones.",
    },
  },
  "The Moon": {
    upright: {
      general:
        "The Moon: shadows, dreams, and instinct ask for careful navigation in the dark yard.",
      love: "The Moon: deep feelings rise, but clarity may lag behind emotion.",
      career:
        "The Moon: incomplete information requires intuition plus verification.",
    },
    reversed: {
      general:
        "The Moon reversed: confusion lifts as facts replace fear stories.",
      love: "The Moon reversed: honesty dispels suspicion and emotional fog.",
      career:
        "The Moon reversed: hidden details emerge; revise decisions accordingly.",
    },
  },
  "The Sun": {
    upright: {
      general:
        "The Sun: belly-up joy, vitality, and clarity illuminate the path ahead.",
      love: "The Sun: warmth and joy make connection feel uncomplicated.",
      career:
        "The Sun: visibility and success increase through authentic leadership.",
    },
    reversed: {
      general:
        "The Sun reversed: temporary doubt passes once perspective widens.",
      love: "The Sun reversed: pride can hide needs; speak plainly.",
      career:
        "The Sun reversed: progress is real, even if recognition is delayed.",
    },
  },
  Judgement: {
    upright: {
      general:
        "Judgement: answer the whistle; awakening and accountability call you higher.",
      love: "Judgement: forgiveness and honesty can reset the relationship.",
      career: "Judgement: answer the vocation that aligns with your values.",
    },
    reversed: {
      general:
        "Judgement reversed: self-criticism or denial blocks necessary growth.",
      love: "Judgement reversed: past issues repeat until they are truly addressed.",
      career:
        "Judgement reversed: stop postponing the decision you already know.",
    },
  },
  "The World": {
    upright: {
      general:
        "The World: completion, integration, and a joyful victory lap around the yard are within reach.",
      love: "The World: relationship cycles mature into deeper mutual fulfillment.",
      career: "The World: finish strong, then step into the next level.",
    },
    reversed: {
      general:
        "The World reversed: loose ends and unfinished lessons need closure.",
      love: "The World reversed: commitment clarifies when old chapters are completed.",
      career:
        "The World reversed: avoid drifting; define what done looks like.",
    },
  },
} as const;

const MINOR_MEANINGS: Readonly<Record<MinorCardName, InterpretationSet>> = {
  "Ace of Wands": {
    upright: {
      general:
        "Ace of Wands: a fresh spark leaps up like sudden terrier zoomies; follow the creative heat.",
      love: "Ace of Wands: attraction flares brightly, playful and bold enough to make the tail wag first.",
      career:
        "Ace of Wands: a promising idea needs action before the excitement chews through the furniture.",
    },
    reversed: {
      general:
        "Ace of Wands reversed: the spark is real, but it needs direction before you bolt.",
      love: "Ace of Wands reversed: passion may flicker if desire is not matched with intention.",
      career:
        "Ace of Wands reversed: refine the idea, then give it room to run.",
    },
  },
  "Two of Wands": {
    upright: {
      general:
        "Two of Wands: stand at the gate, map the route, and choose where your brave paws go next.",
      love: "Two of Wands: love asks whether both hearts are planning the same walk.",
      career:
        "Two of Wands: vision, strategy, and a wider horizon help the next move land well.",
    },
    reversed: {
      general:
        "Two of Wands reversed: hesitation keeps you staring through the fence instead of choosing a path.",
      love: "Two of Wands reversed: mismatched plans need direct conversation before resentment starts barking.",
      career:
        "Two of Wands reversed: fear of expansion may be disguising itself as caution.",
    },
  },
  "Three of Wands": {
    upright: {
      general:
        "Three of Wands: your plan has left the yard; watch for results and wider possibilities.",
      love: "Three of Wands: connection grows when you both imagine a bigger shared future.",
      career:
        "Three of Wands: early momentum supports expansion, partnerships, or a broader market.",
    },
    reversed: {
      general:
        "Three of Wands reversed: delays may mean the route needs a better scent trail.",
      love: "Three of Wands reversed: distance or uncertainty asks for clearer expectations.",
      career:
        "Three of Wands reversed: growth stalls when logistics, timing, or trust are underbuilt.",
    },
  },
  "Four of Wands": {
    upright: {
      general:
        "Four of Wands: celebrate the safe yard, the open door, and the pack that cheers you on.",
      love: "Four of Wands: commitment, home, and shared joy make love feel wonderfully settled.",
      career:
        "Four of Wands: a milestone deserves recognition before you race toward the next one.",
    },
    reversed: {
      general:
        "Four of Wands reversed: the party feels uneven; rebuild belonging before chasing applause.",
      love: "Four of Wands reversed: home or commitment tension needs honest, gentle repair.",
      career:
        "Four of Wands reversed: celebrate progress, but address cracks in team morale.",
    },
  },
  "Five of Wands": {
    upright: {
      general:
        "Five of Wands: playful tussles can become chaos; know when the dog-park wrestling is too much.",
      love: "Five of Wands: conflict can clarify needs when both hearts stop competing to be heard.",
      career:
        "Five of Wands: rivalry, debate, or creative friction tests your stamina and focus.",
    },
    reversed: {
      general:
        "Five of Wands reversed: de-escalation restores fun once everyone drops the tug toy.",
      love: "Five of Wands reversed: repair begins when defensiveness softens into accountability.",
      career:
        "Five of Wands reversed: choose coordination over noisy competition.",
    },
  },
  "Six of Wands": {
    upright: {
      general:
        "Six of Wands: victory arrives with a proud trot and a well-earned round of applause.",
      love: "Six of Wands: appreciation and public support help the relationship feel valued.",
      career:
        "Six of Wands: recognition, promotion, or visible success rewards your courage.",
    },
    reversed: {
      general:
        "Six of Wands reversed: needing praise too badly can steal the joy of progress.",
      love: "Six of Wands reversed: validation matters, but love cannot be a constant trick-for-treat exchange.",
      career:
        "Six of Wands reversed: delayed recognition asks for confidence without applause.",
    },
  },
  "Seven of Wands": {
    upright: {
      general:
        "Seven of Wands: hold your ground like a sturdy bull terrier guarding the gate.",
      love: "Seven of Wands: protect the bond without turning every concern into a standoff.",
      career:
        "Seven of Wands: defend your position, standards, and hard-earned territory.",
    },
    reversed: {
      general:
        "Seven of Wands reversed: constant guarding is exhausting; choose which battles deserve teeth.",
      love: "Seven of Wands reversed: defensiveness may be blocking the closeness you want.",
      career:
        "Seven of Wands reversed: pressure feels intense, so refocus on what truly matters.",
    },
  },
  "Eight of Wands": {
    upright: {
      general:
        "Eight of Wands: movement arrives fast, like zoomies down the hallway; stay ready.",
      love: "Eight of Wands: messages, momentum, or sudden attraction move the story forward quickly.",
      career:
        "Eight of Wands: swift updates and rapid execution favor decisive action.",
    },
    reversed: {
      general:
        "Eight of Wands reversed: delays, crossed signals, or scattered speed need a calmer route.",
      love: "Eight of Wands reversed: rushing the conversation may tangle the leash.",
      career:
        "Eight of Wands reversed: remove bottlenecks before pushing for speed.",
    },
  },
  "Nine of Wands": {
    upright: {
      general:
        "Nine of Wands: tired but determined, you are still standing guard with terrier grit.",
      love: "Nine of Wands: past hurts make caution understandable, but keep the heart reachable.",
      career:
        "Nine of Wands: perseverance protects your progress through the final hard stretch.",
    },
    reversed: {
      general:
        "Nine of Wands reversed: exhaustion can turn vigilance into suspicion; rest before reacting.",
      love: "Nine of Wands reversed: old defenses may be snapping at new kindness.",
      career:
        "Nine of Wands reversed: burnout needs recovery, not another lap around the yard.",
    },
  },
  "Ten of Wands": {
    upright: {
      general:
        "Ten of Wands: you are carrying every stick in the park; lighten the load.",
      love: "Ten of Wands: love feels heavy when responsibility is not shared honestly.",
      career:
        "Ten of Wands: success brings obligations, but overwork is not a badge of honor.",
    },
    reversed: {
      general:
        "Ten of Wands reversed: drop the extra sticks and keep only what is truly yours.",
      love: "Ten of Wands reversed: relief comes when burdens, chores, or emotional labor are redistributed.",
      career:
        "Ten of Wands reversed: delegate, simplify, and stop proving loyalty through exhaustion.",
    },
  },
  "Page of Wands": {
    upright: {
      general:
        "Page of Wands: curiosity bounds in with muddy paws and a bright creative message.",
      love: "Page of Wands: flirtation, playfulness, and honest excitement invite a fresh spark.",
      career:
        "Page of Wands: experiment boldly; early learning matters more than perfect form.",
    },
    reversed: {
      general:
        "Page of Wands reversed: excitement scatters when every shiny idea gets chased at once.",
      love: "Page of Wands reversed: inconsistency may make playful interest feel unreliable.",
      career:
        "Page of Wands reversed: ground inspiration with a simple plan and follow-through.",
    },
  },
  "Knight of Wands": {
    upright: {
      general:
        "Knight of Wands: bold, restless energy charges forward like a terrier spotting an open gate.",
      love: "Knight of Wands: passion is strong, direct, and exciting, but it still needs listening.",
      career:
        "Knight of Wands: take courageous action while keeping enough control to steer.",
    },
    reversed: {
      general:
        "Knight of Wands reversed: impulsive charging can knock over what you meant to build.",
      love: "Knight of Wands reversed: intensity without consistency may leave someone dizzy.",
      career:
        "Knight of Wands reversed: slow the sprint before speed becomes self-sabotage.",
    },
  },
  "Queen of Wands": {
    upright: {
      general:
        "Queen of Wands: confidence, warmth, and magnetic mischief make your presence impossible to ignore.",
      love: "Queen of Wands: attraction grows through self-assurance, generosity, and playful honesty.",
      career:
        "Queen of Wands: lead visibly; your creative charisma rallies the room.",
    },
    reversed: {
      general:
        "Queen of Wands reversed: insecurity may hide behind drama, jealousy, or extra-loud barking.",
      love: "Queen of Wands reversed: confidence returns when comparison stops stealing affection.",
      career:
        "Queen of Wands reversed: reclaim your voice without turning leadership into performance.",
    },
  },
  "King of Wands": {
    upright: {
      general:
        "King of Wands: visionary fire leads the pack with courage, charisma, and a wag-worthy plan.",
      love: "King of Wands: love benefits from bold devotion and shared future-building.",
      career:
        "King of Wands: entrepreneurial leadership turns ambition into movement others can follow.",
    },
    reversed: {
      general:
        "King of Wands reversed: impatience or pride can make leadership feel like leash-yanking.",
      love: "King of Wands reversed: dominance softens when warmth and respect return.",
      career:
        "King of Wands reversed: temper the big vision with humility, patience, and collaboration.",
    },
  },
  "Ace of Cups": {
    upright: {
      general:
        "Ace of Cups: the heart bowl refills with tenderness, intuition, and a fresh emotional beginning.",
      love: "Ace of Cups: affection opens sweetly, offering vulnerability, care, and a happy little tail wag.",
      career:
        "Ace of Cups: meaningful work, trust, or creative feeling begins to flow.",
    },
    reversed: {
      general:
        "Ace of Cups reversed: feelings are present, but the bowl may need gentle refilling first.",
      love: "Ace of Cups reversed: guardedness or emotional depletion asks for patience and self-care.",
      career:
        "Ace of Cups reversed: reconnect with purpose before pouring energy into others.",
    },
  },
  "Two of Cups": {
    upright: {
      general:
        "Two of Cups: mutual trust meets nose-to-nose, creating a balanced emotional bond.",
      love: "Two of Cups: affection is reciprocal, sincere, and ready to become a true pack of two.",
      career:
        "Two of Cups: partnership, agreement, or client trust strengthens the work.",
    },
    reversed: {
      general:
        "Two of Cups reversed: imbalance needs repair before closeness feels safe again.",
      love: "Two of Cups reversed: misalignment eases when both hearts say what they truly need.",
      career:
        "Two of Cups reversed: clarify expectations before a collaboration goes off-leash.",
    },
  },
  "Three of Cups": {
    upright: {
      general:
        "Three of Cups: friendship, celebration, and pack joy bring emotional nourishment.",
      love: "Three of Cups: love feels supported by laughter, community, and shared delight.",
      career:
        "Three of Cups: teamwork and morale improve when wins are celebrated together.",
    },
    reversed: {
      general:
        "Three of Cups reversed: social noise or pack politics may be draining the joy.",
      love: "Three of Cups reversed: outside influence or blurred boundaries needs attention.",
      career:
        "Three of Cups reversed: gossip, cliques, or poor coordination can weaken trust.",
    },
  },
  "Four of Cups": {
    upright: {
      general:
        "Four of Cups: emotional boredom or withdrawal may hide a gift sitting right under your snout.",
      love: "Four of Cups: disconnection improves when you look up from disappointment and notice what is offered.",
      career:
        "Four of Cups: apathy signals the need to reassess, not ignore new possibilities.",
    },
    reversed: {
      general:
        "Four of Cups reversed: interest returns as you stop sulking by the bowl and rejoin life.",
      love: "Four of Cups reversed: renewed openness can restart affection after emotional distance.",
      career:
        "Four of Cups reversed: fresh motivation appears when you engage with available opportunities.",
    },
  },
  "Five of Cups": {
    upright: {
      general:
        "Five of Cups: grief focuses on the spilled water, but not every bowl is empty.",
      love: "Five of Cups: disappointment needs compassion before the heart can notice remaining love.",
      career:
        "Five of Cups: a setback hurts, yet useful support or opportunity remains nearby.",
    },
    reversed: {
      general:
        "Five of Cups reversed: healing begins as regret loosens its grip.",
      love: "Five of Cups reversed: forgiveness, acceptance, or closure helps the heart lift its head.",
      career:
        "Five of Cups reversed: lessons from loss can guide a wiser next step.",
    },
  },
  "Six of Cups": {
    upright: {
      general:
        "Six of Cups: nostalgia, innocence, and old joys return like a favorite squeaky toy.",
      love: "Six of Cups: warmth may come through memory, reconciliation, or gentle sweetness.",
      career:
        "Six of Cups: past experience, mentors, or familiar skills support present progress.",
    },
    reversed: {
      general:
        "Six of Cups reversed: do not let old stories keep you curled in yesterday's basket.",
      love: "Six of Cups reversed: nostalgia should comfort, not trap the relationship in the past.",
      career:
        "Six of Cups reversed: honor past lessons while adapting to current needs.",
    },
  },
  "Seven of Cups": {
    upright: {
      general:
        "Seven of Cups: many shiny toys appear at once; choose fantasy from true desire.",
      love: "Seven of Cups: romantic options or ideals may cloud what is emotionally real.",
      career:
        "Seven of Cups: possibilities are plentiful, but clarity must lead selection.",
    },
    reversed: {
      general:
        "Seven of Cups reversed: the fog clears when you stop chasing every squeak.",
      love: "Seven of Cups reversed: grounded choice matters more than perfect fantasy.",
      career:
        "Seven of Cups reversed: prioritize one viable option and commit to action.",
    },
  },
  "Eight of Cups": {
    upright: {
      general:
        "Eight of Cups: walk away from the empty bowl to seek deeper nourishment.",
      love: "Eight of Cups: leaving or emotionally detaching may be necessary for honest growth.",
      career:
        "Eight of Cups: a role may no longer feed your purpose, even if it once did.",
    },
    reversed: {
      general:
        "Eight of Cups reversed: fear of leaving can keep you pacing the same worn path.",
      love: "Eight of Cups reversed: staying or going requires truth, not avoidance.",
      career:
        "Eight of Cups reversed: indecision fades when you name what fulfillment actually means.",
    },
  },
  "Nine of Cups": {
    upright: {
      general:
        "Nine of Cups: satisfaction arrives like a full treat jar and a very pleased grin.",
      love: "Nine of Cups: emotional contentment grows when desire is enjoyed without guilt.",
      career:
        "Nine of Cups: a goal brings personal pride, comfort, and well-earned reward.",
    },
    reversed: {
      general:
        "Nine of Cups reversed: getting the treat may not satisfy the deeper hunger.",
      love: "Nine of Cups reversed: pleasure without emotional honesty can feel hollow.",
      career:
        "Nine of Cups reversed: success needs meaning, not just applause or comfort.",
    },
  },
  "Ten of Cups": {
    upright: {
      general:
        "Ten of Cups: lasting joy gathers the whole pack under a bright, loving sky.",
      love: "Ten of Cups: shared happiness, belonging, and emotional safety support long-term love.",
      career:
        "Ten of Cups: values-aligned success benefits the people who matter most.",
    },
    reversed: {
      general:
        "Ten of Cups reversed: the picture-perfect pack may need more honest emotional care.",
      love: "Ten of Cups reversed: family or relationship ideals should not silence real needs.",
      career:
        "Ten of Cups reversed: external success matters less if it disrupts your inner life.",
    },
  },
  "Page of Cups": {
    upright: {
      general:
        "Page of Cups: a tender surprise peeks out like a puppy with a love note.",
      love: "Page of Cups: sweet messages, apologies, or shy feelings invite openness.",
      career:
        "Page of Cups: creativity and intuition grow through playful experimentation.",
    },
    reversed: {
      general:
        "Page of Cups reversed: sensitivity may become moodiness when feelings are not named.",
      love: "Page of Cups reversed: emotional immaturity needs patience, honesty, and steadier signals.",
      career:
        "Page of Cups reversed: creative ideas need structure before they splash everywhere.",
    },
  },
  "Knight of Cups": {
    upright: {
      general:
        "Knight of Cups: the heart trots forward with romance, imagination, and sincere charm.",
      love: "Knight of Cups: affection is expressive, idealistic, and ready to make a heartfelt offer.",
      career:
        "Knight of Cups: follow creative purpose while keeping promises grounded.",
    },
    reversed: {
      general:
        "Knight of Cups reversed: pretty feelings may wander off-leash without follow-through.",
      love: "Knight of Cups reversed: idealizing someone can blur their real needs and limits.",
      career:
        "Knight of Cups reversed: inspiration needs practical steps to avoid drifting.",
    },
  },
  "Queen of Cups": {
    upright: {
      general:
        "Queen of Cups: deep empathy, intuition, and quiet care create a safe emotional lap.",
      love: "Queen of Cups: compassion and emotional attunement help love feel deeply held.",
      career:
        "Queen of Cups: people-centered leadership and intuition guide wise decisions.",
    },
    reversed: {
      general:
        "Queen of Cups reversed: absorbing everyone else's feelings can leave your own bowl dry.",
      love: "Queen of Cups reversed: care needs boundaries so devotion does not become self-loss.",
      career:
        "Queen of Cups reversed: protect emotional bandwidth while supporting others.",
    },
  },
  "King of Cups": {
    upright: {
      general:
        "King of Cups: calm emotional mastery steadies the pack even when the room gets loud.",
      love: "King of Cups: mature affection offers steadiness, compassion, and honest emotional leadership.",
      career:
        "King of Cups: diplomacy and self-control help you lead through complexity.",
    },
    reversed: {
      general:
        "King of Cups reversed: bottled feelings can leak out as moodiness or quiet control.",
      love: "King of Cups reversed: emotional distance softens when vulnerability becomes safe.",
      career:
        "King of Cups reversed: do not manage pressure by hiding what needs to be addressed.",
    },
  },
  "Ace of Swords": {
    upright: {
      general:
        "Ace of Swords: truth cuts through confusion with the precision of a terrier finding the squeak.",
      love: "Ace of Swords: honest conversation clears the air and reveals what is real.",
      career:
        "Ace of Swords: a breakthrough idea or clear decision sharpens the next move.",
    },
    reversed: {
      general:
        "Ace of Swords reversed: confusion, half-truths, or mental fog dull the blade.",
      love: "Ace of Swords reversed: unclear words can turn simple issues into tangled leashes.",
      career:
        "Ace of Swords reversed: wait for better facts before making the decisive cut.",
    },
  },
  "Two of Swords": {
    upright: {
      general:
        "Two of Swords: a blocked choice asks for stillness before you pick a path.",
      love: "Two of Swords: emotional stalemate eases when both sides stop pretending not to know.",
      career:
        "Two of Swords: weigh evidence carefully, then remove the blindfold.",
    },
    reversed: {
      general:
        "Two of Swords reversed: avoidance is becoming louder than the decision itself.",
      love: "Two of Swords reversed: indecision may be keeping honest repair out in the cold.",
      career:
        "Two of Swords reversed: too much analysis can freeze useful action.",
    },
  },
  "Three of Swords": {
    upright: {
      general:
        "Three of Swords: a painful truth pierces the heart; be gentle while it heals.",
      love: "Three of Swords: heartbreak, disappointment, or hard words need compassion and space.",
      career:
        "Three of Swords: difficult feedback or loss reveals what must change.",
    },
    reversed: {
      general:
        "Three of Swords reversed: recovery begins as pain is named instead of hidden under the rug.",
      love: "Three of Swords reversed: forgiveness is possible, but the wound needs real care.",
      career:
        "Three of Swords reversed: lessons from a setback help you rebuild wiser.",
    },
  },
  "Four of Swords": {
    upright: {
      general:
        "Four of Swords: curl up, rest your busy head, and let recovery do its quiet work.",
      love: "Four of Swords: space and calm help the heart process before speaking again.",
      career:
        "Four of Swords: pause, recover, and protect mental energy before the next push.",
    },
    reversed: {
      general:
        "Four of Swords reversed: restlessness says you have been napping with one eye open.",
      love: "Four of Swords reversed: avoidance or silence may be stretching too long.",
      career:
        "Four of Swords reversed: burnout signals require a real reset, not just a shorter leash.",
    },
  },
  "Five of Swords": {
    upright: {
      general:
        "Five of Swords: winning the tug toy is not worth losing the pack.",
      love: "Five of Swords: arguments may become hollow victories if kindness disappears.",
      career:
        "Five of Swords: conflict, politics, or pride could make success cost too much.",
    },
    reversed: {
      general:
        "Five of Swords reversed: reconciliation begins when someone drops the need to win.",
      love: "Five of Swords reversed: repair requires accountability, not another clever comeback.",
      career:
        "Five of Swords reversed: choose clean strategy over combative tactics.",
    },
  },
  "Six of Swords": {
    upright: {
      general:
        "Six of Swords: move from rough waters toward calmer ground, even if the ride feels quiet.",
      love: "Six of Swords: healing may require distance, transition, or a gentler way forward.",
      career:
        "Six of Swords: leave a stressful phase behind and carry only useful lessons.",
    },
    reversed: {
      general:
        "Six of Swords reversed: resistance keeps you paddling in the same muddy puddle.",
      love: "Six of Swords reversed: unresolved issues may be delaying emotional movement.",
      career:
        "Six of Swords reversed: transition is needed, but fear is slowing the crossing.",
    },
  },
  "Seven of Swords": {
    upright: {
      general:
        "Seven of Swords: strategy is useful, but sneaking off with the treats has consequences.",
      love: "Seven of Swords: secrecy, avoidance, or guarded behavior needs honest examination.",
      career:
        "Seven of Swords: plan carefully, but do not let cleverness compromise trust.",
    },
    reversed: {
      general:
        "Seven of Swords reversed: the hidden squeaky toy is being found; honesty can reset the field.",
      love: "Seven of Swords reversed: confession or clarity helps repair what avoidance strained.",
      career:
        "Seven of Swords reversed: transparency protects you better than evasive tactics.",
    },
  },
  "Eight of Swords": {
    upright: {
      general:
        "Eight of Swords: limiting thoughts make the gate look locked, though the latch may be open.",
      love: "Eight of Swords: fear or overthinking may be trapping honest emotional movement.",
      career:
        "Eight of Swords: challenge assumptions before accepting that you are stuck.",
    },
    reversed: {
      general:
        "Eight of Swords reversed: a new perspective shows the way out of the mental crate.",
      love: "Eight of Swords reversed: clarity returns when fear no longer leads the conversation.",
      career:
        "Eight of Swords reversed: options appear once old constraints are questioned.",
    },
  },
  "Nine of Swords": {
    upright: {
      general:
        "Nine of Swords: worry circles the room at 3 a.m.; breathe before believing every fear.",
      love: "Nine of Swords: anxiety may be amplifying doubts beyond what the relationship shows.",
      career:
        "Nine of Swords: stress and mental overload need support, facts, and rest.",
    },
    reversed: {
      general:
        "Nine of Swords reversed: the night barking quiets as help, truth, and self-compassion arrive.",
      love: "Nine of Swords reversed: speaking fears gently can reduce their power.",
      career:
        "Nine of Swords reversed: recovery begins when pressure is named and managed.",
    },
  },
  "Ten of Swords": {
    upright: {
      general:
        "Ten of Swords: a painful ending lands hard, but the drama has reached its final scene.",
      love: "Ten of Swords: betrayal, exhaustion, or finality asks for honest closure.",
      career:
        "Ten of Swords: something cannot continue as it was; accept the ending and recover.",
    },
    reversed: {
      general:
        "Ten of Swords reversed: the worst is passing, and you can slowly get back on your paws.",
      love: "Ten of Swords reversed: healing follows when the story stops being reopened.",
      career:
        "Ten of Swords reversed: recovery, lessons, and a new plan emerge after collapse.",
    },
  },
  "Page of Swords": {
    upright: {
      general:
        "Page of Swords: curious ears perk up; questions, messages, and sharp observations arrive.",
      love: "Page of Swords: honest curiosity helps, but watching from the fence is not intimacy.",
      career:
        "Page of Swords: research, learning, and direct questions sharpen your advantage.",
    },
    reversed: {
      general:
        "Page of Swords reversed: gossip, defensiveness, or scattered thoughts can nip at trust.",
      love: "Page of Swords reversed: suspicion or poorly timed words may create distance.",
      career:
        "Page of Swords reversed: verify information before repeating it or acting fast.",
    },
  },
  "Knight of Swords": {
    upright: {
      general:
        "Knight of Swords: fast, fearless thought charges ahead like a bull terrier on a mission.",
      love: "Knight of Swords: direct conversation cuts through delay, but softness matters.",
      career:
        "Knight of Swords: decisive action and sharp focus can break through resistance.",
    },
    reversed: {
      general:
        "Knight of Swords reversed: speed without tact may knock over the whole room.",
      love: "Knight of Swords reversed: bluntness can wound when listening is skipped.",
      career:
        "Knight of Swords reversed: slow down before urgency becomes recklessness.",
    },
  },
  "Queen of Swords": {
    upright: {
      general:
        "Queen of Swords: clear boundaries, honest words, and wise discernment keep the path clean.",
      love: "Queen of Swords: love benefits from truth, independence, and respectful directness.",
      career:
        "Queen of Swords: strategic judgment and clear communication protect your standards.",
    },
    reversed: {
      general:
        "Queen of Swords reversed: sharpness may be guarding an old soft spot.",
      love: "Queen of Swords reversed: criticism can become a bite if vulnerability is avoided.",
      career:
        "Queen of Swords reversed: fairness requires clarity without coldness.",
    },
  },
  "King of Swords": {
    upright: {
      general:
        "King of Swords: disciplined logic leads with fairness, authority, and a steady gaze.",
      love: "King of Swords: mature honesty and clear agreements support trust.",
      career:
        "King of Swords: sound judgment, ethics, and strategy guide the decision.",
    },
    reversed: {
      general:
        "King of Swords reversed: control or harsh logic can turn wisdom into barking orders.",
      love: "King of Swords reversed: emotional distance may hide behind being technically right.",
      career:
        "King of Swords reversed: check bias, rigidity, or misuse of authority.",
    },
  },
  "Ace of Pentacles": {
    upright: {
      general:
        "Ace of Pentacles: a real-world opportunity lands like a fresh treat in the grass.",
      love: "Ace of Pentacles: trust grows through practical care, stability, and consistent effort.",
      career:
        "Ace of Pentacles: a seed of prosperity is ready for patient development.",
    },
    reversed: {
      general:
        "Ace of Pentacles reversed: the opportunity needs stronger roots before you dig in.",
      love: "Ace of Pentacles reversed: security concerns should be named before commitment deepens.",
      career:
        "Ace of Pentacles reversed: review resources, timing, and follow-through before investing.",
    },
  },
  "Two of Pentacles": {
    upright: {
      general:
        "Two of Pentacles: balance the balls, the bowl, and the schedule without losing your rhythm.",
      love: "Two of Pentacles: love needs flexible effort as daily responsibilities shift.",
      career:
        "Two of Pentacles: manage priorities carefully and keep resources moving smoothly.",
    },
    reversed: {
      general:
        "Two of Pentacles reversed: too many balls are bouncing; simplify before one rolls away.",
      love: "Two of Pentacles reversed: imbalance in time or attention needs honest adjustment.",
      career:
        "Two of Pentacles reversed: overload or poor prioritization may disrupt stability.",
    },
  },
  "Three of Pentacles": {
    upright: {
      general:
        "Three of Pentacles: skilled teamwork builds something stronger than one determined pup could make alone.",
      love: "Three of Pentacles: partnership improves through cooperation, listening, and shared effort.",
      career:
        "Three of Pentacles: collaboration, craft, and feedback raise the quality of the work.",
    },
    reversed: {
      general:
        "Three of Pentacles reversed: poor coordination can turn teamwork into paws on wet paint.",
      love: "Three of Pentacles reversed: the relationship needs better cooperation, not more criticism.",
      career:
        "Three of Pentacles reversed: align roles and standards before continuing the build.",
    },
  },
  "Four of Pentacles": {
    upright: {
      general:
        "Four of Pentacles: holding tight creates security, but guarding every treat can shrink the heart.",
      love: "Four of Pentacles: possessiveness or fear may be limiting trust and generosity.",
      career:
        "Four of Pentacles: conserve resources wisely without becoming too rigid to grow.",
    },
    reversed: {
      general:
        "Four of Pentacles reversed: loosen your grip and let energy circulate again.",
      love: "Four of Pentacles reversed: trust improves when control gives way to openness.",
      career:
        "Four of Pentacles reversed: release hoarding, scarcity thinking, or stale financial habits.",
    },
  },
  "Five of Pentacles": {
    upright: {
      general:
        "Five of Pentacles: hardship feels cold, but support may be closer than the locked door suggests.",
      love: "Five of Pentacles: loneliness or insecurity needs compassion and practical reassurance.",
      career:
        "Five of Pentacles: financial stress or exclusion asks for help, not silent endurance.",
    },
    reversed: {
      general:
        "Five of Pentacles reversed: warmth returns as you accept help and step back inside.",
      love: "Five of Pentacles reversed: rebuilding trust starts with small, tangible signs of care.",
      career:
        "Five of Pentacles reversed: recovery begins through resources, support, and realistic planning.",
    },
  },
  "Six of Pentacles": {
    upright: {
      general:
        "Six of Pentacles: give and receive fairly; every pup deserves a turn at the treat jar.",
      love: "Six of Pentacles: generosity and reciprocity make affection feel balanced.",
      career:
        "Six of Pentacles: support, mentorship, or fair exchange benefits everyone involved.",
    },
    reversed: {
      general:
        "Six of Pentacles reversed: uneven giving can create hidden resentment.",
      love: "Six of Pentacles reversed: one-sided effort needs recalibration before trust thins.",
      career:
        "Six of Pentacles reversed: watch for power imbalance, unfair pay, or unclear expectations.",
    },
  },
  "Seven of Pentacles": {
    upright: {
      general:
        "Seven of Pentacles: pause by the garden and see which efforts are actually growing.",
      love: "Seven of Pentacles: patience and reflection reveal whether the bond is being nourished.",
      career:
        "Seven of Pentacles: assess returns before investing more time, money, or energy.",
    },
    reversed: {
      general:
        "Seven of Pentacles reversed: impatience may have you digging up seeds too soon.",
      love: "Seven of Pentacles reversed: frustration asks whether effort is shared and sustainable.",
      career:
        "Seven of Pentacles reversed: redirect resources if the current approach is not yielding results.",
    },
  },
  "Eight of Pentacles": {
    upright: {
      general:
        "Eight of Pentacles: practice, patience, and tiny improvements turn pawprints into mastery.",
      love: "Eight of Pentacles: consistent effort and learning each other well strengthen trust.",
      career:
        "Eight of Pentacles: disciplined craft and repetition build excellent results.",
    },
    reversed: {
      general:
        "Eight of Pentacles reversed: cutting corners may leave chew marks on the final work.",
      love: "Eight of Pentacles reversed: effort cannot be occasional if the bond needs repair.",
      career:
        "Eight of Pentacles reversed: boredom, perfectionism, or sloppy habits need correction.",
    },
  },
  "Nine of Pentacles": {
    upright: {
      general:
        "Nine of Pentacles: independence, comfort, and earned abundance let you lounge proudly in the sun.",
      love: "Nine of Pentacles: self-worth and personal stability make love healthier.",
      career:
        "Nine of Pentacles: disciplined effort brings reward, autonomy, and refined success.",
    },
    reversed: {
      general:
        "Nine of Pentacles reversed: comfort may wobble if self-worth depends on appearances.",
      love: "Nine of Pentacles reversed: independence is healthy, but walls can block intimacy.",
      career:
        "Nine of Pentacles reversed: review spending, sustainability, or overreliance on status.",
    },
  },
  "Ten of Pentacles": {
    upright: {
      general:
        "Ten of Pentacles: legacy, security, and pack stability gather into something lasting.",
      love: "Ten of Pentacles: commitment is supported by shared values, family, and practical plans.",
      career:
        "Ten of Pentacles: long-term success, assets, or institutional support come into focus.",
    },
    reversed: {
      general:
        "Ten of Pentacles reversed: inherited patterns or security worries need honest review.",
      love: "Ten of Pentacles reversed: family pressure or material concerns may strain the bond.",
      career:
        "Ten of Pentacles reversed: protect the foundation before chasing bigger gains.",
    },
  },
  "Page of Pentacles": {
    upright: {
      general:
        "Page of Pentacles: a practical lesson begins with curious paws and real potential.",
      love: "Page of Pentacles: sincerity grows through small, steady gestures of care.",
      career:
        "Page of Pentacles: study, planning, and beginner discipline open material opportunity.",
    },
    reversed: {
      general:
        "Page of Pentacles reversed: distraction may bury the lesson like a bone you forget to find.",
      love: "Page of Pentacles reversed: promises need practical proof, not just good intentions.",
      career:
        "Page of Pentacles reversed: procrastination or inconsistency can stall growth.",
    },
  },
  "Knight of Pentacles": {
    upright: {
      general:
        "Knight of Pentacles: slow, steady, loyal progress wins the walk one pawstep at a time.",
      love: "Knight of Pentacles: trust grows through consistency, patience, and dependable care.",
      career:
        "Knight of Pentacles: disciplined follow-through turns modest progress into lasting results.",
    },
    reversed: {
      general:
        "Knight of Pentacles reversed: routine may have become stubbornness, stagnation, or a very dug-in sit.",
      love: "Knight of Pentacles reversed: reliability matters, but emotional effort cannot be postponed forever.",
      career:
        "Knight of Pentacles reversed: perfectionism or delay may be blocking momentum.",
    },
  },
  "Queen of Pentacles": {
    upright: {
      general:
        "Queen of Pentacles: practical care, comfort, and resourcefulness make the whole den feel safe.",
      love: "Queen of Pentacles: affection is shown through warmth, loyalty, and everyday support.",
      career:
        "Queen of Pentacles: grounded leadership creates sustainable, well-tended success.",
    },
    reversed: {
      general:
        "Queen of Pentacles reversed: caretaking can become depletion when your own bowl goes empty.",
      love: "Queen of Pentacles reversed: nurture must include boundaries and mutual care.",
      career:
        "Queen of Pentacles reversed: restore work-life balance before responsibility becomes resentment.",
    },
  },
  "King of Pentacles": {
    upright: {
      general:
        "King of Pentacles: steady mastery builds a secure yard, a full bowl, and lasting abundance.",
      love: "King of Pentacles: commitment deepens through loyalty, protection, and practical generosity.",
      career:
        "King of Pentacles: wise management and long-term strategy create durable prosperity.",
    },
    reversed: {
      general:
        "King of Pentacles reversed: security can become stubborn control or treat-hoarding excess.",
      love: "King of Pentacles reversed: material comfort cannot replace emotional presence.",
      career:
        "King of Pentacles reversed: review greed, rigidity, or short-sighted financial choices.",
    },
  },
} as const;

function meaningsFor(name: string): InterpretationSet {
  if (name in MAJOR_MEANINGS) {
    return MAJOR_MEANINGS[name as keyof typeof MAJOR_MEANINGS];
  }

  if (name in MINOR_MEANINGS) {
    return MINOR_MEANINGS[name as MinorCardName];
  }

  throw new Error(`Unknown tarot card: ${name}`);
}

const SUIT_TO_CATALOG: Readonly<Record<MinorSuit, TarotSuit>> = {
  Wands: "wands",
  Cups: "cups",
  Swords: "swords",
  Pentacles: "pentacles",
} as const;

const RANK_TO_CATALOG: Readonly<Record<MinorRank, TarotRank>> = {
  Ace: "ace",
  Two: "two",
  Three: "three",
  Four: "four",
  Five: "five",
  Six: "six",
  Seven: "seven",
  Eight: "eight",
  Nine: "nine",
  Ten: "ten",
  Page: "page",
  Knight: "knight",
  Queen: "queen",
  King: "king",
} as const;

function metadataFor(
  name: string,
): Pick<TarotCardContent, "arcana" | "suit" | "rank"> {
  if (name in MAJOR_MEANINGS) {
    return {
      arcana: "major",
      suit: null,
      rank: null,
    };
  }

  const [rankPart, suitPart] = name.split(" of ");
  const rank = rankPart as MinorRank;
  const suit = suitPart as MinorSuit;

  return {
    arcana: "minor",
    suit: SUIT_TO_CATALOG[suit],
    rank: RANK_TO_CATALOG[rank],
  };
}

export const TAROT_CARDS: readonly TarotCardContent[] = TAROT_NAMES.map(
  (name, id) => {
    const metadata = metadataFor(name);

    return {
      id,
      name,
      arcana: metadata.arcana,
      suit: metadata.suit,
      rank: metadata.rank,
      interpretations: meaningsFor(name),
    };
  },
);
