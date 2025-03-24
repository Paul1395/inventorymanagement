import { Component, NgModule, OnInit  } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import Product from '../../../models/Product';
import { TransactionService } from '../../../services/transaction.service';
import Transaction from '../../../models/Transaction';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    CommonModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent implements OnInit {
    //#region Values
    productos: Product[] = [];
    selectedProducto: any = null;
    cantidad: number = 1; 
    stockDisponible: number = 0;
    precioUnitario: number = 0;
    precioTotal: number = 0;
    detalle: string = '';
    botonHabilitar: boolean = false;
    mensajeError: string = '';
    //#endregion
  

  constructor(private productService: ProductService,
              private snackBar: MatSnackBar,
              private transactionService: TransactionService){}

  ngOnInit(): void {
    this.getProducts();
    this.resetForm();
  }

  getProducts(){
		this.productService.getProduct().subscribe({
		  next: (respuestaProducto) => {
      this.productos=respuestaProducto;
		  },
		  error:(e)=>{
			console.log("Error al realizar la peticion "+ e)
		  }
		});
	}

  onProductoChange(): void {
    if (this.selectedProducto) 
    {
      this.stockDisponible = this.selectedProducto.pro_stock;
      this.precioUnitario = this.selectedProducto.pro_precio;
      this.cantidad = 1;
      this.calculateTotalPrice();
    }
  }

  calculateTotalPrice(): void {
    this.precioTotal = this.precioUnitario * this.cantidad;
  }
  
  onCantidadChange(): void {
    this.formValidation();
    this.calculateTotalPrice(); 
  }

  formValidation(): void {
    if (!this.selectedProducto) {
      this.botonHabilitar = true;
      this.mensajeError = 'Por favor, selecciona un producto.';
    } else if (this.cantidad > this.stockDisponible) {
      this.botonHabilitar = true;
      this.mensajeError = 'La cantidad seleccionada supera el stock disponible.';
    } else {
      this.botonHabilitar = false;
      this.mensajeError = '';
    }
  }

  submitSale(): void{
    if (this.selectedProducto && this.cantidad > 0) {
      const transactionData: Transaction = {
        ProductoId: this.selectedProducto.pro_id_producto,
        Cantidad: this.cantidad,
        PrecioUnitario: this.precioUnitario,
        PrecioTotal: this.precioTotal,
        Detalle: this.detalle,
        Tipo:"V"
      };
      this,this.transactionService.createTransaction(transactionData).subscribe({
        next: (dataResponseProduct) => {
          this.notification("Venta realizado correctamente")
        },
        error:(e)=>{
          this.notification("Existio problemas al completar la compra");
        }
      });
    }
    this.resetForm(); 
  }

  notification(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 9000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

  resetForm() {
    this.selectedProducto = null;
    this.cantidad = 1;
    this.stockDisponible = 0;
    this.precioUnitario = 0;
    this.precioTotal = 0;
    this.detalle = '';
    this.mensajeError = '';
    this.botonHabilitar = false;
  }
}
