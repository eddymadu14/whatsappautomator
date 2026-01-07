// src/types/template.ts

export interface Template {
  /** MongoDB ID */
  _id: string;

  /** Display name */
  name: string;

  /** Auto-reply message body */
  content: string;

  /** Trigger keywords */
  keywords?: string[];

  /** Timestamps (from backend) */
  createdAt?: string;
  updatedAt?: string;
}