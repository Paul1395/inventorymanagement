
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductService } from "../../services/product.service";
import Product from "../../models/Product";
import { ProductAddComponent } from "./product-add/product-add.component";
import { MatDialog } from '@angular/material/dialog';
import { ProductEditComponent } from "./product-edit/product-edit.component";
import { ConfirmDeleteDialogComponent } from "../common/confirm-delete-dialog/confirm-delete-dialog.component";


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [HeaderComponent,
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatSnackBarModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
	
	//#region Values
  	dataSource = new MatTableDataSource<Product>([]);
  	displayedColumns: string[] = ['pro_id_producto', 'pro_nombre','pro_descripcion','pro_categoria','pro_imagen','pro_precio','pro_stock','pro_estado','actions'];
  	@ViewChild(MatPaginator) paginator!: MatPaginator; 
 	//#endregion

  	constructor(public productService: ProductService,
	public dialog: MatDialog,
	private snackBar: MatSnackBar){

	}

 	ngOnInit(): void {
    	this.getProducts();
  	}

 	getProducts(){
		this.productService.getProduct().subscribe({
		  next: (dataProduct) => {
			this.dataSource.data = dataProduct;
		  },
		  error:(e)=>{
			console.log('Error en la peticion getProducts ->', e.mensaje)
		  }
		});
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}

	openCreateDialog(): void {
		const dialogRef = this.dialog.open(ProductAddComponent, {
		  width: '400px', 
		});
	
		dialogRef.afterClosed().subscribe(result => {
		  if (result === 'ok') { 
			this.getProducts();
		  }
		});
	}
	openEditDialog(element: ProductElement): void{
		const dialogRef = this.dialog.open(ProductEditComponent, {
			width: '400px',
			data: element
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result === 'ok') { 
			  this.getProducts();
			}
		  });
	}

	openDeleteDialog(element: number): void {
		const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
			width: '400px',
			data: {modulo:'product', id: element}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result === 'ok') { 
			  this.getProducts();
			  this.notification("Producto eliminado");
			}
		  });
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

export interface ProductElement {
	id: number;
	nombre: string;
	descripcion: string;
	categoria: string ;
	imagen: string;
	precio: number;
	stock: number;
}
