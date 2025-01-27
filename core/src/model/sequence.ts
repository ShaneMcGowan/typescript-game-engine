/**
 * Sequences can be used to set up complex logic flows of game logic.
 */

export type Next = () => void
export type Step = (next: Next | undefined) => void;
export type Sequence = Step[];

export const Run = (sequence: Sequence): void => {
  _Run(undefined, sequence);
};

const _Run = (next: Next, sequence: Sequence): void => {
  const step = sequence.pop();

  if (step === undefined) {
    next();
  } else {
    _Run(() => { step(next); }, sequence);
  }
};

/*
// example

const step1: Step = (next: Next): void => {
  next();
};

const step2: Step = (next: Next): void => {
  next();
};

const step3: Step = (): void => {
  // no next as is last step
};

const sequence: Sequence = [
  step1,
  step2,
  step3,
];

Run(sequence);

*/
