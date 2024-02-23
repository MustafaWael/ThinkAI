import { atom } from "jotai";

export const asideAtom = atom(false);
export const chatIdAtom = atom<string | "new-chat">("new-chat");
