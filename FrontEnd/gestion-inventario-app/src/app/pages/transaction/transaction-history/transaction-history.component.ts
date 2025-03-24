import { Component, ViewChild} from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';  // Necesario para usar ngModel
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule ,MatTableDataSource } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core'; 
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../services/transaction.service';
import { TransactionHistory } from '../../../models/TransactionHistory';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [HeaderComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatNativeDateModule,
    CommonModule,
    MatTableModule,
    MatPaginator, 
    MatPaginatorModule
  ],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent {
  displayedColumns: string[] = ['index','fecha','tipoTransaccion','nombre', 'cantidad','preciUnitario', 'precioTotal','detalle'];
  transactions= new MatTableDataSource<TransactionHistory>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  fechaInicial: Date | null = null;  
  fechaFin: Date | null = null;  
  tipoTransaccion: string = 'T'; 

  
  constructor(private transactionService: TransactionService,
    private snackBar: MatSnackBar  
  ) {}

  onSearch(): void {
    if (!this.fechaInicial || !this.fechaFin) {
      this.notification('Por favor, selecciona la fecha de incio y fin.');
      return;
    }
    const formattedStartDate = this.formatDate(this.fechaInicial);
    const formattedEndDate = this.formatDate(this.fechaFin);
    this.transactionService.getTransactionHistory(formattedStartDate, formattedEndDate, this.tipoTransaccion)
      .subscribe(
        (data) => {
          this.transactions.data = data;
        },
        (error) => {
          this.snackBar.open('Error al obtener las transacciones. Intenta nuevamente.' + error, 'Cerrar', { duration: 3000 });
        }
      );
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngAfterViewInit() {
		this.transactions.paginator = this.paginator;
	}

  notification(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 9000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }
}
