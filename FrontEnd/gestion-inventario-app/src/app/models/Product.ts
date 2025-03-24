export default interface Product {
    pro_id_producto: number | null;
    pro_nombre: string | null; 
    pro_descripcion: string | null;
    pro_categoria: string | null; 
    pro_imagen: string | null; 
    pro_precio: number | null;
    pro_stock: number | null; 
    pro_estado: number | null;
}