import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import {
  beforeEach,
  describe,
  expect,
  it
} from 'vitest';

import { Dashboard } from './dashboard';
import { EmployeeService } from '../../../employees/services/employee';
import { DepartmentService } from '../../../departments/services/department';

describe('Dashboard', () => {

  let component: Dashboard;


  const employeeServiceMock = {

    getEmployees: () =>
      of([])

  };


  const departmentServiceMock = {

    getDepartments: () =>
      of([])

  };


  beforeEach(() => {

    TestBed.configureTestingModule({

      imports: [
        Dashboard
      ],

      providers: [

        {
          provide: EmployeeService,
          useValue: employeeServiceMock
        },

        {
          provide: DepartmentService,
          useValue: departmentServiceMock
        }

      ]

    });


    const fixture =
      TestBed.createComponent(
        Dashboard
      );


    component =
      fixture.componentInstance;

  });


  it(
    'should calculate employee statistics',
    () => {

      component.employees.set([

        {
          id: '1',
          employeeCode: 'EMP001',
          name: 'Employee One',
          email: 'one@test.com',
          phone: '1111111111',
          departmentId: '1',
          designation: 'Developer',
          salary: 60000,
          joiningDate: '2025-01-01',
          active: true
        },

        {
          id: '2',
          employeeCode: 'EMP002',
          name: 'Employee Two',
          email: 'two@test.com',
          phone: '2222222222',
          departmentId: '2',
          designation: 'Analyst',
          salary: 40000,
          joiningDate: '2025-02-01',
          active: false
        }

      ]);


      expect(
        component.totalEmployees()
      ).toBe(2);


      expect(
        component.activeEmployees()
      ).toBe(1);


      expect(
        component.inactiveEmployees()
      ).toBe(1);


      expect(
        component.totalPayroll()
      ).toBe(100000);


      expect(
        component.averageSalary()
      ).toBe(50000);

    }
  );

});