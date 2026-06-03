import AsyncStorage from '@react-native-async-storage/async-storage';

const EMPLOYEE_KEY = 'EMPLOYEES';

export interface Employee {
  employeeId: string;
  employeeName: string;
  registeredAt: string;
  photoWidth: number;
  photoHeight: number;
  embedding: number[];
}

export async function saveEmployee(
  employee: Employee,
) {

  const employees =
    await getEmployees();

  const existingEmployee =
    employees.find(
      e =>
        e.employeeId ===
        employee.employeeId
    );

  if (existingEmployee) {

    throw new Error(
      'Employee ID already exists'
    );

  }

  employees.push(employee);

  await AsyncStorage.setItem(
    EMPLOYEE_KEY,
    JSON.stringify(employees),
  );
}

export async function getEmployees(): Promise<Employee[]> {

  const data =
    await AsyncStorage.getItem(
      EMPLOYEE_KEY,
    );

  return data
    ? JSON.parse(data)
    : [];
}

export async function getEmployeeById(
  employeeId: string,
) {

  const employees =
    await getEmployees();

  return employees.find(
    e =>
      e.employeeId ===
      employeeId
  );

}
export async function clearEmployees() {

  await AsyncStorage.removeItem(
    EMPLOYEE_KEY,
  );

}