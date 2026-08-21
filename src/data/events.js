import { getEventTrackPositions } from '../utils/trackLayout';

// Content for the first 3 events is real; 04-08 are placeholders in the
// same shape so the track/UI can be built and tested against the full
// count of 8. Swap placeholder copy in-place when real content lands —
// nothing else needs to change since z/side are computed below.
const CONTENT = [
  {
    type: 'Competitive Programming',
    title: 'CODE CARNAGE',
    description:
      'Speed and logic collide. Solve, debug, and survive the clock in a head-to-head coding showdown.',
    date: '12 Oct 2026',
    team: '1–2',
    fee: '₹150',
    prize: '₹10,000',
  },
  {
    type: 'UI/UX Design Challenge',
    title: 'DESIGN REALM',
    description:
      'Shape an interface worth remembering, under a ticking clock and a brief that changes halfway through.',
    date: '12 Oct 2026',
    team: '1–3',
    fee: '₹100',
    prize: '₹8,000',
  },
  {
    type: 'Technical Challenge',
    title: 'TECH MAELSTROM',
    description:
      'Rapid-fire rounds across CS fundamentals, real systems, and problems that punish guesswork.',
    date: '13 Oct 2026',
    team: '2–4',
    fee: '₹200',
    prize: '₹12,000',
  },
  {
    type: 'TBD',
    title: 'EVENT 04',
    description: 'Placeholder — swap in real content when it lands.',
    date: 'TBD',
    team: 'TBD',
    fee: 'TBD',
    prize: 'TBD',
  },
  {
    type: 'TBD',
    title: 'EVENT 05',
    description: 'Placeholder — swap in real content when it lands.',
    date: 'TBD',
    team: 'TBD',
    fee: 'TBD',
    prize: 'TBD',
  },
  {
    type: 'TBD',
    title: 'EVENT 06',
    description: 'Placeholder — swap in real content when it lands.',
    date: 'TBD',
    team: 'TBD',
    fee: 'TBD',
    prize: 'TBD',
  },
  {
    type: 'TBD',
    title: 'EVENT 07',
    description: 'Placeholder — swap in real content when it lands.',
    date: 'TBD',
    team: 'TBD',
    fee: 'TBD',
    prize: 'TBD',
  },
  {
    type: 'TBD',
    title: 'EVENT 08',
    description: 'Placeholder — swap in real content when it lands.',
    date: 'TBD',
    team: 'TBD',
    fee: 'TBD',
    prize: 'TBD',
  },
];

const positions = getEventTrackPositions();

export const events = CONTENT.map((content, i) => ({
  id: i + 1,
  code: String(i + 1).padStart(2, '0'),
  z: positions[i].z,
  side: positions[i].side,
  facingY: positions[i].facingY,
  ...content,
}));

export const journeyStops = ['GATE', ...events.map((e) => `EVENT ${e.code}`), 'FINALE'];