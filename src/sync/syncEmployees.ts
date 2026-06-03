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

    console.log(
      'SYNC_SUCCESS'
    );

    await clearEmployees();

    console.log(
      'LOCAL_DATA_PURGED'
    );

  } catch (error) {

    console.log(
      'SYNC_FAILED',
      error
    );

  }

}