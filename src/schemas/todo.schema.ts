import { boolean, object, string } from "zod";

export const TODO_CONTENT_MAX_CHARS = 50;

export const todoSchema = object({
  content: string()
    .trim()
    .min(1, "Todo content is required!")
    .max(
      TODO_CONTENT_MAX_CHARS,
      "Todo content must contain at most 50 characters"
    ),
  isFavorite: boolean(),
});
