import { Component, OnInit, signal} from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Department } from '../../models/department.model';
import { DepartmentService } from '../../services/department';
import { DepartmentFormDialog } from '../../components/department-form-dialog/department-form-dialog';

import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { ErrorState } from '../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

import { EmployeeService } from '../../../employees/services/employee';

@Component({
  selector: 'app-department-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    LoadingState,
    ErrorState,
    EmptyState
  ],
  templateUrl: './department-list.html',
  styleUrl: './department-list.scss'
})
export class DepartmentList implements OnInit {

  departments = signal<Department[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');

  displayedColumns: string[] = [
    'id',
    'name',
    'location',
    'actions'
  ];

  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}



  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.departmentService
      .getDepartments()
      .subscribe({

        next: (departments) => {
          this.departments.set(departments);
          this.isLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Failed to load departments:',
            error
          );

          this.departments.set([]);

          this.errorMessage.set(
            'Unable to load departments.'
          );

          this.isLoading.set(false);
        }

      });

  }

  addDepartment(): void {

    const dialogRef =
      this.dialog.open(
        DepartmentFormDialog,
        {
          width: '500px',
          data: null
        }
      );

    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (!result) {
          return;
        }

        this.snackBar.open(
          'Department added successfully.',
          'Close',
          {
            duration: 3000
          }
        );

        this.loadDepartments();

      });

  }

  editDepartment(
    department: Department
  ): void {

    const dialogRef =
      this.dialog.open(
        DepartmentFormDialog,
        {
          width: '500px',
          data: department
        }
      );

    dialogRef
      .afterClosed()
      .subscribe(result => {

        if (!result) {
          return;
        }

        this.snackBar.open(
          'Department updated successfully.',
          'Close',
          {
            duration: 3000
          }
        );

        this.loadDepartments();

      });

  }

  departmentBeingChecked = signal<string | null>(null);

  deleteDepartment(department: Department): void {

    this.departmentBeingChecked.set(department.id);

    this.employeeService
      .getEmployeesByDepartmentId(
        department.id
      )
      .subscribe({

        next: (employees) => {

          this.departmentBeingChecked.set(
            null
          );

          if (employees.length > 0) {

            this.snackBar.open(
              `${department.name} cannot be deleted because ${employees.length} employee(s) are assigned to it.`,
              'Close',
              {
                duration: 5000
              }
            );

            return;
          }

          this.openDeleteConfirmation(
            department
          );
        },

        error: (error) => {

          this.departmentBeingChecked.set(
            null
          );

          console.error(
            'Failed to check department employees:',
            error
          );

          this.snackBar.open(
            'Unable to verify whether this department can be deleted.',
            'Close',
            {
              duration: 4000
            }
          );

        }

      });

  }

  private openDeleteConfirmation(department: Department): void {

    const dialogRef =
      this.dialog.open(
        ConfirmDialog,
        {
          width: '400px',

          data: {
            title: 'Delete Department',

            message:
              `Are you sure you want to delete ${department.name}?`,

            confirmText: 'Delete'
          }
        }
      );

    dialogRef
      .afterClosed()
      .subscribe(confirmed => {

        if (!confirmed) {
          return;
        }

        this.performDepartmentDeletion(
          department
        );

      });

  }

  private performDepartmentDeletion(department: Department): void {

    this.departmentService
      .deleteDepartment(
        department.id
      )
      .subscribe({

        next: () => {

          this.snackBar.open(
            'Department deleted successfully.',
            'Close',
            {
              duration: 3000
            }
          );

          this.loadDepartments();
        },

        error: (error) => {

          console.error(
            'Failed to delete department:',
            error
          );

          this.snackBar.open(
            'Unable to delete department.',
            'Close',
            {
              duration: 3000
            }
          );

        }

      });

  }

}