import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  FlatList,
} from 'react-native';

import {
  getEmployees,
  Employee,
} from '../../storage/employeeStorage';

export default function
EmployeeListScreen() {

  const [employees,
  setEmployees] =
    useState<Employee[]>([]);

  useEffect(() => {

    loadEmployees();

  }, []);

  async function
  loadEmployees() {

    const data =
      await getEmployees();

    setEmployees(data);
  }

  return (

    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >

      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        Employee List
      </Text>

      <FlatList
  data={employees}
  keyExtractor={(item, index) =>
    `${item.employeeId}-${index}`
  }
        renderItem={({ item }) => (

          <View
            style={{
              marginBottom: 20,
              padding: 15,
              borderWidth: 1,
            }}
          >

            <Text>
              ID: {item.employeeId}
            </Text>

            <Text>
              Name: {item.employeeName}
            </Text>

            <Text>
  Width:
  {item.photoWidth}
</Text>

<Text>
  Height:
  {item.photoHeight}
</Text>
<Text
  style={{
    marginTop: 10,
    fontWeight: 'bold',
    color:
      item.networkMode === 'ONLINE'
        ? 'green'
        : 'orange',
  }}
>
  Network: {item.networkMode}
</Text>
        <Text
  style={{
    marginTop: 10,
    fontWeight: 'bold',
    color:
      item.syncStatus === 'SYNCED'
        ? 'green'
        : 'orange',
  }}
>
  Status: {item.syncStatus}
</Text>
          </View>

        )}
      />

    </View>
  );
}