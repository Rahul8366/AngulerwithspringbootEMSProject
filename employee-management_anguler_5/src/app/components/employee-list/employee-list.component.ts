import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FormsModule } from '@angular/forms'; // Add FormsModule for ngModel
import * as XLSX from 'xlsx'; // Import xlsx

declare var bootstrap: any;

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Add FormsModule here
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  displayedEmployees: Employee[] = [];
  searchTerm: string = '';
  selectedMonth: string = '';
  selectedImageUrl: string | null = null;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
      this.filterEmployees(); // Filter employees based on the search term
    });
  }

  deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe(() => {
      this.loadEmployees();
    });
  }

  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  filterEmployees(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    const monthFilter = this.selectedMonth;

    this.displayedEmployees = this.employees.filter(employee => {
      const employeeJoinedDate = this.parseDate(employee.joinedDate);
      const monthMatch = monthFilter ? (employeeJoinedDate.getMonth() + 1).toString() === monthFilter : true;
      return (
        (employee.name.toLowerCase().includes(searchTermLower) ||
        employee.position.toLowerCase().includes(searchTermLower) ||
        employee.salary.toString().toLowerCase().includes(searchTermLower) ||
        employee.email.toLowerCase().includes(searchTermLower) ||
        employee.joinedDate.toLowerCase().includes(searchTermLower)) &&
        monthMatch
      );
    });
  }

  exportPdf(): void {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    let y = margin;

    // Add title
    pdf.setFontSize(16);
    pdf.text('Employee List', margin, y);
    y += 10;

    // Add table headers
    pdf.setFontSize(12);
    const headers = ['Name', 'Position', 'Salary', 'Email', 'Image URL', 'Joined Date'];
    const columnWidths = [20, 20, 20, 40, 60, 30]; // Adjust column widths as needed
    let x = margin;
    headers.forEach((header, i) => {
      pdf.text(header, x, y);
      x += columnWidths[i];
    });
    y += 10;

    // Add table rows with borders
    this.displayedEmployees.forEach(employee => {
      const row = [
        employee.name,
        employee.position,
        employee.salary.toString(),
        employee.email,
        employee.imageUrl || '',
        employee.joinedDate
      ];
      
      // Calculate the height of the row
      const rowHeights = row.map((cell, i) => {
        const cellText = pdf.splitTextToSize(cell, columnWidths[i]);
        return cellText.length * 7; // Approximate height calculation
      });
      const rowHeight = Math.max(...rowHeights);

      // Draw borders and add text
      let x = margin;
      row.forEach((cell, i) => {
        const cellText = pdf.splitTextToSize(cell, columnWidths[i]);
        pdf.text(cellText, x, y);
        pdf.rect(x, y - 8, columnWidths[i], rowHeight); // Draw cell border
        x += columnWidths[i];
      });

      y += rowHeight;
    });

    pdf.save('employee-list.pdf');
  }

  exportExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.displayedEmployees);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'employee-list.xlsx');
  }

  openImageModal(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
