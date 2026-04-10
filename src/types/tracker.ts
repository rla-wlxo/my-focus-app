// src/types/tracker.ts

export interface PairingData {
  status: 'waiting' | 'active';
  heartRate: number;
  updatedAt: number;
}

export interface PairingResponse {
  pairingCode: string;
}