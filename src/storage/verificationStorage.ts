import AsyncStorage from '@react-native-async-storage/async-storage';

const VERIFICATION_KEY =
  'VERIFICATIONS';

export interface VerificationRecord {
  employeeId: string;
  employeeName: string;
  verifiedAt: string;
  livenessPassed: boolean;
}

export async function saveVerification(
  record: VerificationRecord,
) {

  const records =
    await getVerifications();

  records.push(record);

  await AsyncStorage.setItem(
    VERIFICATION_KEY,
    JSON.stringify(records),
  );
}

export async function getVerifications():
Promise<VerificationRecord[]> {

  const data =
    await AsyncStorage.getItem(
      VERIFICATION_KEY,
    );

  return data
    ? JSON.parse(data)
    : [];
}