// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';


export const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employee/new', component: EmployeeFormComponent },
  { path: 'employee/:id', component: EmployeeFormComponent },
  { path: 'upload', component: ImageUploadComponent },
  { path: '**', redirectTo: '/employees' } // Wildcard route for a 404 page
];
