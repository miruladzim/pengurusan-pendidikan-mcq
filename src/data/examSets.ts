import set1 from "./exam-sets/set-1.json";
import set2 from "./exam-sets/set-2.json";
import set3 from "./exam-sets/set-3.json";
import set4 from "./exam-sets/set-4.json";
import set5 from "./exam-sets/set-5.json";
import type { Question } from "../types/exam";

export const EXAM_SETS: Record<number, Question[]> = {
  1: set1 as Question[],
  2: set2 as Question[],
  3: set3 as Question[],
  4: set4 as Question[],
  5: set5 as Question[],
};

export function getExamSet(setId: number): Question[] {
  return EXAM_SETS[setId] ?? [];
}
