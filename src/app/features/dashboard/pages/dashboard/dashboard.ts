import { Component, OnInit, computed, signal } from '@angular/core';

import { CurrencyPipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Employee } from '../../../employees/models/employee.model';
import { EmployeeService } from '../../../employees/services/employee';

import { Department } from '../../../departments/models/department.model';
import { DepartmentService } from '../../../departments/services/department';

import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { ErrorState } from '../../../../shared/components/error-state/error-state';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatIconModule,
    CurrencyPipe,
    LoadingState,
    ErrorState
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  employees = signal<Employee[]>([]);

  departments = signal<Department[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');


  totalEmployees = computed(
    () => this.employees().length
  );


  activeEmployees = computed(
    () =>
      this.employees()
        .filter(employee => employee.active)
        .length
  );


  inactiveEmployees = computed(
    () =>
      this.employees()
        .filter(employee => !employee.active)
        .length
  );


  totalDepartments = computed(
    () => this.departments().length
  );


  totalPayroll = computed(
    () =>
      this.employees()
        .reduce(
          (total, employee) =>
            total + employee.salary,
          0
        )
  );

  averageSalary = computed(() => {
    const employees = this.employees();

    if (employees.length === 0){
      return 0;
    }

    const totalSalary = employees.reduce(
      (total, employee) => total + employee.salary, 
      0
    );

    return totalSalary / employees.length;
  })


  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {}


  ngOnInit(): void {
    this.loadDashboardData();
  }


  loadDashboardData(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.employeeService
      .getEmployees()
      .subscribe({

        next: (employees) => {
          this.employees.set(employees);
          this.finishLoading();
        },

        error: (error) => {

          console.error(
            'Failed to load employees:',
            error
          );

          this.errorMessage.set(
            'Unable to load dashboard data.'
          );

          this.isLoading.set(false);
        }

      });


    this.departmentService
      .getDepartments()
      .subscribe({

        next: (departments) => {
          this.departments.set(departments);
        },

        error: (error) => {

          console.error(
            'Failed to load departments:',
            error
          );

          this.errorMessage.set(
            'Unable to load dashboard data.'
          );

          this.isLoading.set(false);
        }

      });

  }


  private finishLoading(): void {
    this.isLoading.set(false);
  }

}