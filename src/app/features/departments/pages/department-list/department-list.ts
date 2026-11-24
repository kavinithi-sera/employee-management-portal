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

@Component({
  selector: 'app-department-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
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

  deleteDepartment(
    department: Department
  ): void {

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

        this.departmentService
          .deleteDepartment(department.id)
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

      });

  }
}