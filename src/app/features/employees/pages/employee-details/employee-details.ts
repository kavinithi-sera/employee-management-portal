import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee';

import { Department } from '../../../departments/models/department.model';
import { DepartmentService } from '../../../departments/services/department';

import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { ErrorState } from '../../../../shared/components/error-state/error-state';

@Component({
  selector: 'app-employee-details',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    LoadingState,
    ErrorState
  ],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.scss'
})
export class EmployeeDetails implements OnInit {

  employee = signal<Employee | null>(null);
  department = signal<Department | null>(null);

  isLoading = signal(false);

  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('Employee ID is missing.');
      return;
    }

    this.loadEmployee(id);
  }

  loadEmployee(id: string): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.employeeService
      .getEmployeeById(id)
      .subscribe({

        next: (employee) => {
          this.employee.set(employee);
          this.loadDepartment(employee.departmentId);
          this.isLoading.set(false);
        },

        error: (error) => {
          console.error(
            'Failed to load employee:',
            error
          );

          this.employee.set(null);
          this.errorMessage.set(
            'Unable to load employee details.'
          );

          this.isLoading.set(false);
        }

      });
  }

  loadDepartment(departmentId: string): void {

    this.departmentService
      .getDepartmentById(departmentId)
      .subscribe({

        next: (department) => {
          this.department.set(department);
        },

        error: (error) => {
          console.error(
            'Failed to load department:',
            error
          );

          this.department.set(null);
        }

      });

  }
}