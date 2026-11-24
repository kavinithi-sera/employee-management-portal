import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Department } from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private readonly apiUrl =
    'http://localhost:3000/departments';

  constructor(
    private http: HttpClient
  ) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(
      this.apiUrl
    );
  }

  getDepartmentById(id: string): Observable<Department> {
    return this.http.get<Department>(
      `${this.apiUrl}/${id}`
    );
  }

  addDepartment(department: Omit<Department, 'id'>): Observable<Department> {
    return this.http.post<Department>(
      this.apiUrl,
      department
    );
  }

  updateDepartment(department: Department): Observable<Department> {
    return this.http.put<Department>(
      `${this.apiUrl}/${department.id}`,
      department
    );
  }

  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

}