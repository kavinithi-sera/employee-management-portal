import {
  Component,
  OnInit,
  ViewChild,
  signal
} from '@angular/core';

import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeFormDialog } from '../../components/employee-form-dialog/employee-form-dialog';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

import { LoadingState } from '../../../../shared/components/loading-state/loading-state';
import { ErrorState } from '../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-employee-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    LoadingState,
    ErrorState,
    EmptyState
  ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss'
})
export class EmployeeList implements OnInit {

  employees = signal<Employee[]>([]);
  errorMessage = signal('');
  isLoading = signal(false);

  displayedColumns: string[] = [
    'employeeCode',
    'name',
    'email',
    'designation',
    'salary',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<Employee>([]);

  @ViewChild(MatSort)
  set matSort(sort: MatSort) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  @ViewChild(MatPaginator)
  set matPaginator(paginator: MatPaginator) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.employeeService.getEmployees().subscribe({

      next: (employees) => {
        console.log('Employees received:', employees);

        this.employees.set(employees);

        this.dataSource.data = employees;

        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Component received error:', error);

        this.employees.set([]);
        this.errorMessage.set('Unable to load employees.');
        this.isLoading.set(false);
      }

    });
  }

  applyFilter(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const value =
      input.value.trim().toLowerCase();

    this.dataSource.filter = value;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  clearFilter(input: HTMLInputElement): void {

    input.value = ''; 

    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  editEmployee(employee: Employee): void {

    const dialogRef =
      this.dialog.open(EmployeeFormDialog, {

        width: '700px',
        data: employee

      });

    dialogRef.afterClosed().subscribe(
      result => {

        if (result) {

          this.snackBar.open(
            'Employee updated successfully.',
            'Close',
            {
              duration: 3000
            }
          );

          this.loadEmployees();
        }

      }
    );

  }

  addEmployee(): void {

    const dialogRef =
      this.dialog.open(EmployeeFormDialog, {
        width: '700px',
        data: null
      });

    dialogRef.afterClosed().subscribe(
      result => {

        if (result) {

          this.snackBar.open(
            'Employee added successfully.',
            'Close',
            {
              duration: 3000
            }
          );

          this.loadEmployees();
        }

      }
    );

  }

  deleteEmployee(employee: Employee): void {

    const dialogRef = this.dialog.open(
      ConfirmDialog,
      {
        width: '400px',

        data: {
          title: 'Delete Employee',
          message: `Are you sure you want to delete ${employee.name}?`,
          confirmText: 'Delete'
        }
      }
    );

    dialogRef.afterClosed().subscribe(
      confirmed => {

        if (!confirmed) {
          return;
        }

        this.employeeService
          .deleteEmployee(employee.id)
          .subscribe({

            next: () => {

              this.snackBar.open(
                'Employee deleted successfully.',
                'Close',
                {
                  duration: 3000
                }
              );

              this.loadEmployees();
            },

            error: (error) => {

              console.error(
                'Failed to delete employee:',
                error
              );

              this.snackBar.open(
                'Unable to delete employee.',
                'Close',
                {
                  duration: 3000
                }
              );

            }

          });

      }
    );
  }

}