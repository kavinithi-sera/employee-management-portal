import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { EmployeeService } from './employee';
import { Employee } from '../models/employee.model';

describe('EmployeeService', () => {

  let service: EmployeeService;
  let httpTesting: HttpTestingController;

  const mockEmployees: Employee[] = [

    {
      id: '1',
      employeeCode: 'EMP001',
      name: 'Arun Kumar',
      email: 'arun@company.com',
      phone: '9876543210',
      departmentId: '1',
      designation: 'Software Engineer',
      salary: 65000,
      joiningDate: '2025-01-15',
      active: true
    },

    {
      id: '2',
      employeeCode: 'EMP002',
      name: 'Priya Sharma',
      email: 'priya@company.com',
      phone: '9876543211',
      departmentId: '2',
      designation: 'HR Executive',
      salary: 50000,
      joiningDate: '2024-08-10',
      active: true
    }

  ];


  beforeEach(() => {

    TestBed.configureTestingModule({

      providers: [

        EmployeeService,
        provideHttpClient(),
        provideHttpClientTesting()

      ]

    });


    service = TestBed.inject(EmployeeService);

    httpTesting = TestBed.inject(HttpTestingController);

  });


  it(
    'should get all employees',
    () => {

      service
        .getEmployees()
        .subscribe(employees => {

          expect(employees)
            .toEqual(mockEmployees);

          expect(employees.length)
            .toBe(2);

        });


      const request =
        httpTesting.expectOne(
          'http://localhost:3000/employees'
        );


      expect(request.request.method)
        .toBe('GET');


      request.flush(
        mockEmployees
      );

    }
  );


  it(
    'should get employee by id',
    () => {

      service
        .getEmployeeById('1')
        .subscribe(employee => {

          expect(employee.name)
            .toBe('Arun Kumar');

          expect(employee.id)
            .toBe('1');

        });


      const request =
        httpTesting.expectOne(
          'http://localhost:3000/employees/1'
        );


      expect(request.request.method)
        .toBe('GET');


      request.flush(
        mockEmployees[0]
      );

    }
  );


  it(
    'should delete an employee',
    () => {

      service
        .deleteEmployee('1')
        .subscribe();


      const request =
        httpTesting.expectOne(
          'http://localhost:3000/employees/1'
        );


      expect(request.request.method)
        .toBe('DELETE');


      request.flush(null);

    }
  );


  it(
    'should filter employees by department',
    () => {

      service
        .getEmployeesByDepartmentId('1')
        .subscribe(employees => {

          expect(employees.length)
            .toBe(1);

          expect(employees[0].name)
            .toBe('Arun Kumar');

        });


      const request =
        httpTesting.expectOne(
          'http://localhost:3000/employees'
        );


      request.flush(
        mockEmployees
      );

    }
  );


  afterEach(() => {

    httpTesting.verify();

  });

});
