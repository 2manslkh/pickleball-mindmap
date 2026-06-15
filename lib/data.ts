// Auto-extracted from the original index.html — domain data + types.
// Pillars/questions content is verbatim from the single-file app.

export interface Skill {
  id: string;
  label: string;
  sub: string;
  chess?: boolean;
}

export interface SkillGroup {
  label: string;
  skills: Skill[];
}

export interface Pillar {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  chess: string;
  groups: SkillGroup[];
}

export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface Question {
  skill: string;
  cat: string;
  diff: number;
  scenario?: string;
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface Rating {
  score: number;
  notes: string;
  updated?: string;
}

export const pillars: Pillar[] = [
  { id: 'score', label: 'Score Points', emoji: '⚔️', color: '#10B981', bg: '#ECFDF5', chess: 'Attack with purpose',
    groups: [
      { label: 'Force Errors', skills: [
        { id: 'diff_balls', label: 'Give difficult balls', sub: 'Calibrate to their skill level' },
        { id: 'exploit', label: 'Exploit weaknesses', sub: 'Find and attack what they can\'t do' },
      ]},
      { label: 'Create Weaknesses', skills: [
        { id: 'w1', label: 'Attack weak side', sub: 'Usually backhand' },
        { id: 'w2', label: 'Target weaker player', sub: 'In doubles' },
        { id: 'w3', label: 'Hit to the middle', sub: 'Creates confusion' },
        { id: 'w4', label: 'Move them laterally', sub: 'Open up the court' },
        { id: 'w5', label: 'Change pace & spin', sub: 'Disrupt timing' },
        { id: 'w6', label: 'Hit at their feet', sub: 'Forces pop-ups' },
      ]},
      { label: 'Attacking', skills: [
        { id: 'high_balls', label: 'Attack high balls at kitchen', sub: 'Lowest variance attack' },
        { id: 'at1', label: 'Speed-up at body/feet', sub: 'Least reaction time' },
        { id: 'at2', label: 'Erne', sub: 'Jump around the kitchen' },
        { id: 'at3', label: 'Overhead smash', sub: 'Punish short lobs' },
        { id: 'at4', label: 'Roll volley', sub: 'Topspin put-away with control' },
      ]},
    ]
  },
  { id: 'nolose', label: "Don't Lose", emoji: '🛡️', color: '#10B981', bg: '#ECFDF5', chess: 'Solid defense wins matches',
    groups: [
      { label: 'Avoid Errors', skills: [
        { id: 'drill', label: 'Drill technique', sub: 'Reps build consistency' },
        { id: 'dr1', label: 'Dink accuracy', sub: 'Placement and consistency' },
        { id: 'dr2', label: '3rd shot mastery', sub: 'Both drop and drive' },
        { id: 'dr3', label: 'Reset under pressure', sub: 'Block fast balls softly' },
      ]},
      { label: 'Play with Margin', skills: [
        { id: 'mg1', label: 'Dinks: 5-15cm over net', sub: 'Just clear, unattackable' },
        { id: 'mg2', label: 'Drives: as low as possible', sub: 'No free balls' },
        { id: 'mg3', label: 'Land 60cm inside lines', sub: 'Don\'t sail out' },
      ]},
      { label: 'Smart Shot Selection', skills: [
        { id: 'ss1', label: 'High % shots', sub: 'Unless clear put-away' },
        { id: 'ss2', label: 'Never speed up below net', sub: 'Hitting up = giving them the ball' },
      ]},
      { label: 'Defense & Resets', skills: [
        { id: 'def1', label: 'Soft block to kitchen', sub: 'Reset the rally' },
        { id: 'def2', label: 'Absorb pace (dead paddle)', sub: 'Soft hands, drop weight' },
        { id: 'def3', label: 'Emergency lob', sub: 'Buy time to recover' },
        { id: 'def4', label: 'Survive > hero shot', sub: 'Let THEM make the error' },
      ]},
    ]
  },
  { id: 'position', label: 'Positional', emoji: '♟️', color: '#10B981', bg: '#ECFDF5', chess: 'Control key squares',
    groups: [
      { label: 'Kitchen Line = Center Control', skills: [
        { id: 'kc1', label: 'Both at kitchen ASAP', sub: 'The team that gets there first wins' },
        { id: 'kc2', label: 'Transition zone = no man\'s land', sub: 'Pass through, never camp' },
        { id: 'kc3', label: '3rd shot drop = ticket to net', sub: 'Your way to advance' },
        { id: 'kc4', label: 'Push them back from their line', sub: 'Deep dinks, lobs, drives' },
      ]},
      { label: 'Court Geometry', skills: [
        { id: 'cg1', label: 'Cross-court = safe', sub: 'More margin, lower net' },
        { id: 'cg2', label: 'Down the line = high risk/reward', sub: 'Use when they cheat cross-court' },
        { id: 'cg3', label: 'Inside-out angles', sub: 'Pull them wide, open gaps' },
      ]},
      { label: 'Formations', skills: [
        { id: 'fm1', label: 'Side by side', sub: 'Default, cover court' },
        { id: 'fm2', label: 'Stacking', sub: 'Keep forehands in middle' },
        { id: 'fm3', label: 'Stay parallel', sub: 'Move as a unit, no gaps' },
        { id: 'fm4', label: 'Overloading', sub: 'One piece can\'t guard both sides', chess: true },
      ]},
    ]
  },
  { id: 'tempo', label: 'Tempo', emoji: '⏱️', color: '#10B981', bg: '#ECFDF5', chess: 'Who dictates play?',
    groups: [
      { label: 'Opening Theory', skills: [
        { id: 'op1', label: 'Serve deep', sub: 'Delay their advance' },
        { id: 'op2', label: 'Return deep', sub: 'Pin them at baseline' },
        { id: 'op3', label: '3rd shot = key move', sub: 'Drop to advance OR drive to pressure' },
        { id: 'op4', label: '5th shot = confirm position', sub: 'Secure the net' },
      ]},
      { label: 'Keep Initiative', skills: [
        { id: 'in1', label: 'Zwischenzug', sub: 'Unexpected in-between shot', chess: true },
        { id: 'in2', label: 'Control the pace', sub: 'Give them what they don\'t want' },
        { id: 'in3', label: 'Dictate rallies', sub: 'Reacting = losing' },
      ]},
      { label: 'Prophylaxis', skills: [
        { id: 'pr1', label: 'Keep ball low', sub: 'Deny attackable balls' },
        { id: 'pr2', label: 'No free speed-up balls', sub: 'Every dink below net height' },
        { id: 'pr3', label: 'Paddle up, ready', sub: 'Preparation = defense' },
        { id: 'pr4', label: 'Cut off angles', sub: 'Remove their best options' },
      ]},
    ]
  },
  { id: 'psych', label: 'Psychology', emoji: '🧠', color: '#10B981', bg: '#ECFDF5', chess: 'Know your opponent',
    groups: [
      { label: 'Pattern Recognition', skills: [
        { id: 'pa1', label: 'Read paddle angle', sub: 'Predicts ball direction' },
        { id: 'pa2', label: 'Read body position', sub: 'Weight shift, shoulder turn' },
        { id: 'pa3', label: 'Sequence recognition', sub: 'Dink dink dink = speed-up coming' },
      ]},
      { label: 'Mid-Match Adaptation', skills: [
        { id: 'ad1', label: 'First 3 games = scouting', sub: 'Observe, catalog weaknesses' },
        { id: 'ad2', label: 'They adjusted? Adjust harder', sub: 'Never let them be comfortable' },
        { id: 'ad3', label: 'Vary your patterns', sub: 'Don\'t let them read you' },
      ]},
      { label: 'Mental Toughness', skills: [
        { id: 'mt1', label: 'Reset after every point', sub: 'Last point is dead' },
        { id: 'mt2', label: 'Play the score', sub: 'Ahead = patient, Behind = calculated risks' },
        { id: 'mt3', label: 'Endgame mentality', sub: '9-9? Play YOUR game' },
      ]},
    ]
  },
];

export const questions: Question[] = [
  { skill:'diff_balls',cat:'Force Errors',diff:2,scenario:'You\'re playing against a 3.0 player who keeps returning every ball.',question:'What\'s the best strategy to force unforced errors?',options:[{text:'Hit harder every time',correct:false},{text:'Give them balls difficult relative to their skill level',correct:true},{text:'Only go for winners',correct:false},{text:'Wait for them to make mistakes',correct:false}],explanation:'Calibrate difficulty to their level. A 3.0 might break down on deep dinks or pace changes, while a 5.0 needs much more pressure.'},
  { skill:'w1',cat:'Create Weaknesses',diff:1,scenario:'Your opponent has a strong forehand but their backhand floats high every time.',question:'Where should you target most of your shots?',options:[{text:'Down the middle',correct:false},{text:'To their forehand',correct:false},{text:'To their backhand',correct:true},{text:'Alternate randomly',correct:false}],explanation:'Attack the weak side. If their backhand pops up, you get attackable balls.'},
  { skill:'w2',cat:'Create Weaknesses',diff:1,scenario:'In doubles, one opponent is a 4.5 and the other is a 3.0.',question:'Who should you primarily target?',options:[{text:'The 4.5 to demoralize them',correct:false},{text:'Alternate equally',correct:false},{text:'The 3.0 — more likely to error',correct:true},{text:'Just hit wherever',correct:false}],explanation:'Target the weaker player. The 3.0 breaks down faster under targeted pressure.'},
  { skill:'w3',cat:'Create Weaknesses',diff:2,scenario:'Both opponents are at the kitchen communicating well.',question:'Most effective place to dink?',options:[{text:'Cross-court to the stronger player',correct:false},{text:'Down the line',correct:false},{text:'Right at the middle between them',correct:true},{text:'Lob over their heads',correct:false}],explanation:'The middle creates confusion — both hesitate on who takes it.'},
  { skill:'w4',cat:'Create Weaknesses',diff:2,scenario:'Opponents are shoulder to shoulder, covering the middle well.',question:'How do you create an opening?',options:[{text:'Hit to the middle harder',correct:false},{text:'Move them laterally with wide angles',correct:true},{text:'Lob every shot',correct:false},{text:'Hit only to one player',correct:false}],explanation:'Wide angles pull players apart, opening gaps.'},
  { skill:'w5',cat:'Create Weaknesses',diff:3,scenario:'Your opponent has settled into a comfortable rhythm at the kitchen.',question:'How do you disrupt their timing?',options:[{text:'Hit every ball harder',correct:false},{text:'Change pace and spin',correct:true},{text:'Switch to lobbing only',correct:false},{text:'Hit to the same spot consistently',correct:false}],explanation:'Change of pace and spin disrupts timing and produces weak returns.'},
  { skill:'w6',cat:'Create Weaknesses',diff:3,scenario:'Both opponents at the kitchen. You need an attackable ball.',question:'Most reliable way to get a pop-up?',options:[{text:'Hard drive at them',correct:false},{text:'Dink at their feet',correct:true},{text:'Lob deep',correct:false},{text:'Middle with pace',correct:false}],explanation:'Balls at the feet are mechanically difficult to keep low — forces pop-ups.'},
  { skill:'high_balls',cat:'Attacking',diff:1,scenario:'You\'re at the kitchen and see a ball rising above net height.',question:'Highest percentage attack?',options:[{text:'Lob over them',correct:false},{text:'Speed-up at their body/feet',correct:true},{text:'Try an Erne',correct:false},{text:'Dink it back',correct:false}],explanation:'High balls at the kitchen = lowest variance attacks. Body/feet gives least reaction time.'},
  { skill:'at1',cat:'Attack Types',diff:2,scenario:'Ball above net height at the kitchen. Both opponents in position.',question:'Where should you aim your speed-up?',options:[{text:'Wide to sideline',correct:false},{text:'At their body or feet',correct:true},{text:'High and deep',correct:false},{text:'Softly into kitchen',correct:false}],explanation:'Body gives least reaction time, feet forces hitting up.'},
  { skill:'at2',cat:'Attack Types',diff:4,scenario:'Opponent keeps dinking cross-court to your sideline predictably.',question:'What advanced attack could you execute?',options:[{text:'Keep dinking',correct:false},{text:'Speed up middle',correct:false},{text:'Erne — jump around the kitchen',correct:true},{text:'Lob backhand',correct:false}],explanation:'An Erne exploits predictable cross-court dinks. You anticipate the path and volley outside the sideline.'},
  { skill:'at3',cat:'Attack Types',diff:2,scenario:'Opponent hits a high lob that\'s dropping short.',question:'Best attacking option?',options:[{text:'Let it bounce and drive',correct:false},{text:'Overhead smash',correct:true},{text:'Soft drop to kitchen',correct:false},{text:'Lob it back',correct:false}],explanation:'Short lob = gift. Overhead smash ends the point decisively.'},
  { skill:'at4',cat:'Attack Types',diff:3,scenario:'Medium-height ball at kitchen. You want attack with control, not just power.',question:'What shot combines attack with accuracy?',options:[{text:'Flat speed-up max power',correct:false},{text:'Roll volley — topspin put-away that dips',correct:true},{text:'Soft drop',correct:false},{text:'Lob over them',correct:false}],explanation:'Roll volley uses topspin for net clearance then sharp dip. More margin than a flat blast.'},
  { skill:'drill',cat:'Avoid Errors',diff:1,question:'Most effective way to reduce unforced errors over time?',options:[{text:'Play more tournaments',correct:false},{text:'Watch pro matches',correct:false},{text:'Drill specific techniques with repetition',correct:true},{text:'Buy a better paddle',correct:false}],explanation:'Repetition builds muscle memory and consistency.'},
  { skill:'dr1',cat:'Drilling',diff:2,question:'When drilling dinks, what should you focus on most?',options:[{text:'Power',correct:false},{text:'Placement and consistency',correct:true},{text:'Maximum spin',correct:false},{text:'Speed',correct:false}],explanation:'Placement and consistency win kitchen battles. Accuracy is the foundation.'},
  { skill:'dr2',cat:'Drilling',diff:2,question:'Most important thing to practice with third shot drills?',options:[{text:'Always dropping',correct:false},{text:'Hitting winners',correct:false},{text:'Both drop and drive, and knowing when to use each',correct:true},{text:'Only from one side',correct:false}],explanation:'You need both in your toolkit. Drill both and develop judgment for when each is appropriate.'},
  { skill:'dr3',cat:'Drilling',diff:3,scenario:'Your biggest weakness: you pop the ball up when opponents speed up at you.',question:'What drill should you prioritize?',options:[{text:'Serve practice',correct:false},{text:'Overhead smashes',correct:false},{text:'Reset drills — blocking fast balls softly',correct:true},{text:'Dink-only rallies',correct:false}],explanation:'Resets are the defensive foundation. Trains your hands to absorb speed.'},
  { skill:'mg1',cat:'Margin',diff:2,scenario:'Your last two dinks hit the net.',question:'How much clearance for dinks?',options:[{text:'1cm over — as low as possible',correct:false},{text:'5-15cm (2-6 inches)',correct:true},{text:'60cm (2 feet)',correct:false},{text:'Doesn\'t matter if it lands in kitchen',correct:false}],explanation:'5-15cm is the sweet spot. Too low = net. Too high = attackable. 60cm is a kill ball.'},
  { skill:'mg2',cat:'Margin',diff:2,scenario:'Hitting a forehand drive from mid-court.',question:'How much net clearance for drives?',options:[{text:'As low as possible while clearing',correct:true},{text:'30cm above',correct:false},{text:'60cm above',correct:false},{text:'Hit the net tape',correct:false}],explanation:'Low, flat drives give opponents less time and are harder to return.'},
  { skill:'mg3',cat:'Margin',diff:1,scenario:'Last three serves went long.',question:'How much inside the lines should you aim?',options:[{text:'Right on the line',correct:false},{text:'About 60cm (2ft) inside',correct:true},{text:'Very center of the box',correct:false},{text:'Doesn\'t matter',correct:false}],explanation:'60cm margin lets you be deep without sailing out. Smart players build in margins.'},
  { skill:'ss1',cat:'Shot Selection',diff:2,scenario:'At the kitchen. No obvious opening, both opponents positioned well.',question:'What shot should you hit?',options:[{text:'Low % winner down the line',correct:false},{text:'Speed up at closest player',correct:false},{text:'High % shot — keep ball in play, wait for opening',correct:true},{text:'Lob deep',correct:false}],explanation:'Without a clear put-away, play high percentage. Patience wins more than forcing.'},
  { skill:'ss2',cat:'Shot Selection',diff:2,scenario:'At the kitchen. Ball is below net height but you want to speed up.',question:'Should you attack?',options:[{text:'Yes — surprise them',correct:false},{text:'No — never speed up from below the net',correct:true},{text:'Only if aimed at backhand',correct:false},{text:'Only on your forehand side',correct:false}],explanation:'Below net = hitting upward = giving them time and a ball to counter-attack.'},
  { skill:'def1',cat:'Defense',diff:2,scenario:'Opponent ripped a forehand at you at the kitchen. You got your paddle on it.',question:'Where should your block go?',options:[{text:'Hard back at them',correct:false},{text:'Soft block to the kitchen',correct:true},{text:'High and deep',correct:false},{text:'Wide to sideline',correct:false}],explanation:'Soft block to kitchen resets the rally. Now they have to hit up.'},
  { skill:'def2',cat:'Defense',diff:3,scenario:'Opponents drive hard at you. Your blocks keep going long.',question:'What technique to absorb pace?',options:[{text:'Swing harder to match',correct:false},{text:'Dead paddle — loosen grip, drop weight on contact',correct:true},{text:'Always step back',correct:false},{text:'Switch to heavier paddle',correct:false}],explanation:'Dead paddle = soft hands absorbing energy. Like catching an egg.'},
  { skill:'def3',cat:'Defense',diff:2,scenario:'Both opponents attacking aggressively. You\'re scrambling.',question:'When is a defensive lob OK?',options:[{text:'Never',correct:false},{text:'As primary strategy',correct:false},{text:'Emergency only — need time to recover',correct:true},{text:'Whenever at the kitchen',correct:false}],explanation:'Lobs are emergency reset buttons. Use sparingly, make them high and deep.'},
  { skill:'def4',cat:'Defense',diff:3,scenario:'Hard drive at you, you\'re off balance at the kitchen.',question:'What should you do?',options:[{text:'Counter-attack harder',correct:false},{text:'Block softly — survive the point',correct:true},{text:'Lob immediately',correct:false},{text:'Step back for passing shot',correct:false}],explanation:'Survive > hero shot. Soft block resets and forces them to beat you again.'},
  { skill:'kc1',cat:'Positional',diff:1,question:'After the return of serve, what should the returning team do?',options:[{text:'Both stay at baseline',correct:false},{text:'One to kitchen, one stays back',correct:false},{text:'Both advance to kitchen line together',correct:true},{text:'Both to transition zone',correct:false}],explanation:'Both at the kitchen ASAP. The returning team has the advantage — use it.'},
  { skill:'kc2',cat:'Positional',diff:2,question:'What should you do in the transition zone?',options:[{text:'Camp there and volley',correct:false},{text:'Pass through quickly to the kitchen',correct:true},{text:'Stay if ball is coming fast',correct:false},{text:'Move back to baseline',correct:false}],explanation:'Transition zone is no man\'s land. Balls at your feet here are devastating.'},
  { skill:'kc3',cat:'Positional',diff:2,scenario:'Serving team at baseline after deep return. Opponents at kitchen.',question:'Best shot to get to the kitchen?',options:[{text:'Hard drive deep',correct:false},{text:'Third shot drop into kitchen',correct:true},{text:'Lob over them',correct:false},{text:'Passing shot down the line',correct:false}],explanation:'Third shot drop is your ticket to the net. Forces them to hit up while you advance.'},
  { skill:'kc4',cat:'Positional',diff:3,scenario:'Both opponents established at kitchen line.',question:'How to push them back?',options:[{text:'Short dinks only',correct:false},{text:'Deep dinks, lobs, or drives at feet',correct:true},{text:'Only middle',correct:false},{text:'Slow down completely',correct:false}],explanation:'Mix deep dinks, lobs, and drives to keep them from settling at the kitchen.'},
  { skill:'cg1',cat:'Geometry',diff:1,scenario:'Dinking from kitchen. Cross-court or down the line?',question:'Which direction has more margin?',options:[{text:'Cross-court — more distance and angle',correct:true},{text:'Down the line — shorter',correct:false},{text:'They\'re equal',correct:false},{text:'Depends on hand',correct:false}],explanation:'Cross-court: longer diagonal, lower net in middle, more forgiving angle.'},
  { skill:'cg2',cat:'Geometry',diff:3,scenario:'Been dinking cross-court all rally. Opponent cheating to cover it.',question:'When should you go down the line?',options:[{text:'Never — too risky',correct:false},{text:'Every other shot',correct:false},{text:'When they\'re cheating cross-court and line is open',correct:true},{text:'Only on match point',correct:false}],explanation:'High risk/reward — use strategically when they overcommit cross-court.'},
  { skill:'cg3',cat:'Geometry',diff:3,scenario:'Right side of court, hitting a forehand dink.',question:'What does an inside-out angle do?',options:[{text:'Nothing special',correct:false},{text:'Pulls opponent wide, opening court',correct:true},{text:'Only useful on serves',correct:false},{text:'Makes ball spin more',correct:false}],explanation:'Inside-out angles pull opponents off court, creating gaps for your next shot.'},
  { skill:'fm1',cat:'Formations',diff:1,question:'Default formation for doubles at the kitchen?',options:[{text:'One up, one back',correct:false},{text:'Both same side',correct:false},{text:'Side by side, each covering half',correct:true},{text:'Stacked behind each other',correct:false}],explanation:'Side by side is default — best court coverage and clear responsibility.'},
  { skill:'fm2',cat:'Formations',diff:3,scenario:'Right-handed on the left side. Forehand covers middle but backhand exposed to sideline.',question:'What formation solves this?',options:[{text:'Just play through it',correct:false},{text:'Stacking — position forehands in the middle',correct:true},{text:'Switch sides every point',correct:false},{text:'Stand closer to sideline',correct:false}],explanation:'Stacking lets you choose sides regardless of who served. Keep forehands middle.'},
  { skill:'fm3',cat:'Formations',diff:2,scenario:'Partner moves left to cover a wide angle shot.',question:'What should you do?',options:[{text:'Stay where you are',correct:false},{text:'Move left with them — stay parallel',correct:true},{text:'Move right for more coverage',correct:false},{text:'Move forward',correct:false}],explanation:'Stay parallel — move as a unit. Otherwise a gap opens in the middle.'},
  { skill:'fm4',cat:'Formations',diff:4,scenario:'In chess, "overloading" = one piece guarding two things.',question:'How does overloading apply in pickleball?',options:[{text:'Making one player cover sideline and middle',correct:true},{text:'Hitting every ball to one person',correct:false},{text:'Serving same spot',correct:false},{text:'Two forehands in middle',correct:false}],explanation:'Pull one player wide — they can\'t also cover middle. The gap opens.'},
  { skill:'op1',cat:'Opening',diff:1,question:'Why serve deep?',options:[{text:'To get aces',correct:false},{text:'Rules require it',correct:false},{text:'Delay opponent\'s advance to kitchen',correct:true},{text:'Deep serves are easier',correct:false}],explanation:'Deep serve pins returner back, giving less time to advance.'},
  { skill:'op2',cat:'Opening',diff:1,question:'Why is a deep return important?',options:[{text:'Looks impressive',correct:false},{text:'Pins serving team while you advance to kitchen',correct:true},{text:'Easier than short return',correct:false},{text:'Reduces spin',correct:false}],explanation:'Deep return keeps serving team back while you rush the kitchen.'},
  { skill:'op3',cat:'Opening',diff:2,scenario:'Third shot. Return was deep but not too hard.',question:'What two options should you decide between?',options:[{text:'Lob or drive',correct:false},{text:'Drop into kitchen or drive deep',correct:true},{text:'Dink or Erne',correct:false},{text:'Pass or cross-court',correct:false}],explanation:'Third shot = key move. Drop to advance, or drive to pressure. Depends on situation.'},
  { skill:'op4',cat:'Opening',diff:3,scenario:'Hit a decent third shot drop. Advanced to transition zone.',question:'Purpose of your fifth shot?',options:[{text:'Attack immediately',correct:false},{text:'Lob over them',correct:false},{text:'Confirm and secure net position',correct:true},{text:'Drive to baseline',correct:false}],explanation:'5th shot confirms your position at kitchen. Don\'t rush — get established first.'},
  { skill:'in1',cat:'Initiative',diff:4,scenario:'In chess, a Zwischenzug = in-between move that disrupts opponent\'s plan.',question:'Opponent speeds up at you. Expected response: block or reset. What\'s the Zwischenzug?',options:[{text:'Block softly as expected',correct:false},{text:'Counter to their PARTNER — force a new problem',correct:true},{text:'Lob over them',correct:false},{text:'Call timeout',correct:false}],explanation:'Instead of the expected reset, redirect to the other opponent. Disrupts their follow-up plan.'},
  { skill:'in2',cat:'Initiative',diff:2,scenario:'Opponents play best at fast, aggressive pace.',question:'How to control tempo?',options:[{text:'Match their pace',correct:false},{text:'Slow them down with soft dinks and resets',correct:true},{text:'Speed up even faster',correct:false},{text:'Only lob',correct:false}],explanation:'Give them what they don\'t want. Fast players hate patient dinking.'},
  { skill:'in3',cat:'Initiative',diff:2,question:'Who usually has the advantage — dictating or reacting?',options:[{text:'The reactor — sees what\'s coming',correct:false},{text:'It\'s equal',correct:false},{text:'The dictator — reacting = always a step behind',correct:true},{text:'Depends on skill only',correct:false}],explanation:'Dictating = initiative. The reactor is always behind, making decisions under pressure.'},
  { skill:'pr1',cat:'Prophylaxis',diff:3,scenario:'In chess, prophylaxis = preventing opponent\'s plan before they execute.',question:'#1 prophylactic principle in pickleball?',options:[{text:'Hit hard so they can\'t set up',correct:false},{text:'Keep ball low — deny attackable balls',correct:true},{text:'Always lob',correct:false},{text:'Stand close to net',correct:false}],explanation:'If the ball never gets above the net, they can never attack. Pure prophylaxis.'},
  { skill:'pr2',cat:'Prophylaxis',diff:2,scenario:'Your last dink was too high. Opponent pounced.',question:'How to stop giving free speed-ups?',options:[{text:'Hit harder',correct:false},{text:'Keep every dink below net height at their contact point',correct:true},{text:'Only dink down the line',correct:false},{text:'Speed up before they can',correct:false}],explanation:'A dink that bounces above net height = free invitation to attack.'},
  { skill:'pr3',cat:'Prophylaxis',diff:2,question:'Between shots at the kitchen, where should your paddle be?',options:[{text:'Down by your side',correct:false},{text:'Up in front of your chest, ready',correct:true},{text:'Behind your body for backswing',correct:false},{text:'Doesn\'t matter',correct:false}],explanation:'Paddle up = millisecond reaction time. Paddle down = always late. Easiest free improvement.'},
  { skill:'pr4',cat:'Prophylaxis',diff:3,scenario:'Opponent loves sharp cross-court angles. Keeps pulling you wide.',question:'How to prophylactically remove that option?',options:[{text:'Hit everything down the line',correct:false},{text:'Position to cut off the cross-court angle',correct:true},{text:'Stand further from net',correct:false},{text:'Just move faster',correct:false}],explanation:'Shade cross-court — their favorite angle is covered, forced into second-best option.'},
  { skill:'pa1',cat:'Reads',diff:3,scenario:'Opponent about to hit a dink. You want to predict direction.',question:'What should you watch?',options:[{text:'Their eyes',correct:false},{text:'Their paddle angle',correct:true},{text:'Their feet',correct:false},{text:'The ball only',correct:false}],explanation:'Paddle angle = trajectory. Open face = lifting. Closed = driving. Most reliable read.'},
  { skill:'pa2',cat:'Reads',diff:3,scenario:'Opponent at baseline about to hit third shot. Drop or drive?',question:'What body cue gives it away?',options:[{text:'How loud they grunt',correct:false},{text:'Weight shift and shoulder turn — big load = drive, soft = drop',correct:true},{text:'Which foot is forward',correct:false},{text:'You can\'t tell',correct:false}],explanation:'Drive requires loading weight and rotation. Drop is softer. Read the body.'},
  { skill:'pa3',cat:'Reads',diff:3,scenario:'Cross-court dink rally. 4 dinks in a row, last one shorter.',question:'What should you anticipate?',options:[{text:'Another dink',correct:false},{text:'A speed-up is coming',correct:true},{text:'A lob',correct:false},{text:'Switch to down the line',correct:false}],explanation:'Repeated dinks + shorter ball = speed-up setup. Paddle up, be ready.'},
  { skill:'ad1',cat:'Adaptation',diff:2,scenario:'Early in the match — game 1.',question:'What should you prioritize?',options:[{text:'Winners to build a lead',correct:false},{text:'Scouting — observe tendencies and weaknesses',correct:true},{text:'Most aggressive style',correct:false},{text:'Being passive',correct:false}],explanation:'First 3 games = scouting. Watch backhand, pace handling, comfort zones.'},
  { skill:'ad2',cat:'Adaptation',diff:3,scenario:'Been attacking opponent\'s backhand. They\'re now protecting it better.',question:'What should you do?',options:[{text:'Keep attacking backhand',correct:false},{text:'Switch to forehand and middle — adjust harder',correct:true},{text:'Take a break',correct:false},{text:'More lobs',correct:false}],explanation:'They adjusted? Adjust harder. Exploit the over-protection — forehand/middle now open.'},
  { skill:'ad3',cat:'Adaptation',diff:3,scenario:'Opponent reads your dinks perfectly every time.',question:'What should you change?',options:[{text:'Hit harder',correct:false},{text:'Keep doing the same',correct:false},{text:'Vary patterns — targets, spin, timing',correct:true},{text:'Stop dinking',correct:false}],explanation:'You\'re too predictable. Vary everything. Unpredictability is a weapon.'},
  { skill:'mt1',cat:'Mental',diff:1,scenario:'You just double-faulted on a crucial point.',question:'What before the next point?',options:[{text:'Replay the error mentally',correct:false},{text:'Reset — last point is dead, next is all',correct:true},{text:'Aggressive serve to make up',correct:false},{text:'Apologize to partner at length',correct:false}],explanation:'Reset after every point. Dwelling carries negative energy. Deep breath, focus forward.'},
  { skill:'mt2',cat:'Mental',diff:2,scenario:'Leading 9-5 in a game to 11.',question:'How to adjust?',options:[{text:'Go for winners to close it',correct:false},{text:'Patient, high-percentage pickleball',correct:true},{text:'Try new shots with the cushion',correct:false},{text:'Speed up every ball',correct:false}],explanation:'Ahead = patient. Make them take risks to catch up. Scoreboard pressure works for you.'},
  { skill:'mt3',cat:'Mental',diff:3,scenario:'Score 9-9. Last two points were unforced errors.',question:'Right mindset?',options:[{text:'Play it safe',correct:false},{text:'Reset and play YOUR game — don\'t tighten up',correct:true},{text:'Go aggressive to end it',correct:false},{text:'Focus on not making errors',correct:false}],explanation:'Play YOUR game. "Not making errors" = negative focus = tentative. Trust your training.'},
];

// Flat skill lookup
export const skillMap: Record<string, Skill & { pillar: Pillar }> = {};
export const allSkillIds: string[] = [];
pillars.forEach((p) =>
  p.groups.forEach((g) =>
    g.skills.forEach((sk) => {
      skillMap[sk.id] = { ...sk, pillar: p };
      allSkillIds.push(sk.id);
    })
  )
);

export const levels = ['', 'Beginner', 'Developing', 'Competent', 'Advanced', 'Elite'];
// Rating ramp from dip semantic tokens: red -> warn -> gold -> greenDark -> green
export const levelColors = ['#64748B', '#DC2626', '#F59E0B', '#C4A33A', '#0B9A6D', '#10B981'];
