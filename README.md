# Proyecto de Gestión de Inventario

Este desarrollo como primer parte el frontend desarrollador en angular para la gestionar transacciones, y dos microsservicios (Product y Transaction) en Net Core , ademas, se incluye el script SQL necesario para la creación de la base de datos.


## Estructura del Proyecto

- **BackEnd/**: Contiene los microsservicios `Product` y `Transaction`.
  - **product/**: Microsservicio para gestionar productos.
  - **transaction/**: Microsservicio para gestionar transacciones y consultas.
  
- **FrontEnd/**: Contiene el proyecto de Angular llamado `gestion-inventario-app` para gestionar la interfaz de usuario.
  
- **Inventario.sql**: Script SQL para crear la base de datos, tablas y procedimientos almacenados necesarios en SQL Server.
  
- **Evidencias.docx**: Archivo de evidencia que contiene capturas de pantalla de los modulos.



## Requisitos

### Backend
- **.NET 8**: El backend está desarrollado en .NET 8. (Se puede usar visual studio 2022)
- **SQL Server 2022**: Necesitas tener SQL Server 2022 instalado para ejecutar el script SQL. (Se puede usar sql server 2022 Express)

### Frontend
- **Node.js**: Asegúrate de tener **Node.js** version v20.16.0 o en adelante instalado para ejecutar el frontend de Angular. 
- **Angular CLI**: El proyecto de Angular requiere Angular CLI version 18 en adelante. 

### BackEnd
