// Per-skill learning content: richer explanation, YouTube tutorial search
// links, and a parametric 3D drill/technique animation spec.
//
// Court coordinate system used by AnimSpec and the Court3D renderer (official
// USA Pickleball dimensions, world units = metres):
//   x: sideline to sideline,  [-3.05 .. 3.05]   (court is 6.10m / 20ft wide)
//   z: baseline to baseline,  [-6.71 .. 6.71]   (court is 13.41m / 44ft long)
//   net at z = 0.  Kitchen (non-volley) lines at z = ±2.13 (7ft).
//   Net sags from 36in at the posts to 34in at center.
//   "You" play the near side (positive z); opponents the far side (negative z).
// Ball positions are [x, z] on the court plane. The renderer (Court3D) derives
// the full 3D flight from the `template`: it solves a gravity parabola whose
// curvature guarantees the ball clears the net (at its real height for the
// crossing point) by a shot-appropriate margin, then bounces. You only choose
// WHERE the ball goes (from/to) and the shot TYPE — never the arc height.
// See .claude/skills/pickleball-court-animations for the authoring contract.

export type AnimTemplate =
  | 'serve'
  | 'return'
  | 'drive'
  | 'drop'
  | 'dink'
  | 'lob'
  | 'smash'
  | 'rollVolley'
  | 'speedup'
  | 'blockReset'
  | 'erne'
  | 'formation'
  | 'crossCourt'
  | 'downLine'
  | 'courtZone';

export interface PlayerMarker {
  team: 'you' | 'opp';
  pos: [number, number]; // [x, z]
}

export interface AnimSpec {
  template: AnimTemplate;
  from?: [number, number]; // ball start [x, z] — the striker's contact point
  to?: [number, number]; // ball end [x, z] — landing (groundstrokes) or contact (volleys)
  spin?: 'top' | 'flat' | 'slice'; // overrides the template default; shapes the arc + descent
  players?: PlayerMarker[]; // defaults to doubles-at-kitchen if omitted
  highlight?: [number, number, number, number]; // [centerX, centerZ, width, depth] target/zone rectangle
  /** Concept skills have no real ball flight — show the court + this note instead of a drill. */
  concept?: boolean;
  note?: string; // short on-court caption (esp. for concept skills)
}

export interface SkillContent {
  explanation: string;
  youtube: string[]; // search query strings -> rendered as YouTube search links
  anim: AnimSpec;
}

const yt = (...q: string[]) => q;

// Default doubles formation (both teams at their kitchen lines).
export const DEFAULT_PLAYERS: PlayerMarker[] = [
  { team: 'you', pos: [-1.3, 2.6] },
  { team: 'you', pos: [1.3, 2.6] },
  { team: 'opp', pos: [-1.3, -2.6] },
  { team: 'opp', pos: [1.3, -2.6] },
];

