import clsx from "clsx";
import { ClassNameValue, twMerge } from "tailwind-merge";

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(clsx(inputs));
}

export const toPusherKey = (key: string): string => {
  return key.replace(/:/g, "___");
};

export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIDs = [id1, id2].sort();
  return sortedIDs.join("--");
}
