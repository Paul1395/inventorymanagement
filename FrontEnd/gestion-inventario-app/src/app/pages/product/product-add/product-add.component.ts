import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogActions, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Product from '../../../models/Product';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatButtonModule,
		FormsModule,
		MatDialogActions,
		MatDialogTitle,
		MatDialogContent],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent {
  //#region Value
  nombre: string = '';
	descripcion: string = '';
	categoria: string = '';
	imagen: string = '';
	precio: number = 0;
	stock: number = 0;
  //#endregion
  

  constructor(public dialogRef: MatDialogRef<ProductAddComponent>,
              private snackBar: MatSnackBar,
              public productService: ProductService){

  }
  onCancel(): void {
		this.dialogRef.close();
	}

  onSave(): void {

    const productoNuevo : Product = {
      pro_id_producto: 0,
      pro_nombre :this.nombre, 
      pro_descripcion : this.descripcion,
      pro_categoria : this.categoria,
      pro_imagen : this.imagen, 
      pro_precio : this.precio,
      pro_stock : this.stock ,
      pro_estado : 1
    };

    this.productService.createProduct(productoNuevo).subscribe({
		  next: (dataResponseProduct) => {
        this.notification("Producto creado correctamente")
        this.closeModal('ok');
		  },
		  error:(e)=>{
        this.notification("Error al crear el producto");
		  }
		});
	}

  closeModal(result: string) {
    this.dialogRef.close(result);
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
