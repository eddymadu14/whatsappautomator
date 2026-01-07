
import { http } from "./http";
import type { Template } from "@/types/template";

export const getTemplates = () =>
  http<Template[]>("/templates");

export const createTemplate = (data: Omit<Template, "id">) =>
  http<Template>("/templates", {
    method: "POST",
    body: JSON.stringify(data),
  });

