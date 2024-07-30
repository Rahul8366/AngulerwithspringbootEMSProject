// src/app/models/employee.model.ts
export interface Employee {
    id: number;
    name: string;
    position: string;
    salary: number;
    email: string;
    imageUrl: string;
    joinedDate: string; // You can use Date type if preferred
  }
  