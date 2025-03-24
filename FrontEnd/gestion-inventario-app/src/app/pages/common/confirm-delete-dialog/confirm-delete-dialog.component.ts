import { Component, Inject } from '@angular/core';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrl: './confirm-delete-dialog.component.css'
})
export class ConfirmDeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { modulo: string, id: number },
              private productService: ProductService
    ) { }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if (this.data.modulo === 'product') {
      this.productService.deleteProduct(this.data.id).subscribe({
        next: (dataResponse) => {
          this.dialogRef.close("ok");
        },
        error: (e) => {
          console.error('Error al eliminar usuario:', e);
          this.dialogRef.close(false);
        }
      });
    } 
  }
}
