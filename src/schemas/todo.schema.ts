import { boolean, object, string } from "zod";

export const todoSchema = object({
  content: string()
    .min(1, "Todo content is required!")
    .max(50, "Todo content must contain at most 50 characters"),
  isFavorite: boolean(),
});
