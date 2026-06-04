import {
  getEmployees,
  clearEmployees,
} from '../storage/employeeStorage';

export async function syncEmployees() {

  try {

    const employees =
      await getEmployees();

    console.log(
      'SYNC_START'
    );

    console.log(
      'EMPLOYEE_COUNT',
      employees.length
    );

   await new Promise<void>(
  resolve =>
    setTimeout(
      () => resolve(),
      2000
    )
);

    console.log(
      'SIMULATED_AWS_UPLOAD_SUCCESS'
    );

    await clearEmployees();

    console.log(
      'LOCAL_DATA_PURGED'
    );

    return {
      success: true,
      uploaded:
        employees.length,
    };

  } catch (error) {

  console.log(
    'SYNC_FAILED',
    error
  );

  return {
    success: false,
    uploaded: 0,
  };
  }}