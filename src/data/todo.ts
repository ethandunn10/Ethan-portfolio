// Anything you haven't filled in yet is TODO('what goes here').
// The page shows a black-and-white placeholder (or hides a button that
// would go nowhere), and `node scripts/build.ts` lists every TODO left.
export type Todo = { todo: string };
export const TODO = (note: string): Todo => ({ todo: note });
export const isTodo = (v: unknown): v is Todo =>
  typeof v === 'object' && v !== null && 'todo' in (v as object);
export type Maybe<T> = T | Todo;
