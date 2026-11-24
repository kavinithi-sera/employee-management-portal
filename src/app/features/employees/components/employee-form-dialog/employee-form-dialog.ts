import { Component, Inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Department
} from '../../../departments/models/department.model';

import {
  DepartmentService
} from '../../../departments/services/department';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './employee-form-dialog.html',
  styleUrl: './employee-form-dialog.scss'
})
export class EmployeeFormDialog implements OnInit {

  isEditMode = false;

  departments = signal<Department[]>([]);

  employeeForm = new FormGroup({

    employeeCode: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    }),

    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ]
    }),

    phone: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    departmentId: new FormControl<string | null>(
      null,
      Validators.required
    ),

    designation: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    salary: new FormControl<number | null>(
      null,
      [
        Validators.required,
        Validators.min(1)
      ]
    ),

    joiningDate: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    active: new FormControl(true, {
      nonNullable: true
    })

  });

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private dialogRef: MatDialogRef<EmployeeFormDialog>,

    @Inject(MAT_DIALOG_DATA)
    public data: Employee | null
  ) {}

  ngOnInit(): void {

    this.loadDepartments();

    if (this.data) {

      this.isEditMode = true;

      this.employeeForm.patchValue({
        employeeCode: this.data.employeeCode,
        name: this.data.name,
        email: this.data.email,
        phone: this.data.phone,
        departmentId: this.data.departmentId,
        designation: this.data.designation,
        salary: this.data.salary,
        joiningDate: this.data.joiningDate,
        active: this.data.active
      });

    }

  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formValue = this.employeeForm.getRawValue();

    if (this.isEditMode && this.data) {

      const updatedEmployee: Employee = {
        ...this.data,
        ...formValue,
        departmentId: formValue.departmentId!,
        salary: formValue.salary!
      };

      this.employeeService
        .updateEmployee(updatedEmployee)
        .subscribe({

          next: (employee) => {
            this.dialogRef.close(employee);
          },

          error: (error) => {
            console.error(
              'Failed to update employee:',
              error
            );
          }

        });

    } else {

      const newEmployee: Employee = {
        id: '',
        ...formValue,

        departmentId: formValue.departmentId!,
        salary: formValue.salary!
      };

      this.employeeService
        .addEmployee(newEmployee)
        .subscribe({

          next: (employee) => {
            this.dialogRef.close(employee);
          },

          error: (error) => {
            console.error(
              'Failed to add employee:',
              error
            );
          }

        });

    }

  }

  loadDepartments(): void {

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
        }

      });

  }

}