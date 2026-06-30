export interface SystemLogEntry {
  timestamp: string;
  eventType: string;
  description: string;
  hash: string;
}

export interface TransmissionAnalysis {
  classification: string;
  threatLevel: "LOW" | "MEDIUM" | "HIGH";
  decryptedResponse: string;
  hexAck: string;
  acknowledgement: string;
}

export interface TransmissionResponse {
  success: boolean;
  analysis: TransmissionAnalysis;
  logEntry: SystemLogEntry;
  offlineFallback?: boolean;
}

export type ActiveTab = "index" | "tech_stack" | "transmission";
