import { VerificationResult } from '../../types/VerificationResult';

export async function verifyFace(): Promise<VerificationResult> {
  return {
    verified: false,
    confidence: 0,
    livenessPassed: false,
    mode: 'offline',
  };
}