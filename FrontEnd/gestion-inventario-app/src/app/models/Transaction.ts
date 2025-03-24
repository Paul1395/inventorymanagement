export default interface Transaction {
    ProductoId:number | null; 
    Tipo: string | null; 
    Cantidad: number | null;
    PrecioUnitario : number | null;
    PrecioTotal : number | null;
    Detalle: string | null; 	

}