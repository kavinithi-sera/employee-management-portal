import {
  Component,
  Inject,
  OnInit
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  Department
} from '../../models/department.model';

import {
  DepartmentService
} from '../../services/department';

@Component({
  selector: 'app-department-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './department-form-dialog.html',
  styleUrl: './department-form-dialog.scss'
})
export class DepartmentFormDialog implements OnInit {

  isEditMode = false;

  departmentForm = new FormGroup({

    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2)
      ]
    }),

    location: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2)
      ]
    })

  });

  constructor(
    private departmentService: DepartmentService,

    private dialogRef:
      MatDialogRef<DepartmentFormDialog>,

    @Inject(MAT_DIALOG_DATA)
    public data: Department | null
  ) {}

  ngOnInit(): void {

    if (this.data) {

      this.isEditMode = true;

      this.departmentForm.patchValue({
        name: this.data.name,
        location: this.data.location
      });

    }

  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {

    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.departmentForm.getRawValue();

    if (this.isEditMode && this.data) {

      const updatedDepartment: Department = {
        ...this.data,
        ...formValue
      };

      this.departmentService
        .updateDepartment(updatedDepartment)
        .subscribe({

          next: (department) => {
            this.dialogRef.close(department);
          },

          error: (error) => {
            console.error(
              'Failed to update department:',
              error
            );
          }

        });

    } else {

      const newDepartment:
        Omit<Department, 'id'> = {

        name: formValue.name,
        location: formValue.location

      };

      this.departmentService
        .addDepartment(newDepartment)
        .subscribe({

          next: (department) => {
            this.dialogRef.close(department);
          },

          error: (error) => {
            console.error(
              'Failed to add department:',
              error
            );
          }

        });

    }

  }
}