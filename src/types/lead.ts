// src/types/lead.ts

export type LeadStatus =
  | "pending"
  | "contacted"
  | "converted"
  | "cold";

export interface Lead {
  /** MongoDB ID */
  _id: string;

  /** Basic identity */
  name?: string;
  phone: string;

  /** Message content */
  message?: string;

  /** Auto-reply / keyword intelligence */
  triggerKeyword?: string;
  matchedSynonym?: string;
  keywordHitCount?: number;

  /** Lead qualification */
  isSerious?: boolean;

  /** Lifecycle */
  status: LeadStatus;

  /** Timestamps */
  createdAt: string;            // ISO string from backend
  lastInteractionAt?: string;   // ISO string (optional)
}