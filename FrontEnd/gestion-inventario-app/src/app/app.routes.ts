import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { TransactionHistoryComponent } from './pages/transaction/transaction-history/transaction-history.component';
import { TransactionComponent } from './pages/transaction/transaction/transaction.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'Producto',component:ProductComponent},
    {path: 'Transaccion', component:TransactionComponent},
    {path: 'Historial', component:TransactionHistoryComponent}
];
