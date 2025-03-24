import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { BuyingComponent } from "../buying/buying.component";
import { SaleComponent } from "../sale/sale.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [BuyingComponent,
           SaleComponent,
           HeaderComponent,
           CommonModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent {

  //#region Value
  buying: boolean = false;
  sale: boolean = false;
  //#endregion

  openBuying() {
    this.buying = true;
    this.sale = false;
  }

  openSale() {
    this.sale = true;
    this.buying = false;
  }
}
