export interface VerificationResult {
  verified: boolean;
  confidence: number;
  livenessPassed: boolean;
  mode: 'offline' | 'online';
}