// src/types/settings.ts

/**
 * Raw settings as stored & returned by backend
 * NOTE: values are strings because backend persists them that way
 */
export interface Settings {
  /** Automation */
  auto_reply_enabled?: "true" | "false";

  /**
   * JSON stringified array
   * Example: '["price","buy","order"]'
   */
  serious_keywords?: string;

  /** Business hours */
  business_hours_enabled?: "true" | "false";
  business_hours_start?: string; // "09:00"
  business_hours_end?: string;   // "18:00"

  /**
   * Allow backend to add new settings
   * without breaking frontend
   */
  [key: string]: string | undefined;
}