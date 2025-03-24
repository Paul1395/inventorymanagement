import { Component, Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  selector: 'app-product-edit',
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
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent {

    //#region Value
    id: number = 0;
    nombre: string = "";
    descripcion: string = "";;
    categoria: string = ""; ;
    imagen: string = "";;
    precio: number = 0;
    stock: number =0;
    //#endregion

    constructor(public productService: ProductService,
              public dialogRef: MatDialogRef<ProductEditComponent>,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any)
    {
      this.id = data.pro_id_producto;
		  this.nombre = data.pro_nombre;
		  this.descripcion = data.pro_descripcion
		  this.categoria = data.pro_categoria;
      this.imagen = data.pro_imagen
      this.precio = data.pro_precio
      this.stock = data.pro_stock

    }

    onCancel(): void {
      this.dialogRef.close();
    }

    onSave(): void {

      const productoActualizado : Product = {
        pro_id_producto: this.id,
        pro_nombre :this.nombre, 
        pro_descripcion : this.descripcion,
        pro_categoria : this.categoria,
        pro_imagen : this.imagen, 
        pro_precio : this.precio,
        pro_stock : this.stock ,
        pro_estado : 1
      };
  
      this.productService.editProduct(productoActualizado).subscribe({
        next: (dataResponseProduct) => {
          this.notification("Producto actualizado correctamente")
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
