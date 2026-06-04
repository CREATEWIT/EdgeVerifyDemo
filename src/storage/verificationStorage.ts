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
export async function purgeOldVerifications() {

  const records =
    await getVerifications();

  const THIRTY_DAYS_MS =
    30 * 24 * 60 * 60 * 1000;

  const now =
    Date.now();

  const filteredRecords =
    records.filter(record => {

      const recordTime =
        new Date(
          record.verifiedAt
        ).getTime();

      return (
        now - recordTime <
        THIRTY_DAYS_MS
      );
    });

  await AsyncStorage.setItem(
    VERIFICATION_KEY,
    JSON.stringify(
      filteredRecords
    ),
  );

  console.log(
    'PURGE_COMPLETE',
    records.length -
    filteredRecords.length,
    'RECORDS_REMOVED'
  );
}