export const skillContent: Record<string, SkillContent> = {
  // ===== SCORE POINTS =====
  diff_balls: {
    explanation:
      'Forcing errors is about difficulty relative to the opponent, not raw power. A ball that is routine for a 4.5 can break down a 3.0, so read who you are playing and feed them shots just past their comfort zone — deep dinks, pace changes, balls to the backhand. Escalate difficulty only as much as you need to.',
    youtube: yt('pickleball forcing errors strategy'),
    anim: { template: 'dink', from: [1.2, 2.4], to: [-2.2, -1.8], spin: 'slice' },
  },
  exploit: {
    explanation:
      'Every opponent has something they cannot do well: a weak backhand, poor mobility, bad hands at speed, or impatience. Spend the first few points finding it, then return to it on the points that matter. Repeatedly testing a weakness is more reliable than hunting for highlight winners.',
    youtube: yt('pickleball exploit opponent weakness'),
    anim: { template: 'courtZone', concept: true, highlight: [-1.6, -2.6, 1.6, 1.4], note: 'Find it, then go back to it' },
  },
  w1: {
    explanation:
      "Most players' backhands float higher and have less power than their forehands. Pinning shots to the backhand — especially the backhand dink and the backhand speed-up defense — produces pop-ups you can attack. Identify the weaker wing early and live there.",
    youtube: yt('pickleball attack backhand strategy'),
    anim: { template: 'dink', from: [1.2, 2.4], to: [-1.9, -1.9], spin: 'slice' },
  },
  w2: {
    explanation:
      'In doubles, the weaker player is a target you can return to every point. Pressure them with your serve, your return, and the bulk of your dinks. The goal is not to embarrass them but to make them hit one more ball than they are comfortable with.',
    youtube: yt('pickleball doubles target weaker player'),
    anim: { template: 'courtZone', concept: true, highlight: [1.3, -2.6, 1.6, 1.6], note: 'Pressure the weaker opponent' },
  },
  w3: {
    explanation:
      'A ball down the middle creates a split-second of hesitation: both opponents think the other has it. Middle dinks and middle speed-ups draw miscommunication, collisions, and late, weak swings — especially against teams that have not sorted out who covers the center.',
    youtube: yt('pickleball hit down the middle doubles'),
    anim: { template: 'dink', from: [0.2, 2.4], to: [0, -1.9] },
  },
  w4: {
    explanation:
      'Wide, sharp angles pull an opponent off the court and open the gap they just vacated. Use cross-court dinks and inside-out angles to stretch them sideways, then attack the space — either behind them down the line or back through the middle.',
    youtube: yt('pickleball move opponent wide angles'),
    anim: { template: 'crossCourt', from: [1.2, 2.4], to: [-2.7, -1.7] },
  },
  w5: {
    explanation:
      'When an opponent settles into a rhythm, change the picture: mix in slower dinks, heavier topspin, slice that stays low, and the occasional change of pace. Disrupting their timing is often what produces the loose ball you have been waiting for.',
    youtube: yt('pickleball change pace and spin'),
    anim: { template: 'drive', from: [1.0, 3.0], to: [-1.4, -3.0], spin: 'top' },
  },
  w6: {
    explanation:
      "A ball at the opponent's feet is mechanically hard to lift and keep low, so it tends to pop up. Aim dinks and drops at the shoelaces of the player at the kitchen — the half-volley off the feet is one of the most error-prone shots in the game.",
    youtube: yt('pickleball dink at the feet'),
    anim: { template: 'dink', from: [1.2, 2.4], to: [1.3, -2.3] },
  },
  high_balls: {
    explanation:
      'Any ball that rises above net height at the kitchen is your highest-percentage attack — you can hit down on it with low risk. Do not wait for the perfect put-away; punish every attackable ball, aiming at the opponent rather than the lines.',
    youtube: yt('pickleball attacking high balls kitchen'),
    anim: { template: 'speedup', from: [0.8, 2.3], to: [-1.2, -2.5], spin: 'flat' },
  },
  at1: {
    explanation:
      'A speed-up at the body or feet gives the opponent the least time and the worst contact point. The dominant-shoulder/hip area is hardest to defend because the paddle has nowhere comfortable to go. Pick the body, not the open court, when you accelerate from the kitchen.',
    youtube: yt('pickleball speed up at body tutorial'),
    anim: { template: 'speedup', from: [0.9, 2.3], to: [-1.0, -2.6], spin: 'flat' },
  },
  at2: {
    explanation:
      'The Erne: anticipating a predictable cross-court dink, you move around or jump across the kitchen and volley the ball out of the air from beside the net post — legally, because your feet land outside the non-volley zone. It steals time and angle from a comfortable dinker.',
    youtube: yt('pickleball Erne tutorial how to'),
    anim: { template: 'erne', from: [-1.6, -2.4], to: [2.9, 2.0] },
  },
  at3: {
    explanation:
      'A short lob is a gift. Track the ball, get under and behind it, and drive the overhead down at an angle into open court or at a body. Most overhead errors come from poor footwork and hitting flat into the net tape — stay balanced and aim a few feet inside the lines.',
    youtube: yt('pickleball overhead smash technique'),
    anim: { template: 'smash', from: [0, 2.0], to: [-1.5, -3.0], spin: 'flat' },
  },
  at4: {
    explanation:
      'The roll volley turns a medium ball into an attack with margin: brush up the back of the ball so topspin carries it over the net and then dips it down at the opponent. It is safer than a flat blast because the spin, not a flat trajectory, creates the put-away.',
    youtube: yt('pickleball roll volley topspin tutorial'),
    anim: { template: 'rollVolley', from: [0.8, 2.3], to: [-1.3, -2.4], spin: 'top' },
  },

  // ===== DON'T LOSE =====
  drill: {
    explanation:
      'Consistency is built, not wished for. Targeted, repetitive drilling — dinks, drops, resets, serves — turns conscious technique into muscle memory that holds up under match pressure. Twenty focused minutes on one shot beats an hour of unstructured rec play for reducing unforced errors.',
    youtube: yt('pickleball drilling routine consistency'),
    anim: { template: 'courtZone', concept: true, highlight: [0, 0, 5.5, 3.5], note: 'Reps build consistency' },
  },
  dr1: {
    explanation:
      'Dink accuracy wins kitchen battles. Drill placement and consistency over power — target cross-court, down the line, at the feet, and to the backhand, keeping the ball low and unattackable. Aim small (a paddle-sized target) so match targets feel large.',
    youtube: yt('pickleball dink drill accuracy'),
    anim: { template: 'dink', from: [1.2, 2.4], to: [-1.8, -1.9] },
  },
  dr2: {
    explanation:
      'The third shot decides whether you get to the net. Drill both the drop (soft, into the kitchen, to advance) and the drive (low and hard, to pressure), and — most importantly — the judgment of when to use each. A one-dimensional third shot is easy to defend.',
    youtube: yt('pickleball third shot drop and drive drill'),
    anim: { template: 'drop', from: [1.0, 5.8], to: [-1.0, -1.4] },
  },
  dr3: {
    explanation:
      'The reset is your survival shot: when opponents speed up, absorb the pace and float the ball softly back into the kitchen. Drill blocking hard balls with a relaxed grip and a still paddle so the ball dies short instead of popping up. This is the single most valuable defensive skill.',
    youtube: yt('pickleball reset drill under pressure'),
    anim: { template: 'blockReset', from: [-1.0, -2.5], to: [0.6, 1.0] },
  },
  mg1: {
    explanation:
      'The ideal dink clears the net by only 5–15 cm (2–6 inches). Too low and you hit the net; too high and you hand over a free attack. That narrow band — just clearing, landing soft in the kitchen — is what makes a dink unattackable.',
    youtube: yt('pickleball dink height net clearance'),
    anim: { template: 'dink', from: [1.2, 2.4], to: [-1.5, -1.8] },
  },
  mg2: {
    explanation:
      'Drives should clear the net by as little as possible while still clearing. A low, flat (or low topspin) drive gives the opponent less time and a harder, dipping ball to handle. A drive that sails up is a free ball — keep it skimming the tape.',
    youtube: yt('pickleball drive technique low'),
    anim: { template: 'drive', from: [1.0, 4.5], to: [-1.0, -3.2], spin: 'top' },
  },
  mg3: {
    explanation:
      'Build in margin: aim roughly 60 cm (2 ft) inside the lines. You get the benefit of depth without sailing long on the days your timing is slightly off. Smart players play to a target zone, not the chalk.',
    youtube: yt('pickleball margin aim inside lines'),
    anim: { template: 'serve', from: [1.2, 6.4], to: [-1.2, -5.6], highlight: [-1.2, -5.0, 2.2, 1.6] },
  },
  ss1: {
    explanation:
      'Unless you have a clear put-away, choose the high-percentage shot and keep the ball in play. Patience pressures the opponent into the first mistake; forcing low-percentage winners hands them free points. Win the rally, do not just end it.',
    youtube: yt('pickleball shot selection high percentage'),
    anim: { template: 'courtZone', concept: true, highlight: [0, 0, 5.5, 3.0], note: 'Keep it in play, wait for the opening' },
  },
  ss2: {
    explanation:
      'Never speed up a ball that is below net height. Hitting up gives the opponent both time and a rising ball to counter-attack. If the contact point is below the tape, reset or dink instead — the speed-up only pays when you can hit down or flat.',
    youtube: yt('pickleball when not to speed up'),
    anim: { template: 'dink', concept: true, from: [0.8, 2.3], to: [-1.4, -1.9], note: 'Below the net? Reset, do not attack' },
  },
  def1: {
    explanation:
      'When you get a paddle on a hard drive, the highest-value reply is a soft block that dies in the kitchen. It resets the rally and forces the opponent to hit up again. Open the face slightly, keep the paddle still, and let the ball lose its pace into the paddle.',
    youtube: yt('pickleball soft block reset kitchen'),
    anim: { template: 'blockReset', from: [-0.8, -2.5], to: [0.4, 0.9] },
  },
  def2: {
    explanation:
      'The "dead paddle" absorbs pace: loosen your grip and let the wrist and hand give on contact, like catching an egg. Drop your weight and keep the paddle out front. A tight grip rebounds the ball long; soft hands deaden it into the kitchen.',
    youtube: yt('pickleball dead paddle soft hands'),
    anim: { template: 'blockReset', from: [-1.0, -2.6], to: [0.5, 1.1], note: 'Soft grip, give on contact' },
  },
  def3: {
    explanation:
      'A defensive lob is an emergency reset, not a strategy. When you are scrambling and out of position, a high, deep lob buys time to recover. Make it genuinely high and deep — a short lob is an overhead waiting to happen — and use it sparingly.',
    youtube: yt('pickleball defensive lob technique'),
    anim: { template: 'lob', from: [0.5, 3.2], to: [-0.5, -5.6] },
  },
  def4: {
    explanation:
      'Under fire, surviving beats heroics. A soft block that resets the point forces the opponent to earn it again, while a low-percentage counter often gifts them the rally. Let them make the error — re-neutralize, do not try to win the point in one swing.',
    youtube: yt('pickleball defense reset vs counter'),
    anim: { template: 'blockReset', concept: true, from: [-0.9, -2.5], to: [0.3, 1.0], note: 'Survive the point, do not force it' },
  },

  // ===== POSITIONAL =====
  kc1: {
    explanation:
      'The team at the kitchen line controls the point — it is the center of the board. After the return, both partners should advance together to the non-volley line as soon as the shot pattern allows. Whoever gets there first, as a pair, usually wins the rally.',
    youtube: yt('pickleball get to the kitchen line doubles'),
    anim: { template: 'formation', note: 'Both partners up, together', players: DEFAULT_PLAYERS, highlight: [0, 2.13, 6.1, 0.2] },
  },
  kc2: {
    explanation:
      'The transition zone (mid-court) is no man\'s land: balls land at your feet there and you are easy to attack. Treat it as a corridor to move through, not a place to camp. Split-step, take what you must, and keep advancing to the kitchen.',
    youtube: yt('pickleball transition zone footwork'),
    anim: { template: 'courtZone', concept: true, highlight: [0, 4.0, 6.1, 2.4], note: 'Pass through — never camp here' },
  },
  kc3: {
    explanation:
      'The third shot drop is your ticket to the net. From the baseline, a soft arc that lands in the kitchen forces opponents to hit up while you advance. It is the bridge from defense (back) to offense (kitchen line) in the standard point pattern.',
    youtube: yt('pickleball third shot drop tutorial'),
    anim: { template: 'drop', from: [1.0, 5.9], to: [-1.0, -1.3] },
  },
  kc4: {
    explanation:
      'Do not let opponents settle on their kitchen line. Mix deep dinks that push them back, the occasional lob, and drives at the feet to keep them honest and out of a comfortable forward position. Moving them backward opens the kitchen for your attack.',
    youtube: yt('pickleball push opponents off kitchen line'),
    anim: { template: 'lob', from: [1.0, 2.4], to: [-1.2, -4.6] },
  },
  cg1: {
    explanation:
      'Cross-court is the safe direction: the diagonal is longer and the net is lowest in the middle, giving you more margin for error. Default your dinks and many drives cross-court, and save the riskier down-the-line shot for when it is clearly on.',
    youtube: yt('pickleball cross court dink why'),
    anim: { template: 'crossCourt', from: [1.4, 2.4], to: [-1.9, -1.9] },
  },
  cg2: {
    explanation:
      'Down the line is high risk, high reward: a shorter court and a higher net, but a winner when the opponent has cheated to cover cross-court. Use it as a counter-punch to their positioning, not as a steady diet — it punishes over-commitment.',
    youtube: yt('pickleball down the line dink when'),
    anim: { template: 'downLine', from: [1.4, 2.4], to: [1.5, -1.9] },
  },
  cg3: {
    explanation:
      'An inside-out angle is hit from the middle out toward a sideline, pulling the opponent wide and opening the court behind them. It is a geometry weapon: create the gap with the angle, then attack the space on the next ball.',
    youtube: yt('pickleball inside out dink angle'),
    anim: { template: 'crossCourt', from: [0.4, 2.4], to: [-2.7, -1.6] },
  },
  fm1: {
    explanation:
      'Side by side is the default doubles formation: each partner covers their half of the court and the middle is communicated. It gives the clearest coverage and responsibilities — your home base unless a specific situation calls for stacking.',
    youtube: yt('pickleball doubles positioning side by side'),
    anim: { template: 'formation', note: 'Each covers a half', players: DEFAULT_PLAYERS },
  },
  fm2: {
    explanation:
      'Stacking lets you keep both forehands in the middle (or hide a weaker side) regardless of who served or returned. Partners line up on the same side and switch after the shot. It is an organizational tool for optimizing your strongest coverage.',
    youtube: yt('pickleball stacking explained beginners'),
    anim: {
      template: 'formation',
      note: 'Forehands in the middle',
      players: [
        { team: 'you', pos: [-0.6, 2.6] },
        { team: 'you', pos: [-0.6, 4.4] },
        { team: 'opp', pos: [-1.3, -2.6] },
        { team: 'opp', pos: [1.3, -2.6] },
      ],
    },
  },
  fm3: {
    explanation:
      'Move as a connected unit. When your partner slides to cover a wide ball, you slide with them to keep the same spacing — otherwise a gap opens through the middle. Imagine a short rope tying you together: the team that stays parallel leaks fewer easy lanes.',
    youtube: yt('pickleball move as a unit doubles'),
    anim: {
      template: 'formation',
      note: 'Slide together — no middle gap',
      players: [
        { team: 'you', pos: [-2.0, 2.6] },
        { team: 'you', pos: [0.6, 2.6] },
        { team: 'opp', pos: [-1.3, -2.6] },
        { team: 'opp', pos: [1.3, -2.6] },
      ],
    },
  },
  fm4: {
    explanation:
      'Overloading borrows from chess: force one defender to guard two things at once. Pull a player wide with a sharp angle and they can no longer also cover the middle — the gap they vacate is your target on the next ball. One piece cannot defend both squares.',
    youtube: yt('pickleball create openings angles overload'),
    anim: { template: 'formation', note: 'Pull one wide — the middle opens', highlight: [1.4, -2.0, 1.6, 1.6], players: [
      { team: 'you', pos: [-1.3, 2.6] },
      { team: 'you', pos: [1.3, 2.6] },
      { team: 'opp', pos: [-2.4, -2.4] },
      { team: 'opp', pos: [1.3, -2.6] },
    ] },
  },

  // ===== TEMPO =====
  op1: {
    explanation:
      'Serve deep to delay the returner\'s advance to the kitchen. A serve that lands near the baseline pins them back and buys you time, where a short serve lets them step in and rush forward. Depth, not pace, is the priority on the serve.',
    youtube: yt('pickleball deep serve placement'),
    anim: { template: 'serve', from: [1.2, 6.4], to: [-1.2, -5.7], highlight: [-1.2, -5.4, 2.4, 1.2] },
  },
  op2: {
    explanation:
      'The return-of-serve should be deep, then you charge the kitchen behind it. A deep return keeps the serving team pinned at the baseline (where they must hit a third-shot drop), while you and your partner take the net. Depth on the return is a positional weapon.',
    youtube: yt('pickleball deep return of serve strategy'),
    anim: { template: 'return', from: [-1.2, -5.6], to: [1.2, 5.7], highlight: [1.2, 5.4, 2.4, 1.2] },
  },
  op3: {
    explanation:
      'The third shot is the pivotal move of the point: drop softly into the kitchen to advance, or drive low to pressure. Read the height and depth of the return and the opponents\' position to choose — a good third shot is about decision-making as much as execution.',
    youtube: yt('pickleball third shot drop vs drive'),
    anim: { template: 'drop', from: [1.0, 5.8], to: [-1.0, -1.4] },
  },
  op4: {
    explanation:
      'The fifth shot confirms your position. After a decent third-shot drop and a step into the transition zone, the fifth shot (often another drop or reset) secures your advance to the kitchen line. Do not rush the attack — get established first, then play offense.',
    youtube: yt('pickleball fifth shot strategy advancing'),
    anim: { template: 'drop', from: [0.8, 4.0], to: [-1.0, -1.3], players: [
      { team: 'you', pos: [-0.8, 3.8] },
      { team: 'you', pos: [1.4, 3.8] },
      { team: 'opp', pos: [-1.3, -2.6] },
      { team: 'opp', pos: [1.3, -2.6] },
    ] },
  },
  in1: {
    explanation:
      'A Zwischenzug ("in-between move" in chess) is an unexpected shot that disrupts the opponent\'s plan. Example: instead of the expected reset when they speed up at you, you redirect a counter at their partner — forcing a brand-new problem before they can follow up their attack.',
    youtube: yt('pickleball counter attack redirect doubles'),
    anim: { template: 'speedup', from: [0.4, 2.3], to: [1.4, -2.5], spin: 'flat', note: 'Redirect to the other opponent' },
  },
  in2: {
    explanation:
      'Control the pace by giving opponents what they do not want. Fast, aggressive players hate being slowed down — patient dinks and resets take away their rhythm. Dictating tempo means imposing your preferred speed, not matching theirs.',
    youtube: yt('pickleball control the pace tempo'),
    anim: { template: 'dink', concept: true, from: [1.0, 2.4], to: [-1.6, -1.9], note: 'Give them what they dislike' },
  },
  in3: {
    explanation:
      'Whoever dictates has the initiative; the reactor is always a step behind, making decisions under pressure. Look to be the team setting up patterns and forcing responses rather than the one constantly responding. Reacting, over a match, is losing slowly.',
    youtube: yt('pickleball dictate rallies initiative'),
    anim: { template: 'courtZone', concept: true, highlight: [0, 0, 5.5, 3.0], note: 'Set the pattern — make them react' },
  },
  pr1: {
    explanation:
      'The number-one prophylactic principle: keep the ball low so it can never be attacked. If your dinks and resets stay below net height at the opponent\'s contact point, they simply have nothing to hit down on. Deny the attackable ball before it exists.',
    youtube: yt('pickleball keep the ball low unattackable'),
    anim: { template: 'dink', from: [1.0, 2.4], to: [-1.6, -1.9] },
  },
  pr2: {
    explanation:
      'Give away no free speed-ups. A dink that bounces or arrives above net height is an open invitation to attack. Discipline every dink to land low and short — the cost of one lazy high dink is often the whole point.',
    youtube: yt('pickleball avoid high dinks free attack'),
    anim: { template: 'dink', from: [1.2, 2.4], to: [-1.4, -1.85] },
  },
  pr3: {
    explanation:
      'Paddle up and ready in front of your chest is the cheapest improvement in the game. From there your reaction time to a speed-up is a fraction of what it is with the paddle down at your side. Preparation is defense — reset to ready between every shot.',
    youtube: yt('pickleball ready position paddle up'),
    anim: { template: 'courtZone', concept: true, highlight: [0, 2.6, 6.1, 0.6], note: 'Paddle up, in front, between every ball' },
  },
  pr4: {
    explanation:
      'Cut off the opponent\'s best angles by positioning before they hit, not after. If a player loves the sharp cross-court, shade to cover it — they are forced into their second-best option. Good positioning removes shots from their menu prophylactically.',
    youtube: yt('pickleball cut off angles positioning'),
    anim: { template: 'formation', concept: true, note: 'Shade to take away their favorite angle', players: [
      { team: 'you', pos: [-1.9, 2.6] },
      { team: 'you', pos: [0.8, 2.6] },
      { team: 'opp', pos: [-1.3, -2.6] },
      { team: 'opp', pos: [1.3, -2.6] },
    ] },
  },

  // ===== PSYCHOLOGY =====
  pa1: {
    explanation:
      'The paddle face is the most reliable tell of where the ball is going. An open face is lifting (dink or lob); a closed, forward face is driving. Watch the paddle in the split-second before contact and you can start moving before the ball is even struck.',
    youtube: yt('pickleball read opponent paddle angle'),
    anim: { template: 'courtZone', concept: true, highlight: [-1.3, -2.6, 1.4, 1.4], note: 'Watch the paddle face, not the ball' },
  },
  pa2: {
    explanation:
      'Body cues forecast the shot. A big weight load and shoulder turn signal a drive; soft, quiet preparation signals a drop. Reading the loading of the body — not just the ball — lets you anticipate a third shot as drop versus drive before it leaves the paddle.',
    youtube: yt('pickleball read body cues anticipation'),
    anim: { template: 'courtZone', concept: true, highlight: [-1.0, -3.4, 1.6, 1.6], note: 'Big load = drive, soft = drop' },
  },
  pa3: {
    explanation:
      'Patterns predict the next ball. A string of cross-court dinks with a shorter, slightly higher one often precedes a speed-up. Recognizing the sequence — and getting your paddle up a beat early — turns their surprise attack into a ball you were waiting for.',
    youtube: yt('pickleball anticipate speed up pattern'),
    anim: { template: 'courtZone', concept: true, highlight: [0, -2.3, 4.0, 1.0], note: 'Dink, dink, short ball = speed-up coming' },
  },
  ad1: {
    explanation:
      'Treat the early part of a match as scouting. Before committing to a game plan, observe tendencies: which wing breaks down, how they handle pace, where they like to dink, who covers the middle. Information gathered early pays off on the points that decide the match.',
    youtube: yt('pickleball scouting opponents match strategy'),
    anim: { template: 'courtZone', concept: true, highlight: [0, -2.6, 6.1, 2.0], note: 'Observe and catalog tendencies' },
  },
  ad2: {
    explanation:
      'When opponents adjust to your plan, adjust harder. If they finally start protecting the backhand you have been hammering, the forehand and middle are now open — punish the over-correction. Never let them get comfortable; stay one move ahead.',
    youtube: yt('pickleball mid match adjustments'),
    anim: { template: 'courtZone', concept: true, highlight: [1.3, -2.6, 1.6, 1.6], note: 'They protect one side? Hit the other' },
  },
  ad3: {
    explanation:
      'Predictability is a weakness. If an opponent reads your dinks every time, vary targets, spin, and timing so they cannot settle. Mixing your patterns denies them the rhythm and anticipation that good players feed on — unpredictability is itself a weapon.',
    youtube: yt('pickleball vary your patterns unpredictable'),
    anim: { template: 'courtZone', concept: true, highlight: [0, -2.3, 4.5, 1.2], note: 'Mix targets, spin, and timing' },
  },
  mt1: {
    explanation:
      'Reset mentally after every point. The last point — good or bad — is dead; dwelling on an error carries tension into the next one. A simple routine (a breath, a paddle tap, eyes forward) clears the slate so each point starts neutral.',
    youtube: yt('pickleball mental reset between points'),
    anim: { template: 'courtZone', concept: true, highlight: [0, 0, 5.5, 3.0], note: 'Last point is dead — breathe, refocus' },
  },
  mt2: {
    explanation:
      'Play the score. With a lead, tighten up shot selection and make the opponent take the risks to catch up — the scoreboard pressure works for you. When behind, take calculated, not reckless, risks. Let the situation, not your mood, set your aggression.',
    youtube: yt('pickleball play the score strategy'),
    anim: { template: 'courtZone', concept: true, highlight: [0, 0, 5.5, 3.0], note: 'Ahead = patient · Behind = calculated risk' },
  },
  mt3: {
    explanation:
      'In the endgame (9-9, game on the line), trust your training and play your game — do not shrink. "Try not to make an error" is a negative focus that produces tentative, tight play. Commit to the high-percentage shot you have drilled and let the result follow.',
    youtube: yt('pickleball mental toughness close games'),
    anim: { template: 'courtZone', concept: true, highlight: [0, 0, 5.5, 3.0], note: 'Play YOUR game — commit, do not tighten' },
  },
};
