export const SERVICE_TYPE_VALUES = [
  "installment",
  "duplicate_bill",
  "name_address_correction",
  "bank_query",
  "high_billing",
  "other",
] as const;

export type ServiceType = (typeof SERVICE_TYPE_VALUES)[number];

export interface FeedbackFormValues {
  customerName: string;
  mobileNumber: string;
  consumerNumber: string;
  serviceType: string;
  counter: string;
  rating: number | null;
  comments: string;
}

export interface FeedbackPayload {
  customerName: string;
  mobileNumber: string;
  consumerNumber?: string;
  serviceType: ServiceType;
  counter?: number;
  rating: number;
  comments: string;
}

export type FeedbackField = keyof FeedbackFormValues;

export type FieldErrors = Partial<Record<FeedbackField, string>>;
