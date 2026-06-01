import AsyncStorage from '@react-native-async-storage/async-storage';

const EMPLOYEE_KEY = 'EMPLOYEES';

export interface Employee {
  employeeId: string;
  employeeName: string;
  registeredAt: string;
}

export async function saveEmployee(
  employee: Employee,
) {
  const employees =
    await getEmployees();

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