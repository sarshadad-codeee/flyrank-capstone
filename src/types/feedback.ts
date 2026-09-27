import { SERVICE_TYPES } from "../../shared/constants.js";

export { SERVICE_TYPES };

export type ServiceType =
  | "Bill installment"
  | "Duplicate bill"
  | "Name / address correction"
  | "Bank query"
  | "High billing complaint"
  | "Other";

export interface FeedbackFormValues {
  consumerNumber: string;
  customerName: string;
  phone: string;
  serviceType: ServiceType | "";
  counterId: string;
  rating: number;
  comments: string;
}

export interface FeedbackPayload {
  consumerNumber: string;
  customerName: string;
  phone: string;
  serviceType: ServiceType;
  counterId: string;
  rating: number;
  comments: string;
}

export type FormErrors = Partial<Record<keyof FeedbackFormValues, string>>;
