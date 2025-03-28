USE [master]
GO

CREATE DATABASE pbo_inventario;
GO



USE [pbo_inventario]
GO
/****** Object:  Table [dbo].[pbo_producto]    Script Date: 23/3/2025 12:11:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[pbo_producto](
	[pro_id_producto] [int] IDENTITY(1,1) NOT NULL,
	[pro_nombre] [nvarchar](200) NULL,
	[pro_descripcion] [nvarchar](200) NULL,
	[pro_categoria] [nvarchar](200) NULL,
	[pro_imagen] [nvarchar](500) NULL,
	[pro_precio] [decimal](18, 6) NULL,
	[pro_stock] [int] NULL,
	[pro_estado] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[pro_id_producto] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[pbo_transaccion]    Script Date: 23/3/2025 12:11:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[pbo_transaccion](
	[tra_id_transaccion] [int] IDENTITY(1,1) NOT NULL,
	[tra_fecha] [datetime] NULL,
	[tra_id_producto] [int] NULL,
	[tra_tipo_transaccion] [char](1) NULL,
	[tra_cantidad] [int] NULL,
	[tra_precio_unitario] [decimal](18, 6) NULL,
	[tra_precio_total] [decimal](18, 6) NULL,
	[tra_detalle] [nvarchar](200) NULL,
PRIMARY KEY CLUSTERED 
(
	[tra_id_transaccion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[pbo_producto] ADD  DEFAULT ((0.00)) FOR [pro_precio]
GO
ALTER TABLE [dbo].[pbo_producto] ADD  DEFAULT ((0)) FOR [pro_stock]
GO
ALTER TABLE [dbo].[pbo_producto] ADD  DEFAULT ((1)) FOR [pro_estado]
GO
ALTER TABLE [dbo].[pbo_transaccion] ADD  DEFAULT (getdate()) FOR [tra_fecha]
GO
ALTER TABLE [dbo].[pbo_transaccion] ADD  DEFAULT ((0.00)) FOR [tra_precio_unitario]
GO
ALTER TABLE [dbo].[pbo_transaccion] ADD  DEFAULT ((0.00)) FOR [tra_precio_total]
GO
ALTER TABLE [dbo].[pbo_transaccion]  WITH CHECK ADD FOREIGN KEY([tra_id_producto])
REFERENCES [dbo].[pbo_producto] ([pro_id_producto])
GO
/****** Object:  StoredProcedure [dbo].[CreateProduct]    Script Date: 23/3/2025 12:11:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 6.2 SP Crear Producto

CREATE   PROCEDURE [dbo].[CreateProduct]
    @pro_nombre_ NVARCHAR(200),
    @pro_descripcion_ NVARCHAR(200),
    @pro_categoria_ NVARCHAR(200),
    @pro_imagen_ NVARCHAR(500),			  
    @pro_precio_ DECIMAL(18, 6),           
    @pro_stock_ INT,                      
    @pro_estado_ INT
AS
BEGIN
    BEGIN TRY
        -- Insertar un nuevo producto en la tabla Products
        INSERT INTO [dbo].[pbo_producto]
           ([pro_nombre]
           ,[pro_descripcion]
           ,[pro_categoria]
           ,[pro_imagen]
           ,[pro_precio]
           ,[pro_stock]
           ,[pro_estado])
     VALUES
           (@pro_nombre_
           , @pro_descripcion_
           , @pro_categoria_
           , @pro_imagen_ 
           , @pro_precio_
           , @pro_stock_
           , @pro_estado_)

		PRINT 'Producto creado correctamente.';
    END TRY
    BEGIN CATCH
        PRINT 'Error al crear cliente' + ERROR_MESSAGE();
    END CATCH
END;
GO
/****** Object:  StoredProcedure [dbo].[DeleteProduct]    Script Date: 23/3/2025 12:11:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 6.4 SP Eliminar Producto

CREATE   PROCEDURE [dbo].[DeleteProduct]
    @pro_id_producto_ INT
AS
BEGIN
    BEGIN TRY
        update  [dbo].[pbo_producto]
		set pro_estado = 0
        WHERE [pro_id_producto] = @pro_id_producto_;

        IF @@ROWCOUNT = 0
        BEGIN
            PRINT 'No se encontró el producto con el ID proporcionado.';
            RETURN;
        END

        PRINT 'Producto eliminado correctamente.';
    END TRY
    BEGIN CATCH
        PRINT 'Error en la eliminación del producto: ' + ERROR_MESSAGE();
    END CATCH
END;
GO
/****** Object:  StoredProcedure [dbo].[GetProducts]    Script Date: 23/3/2025 12:11:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- 6 Crear los SP

-- 6.1 SP Capturar los productos

CREATE   PROCEDURE [dbo].[GetProducts]
AS
BEGIN
    SELECT [pro_id_producto]
      ,[pro_nombre]
      ,[pro_descripcion]
      ,[pro_categoria]
      ,[pro_imagen]
      ,[pro_precio]
      ,[pro_stock]
      ,[pro_estado]
  FROM [pbo_inventario].[dbo].[pbo_producto]
  WHERE [pro_estado] = 1
END
GO
/****** Object:  StoredProcedure [dbo].[GetProductStock]    Script Date: 23/3/2025 12:11:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 6.5 SP Obtener informacion e un producto en especifico por el ID
CREATE   PROCEDURE [dbo].[GetProductStock]
    @pro_id_producto_ INT
AS
BEGIN
    SELECT *
    FROM pbo_producto
    WHERE pro_id_producto = @pro_id_producto_;
END
GO
/****** Object:  StoredProcedure [dbo].[GetTransactionHistory]    Script Date: 23/3/2025 12:11:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 6.9 SP Obtener historial e transacciones

CREATE   PROCEDURE [dbo].[GetTransactionHistory]    
@tipo CHAR(1) = NULL, 
@fechaInicio DATE = NULL  , 
@fechaFin DATE = NULL 
AS
BEGIN
    SELECT [tra_id_transaccion] as idtransaccion
      ,[tra_fecha] as fecha
	  ,[pro_nombre] as nombre
	  ,CASE
            WHEN t.[tra_tipo_transaccion] = 'C' THEN 'Compra'
            WHEN t.[tra_tipo_transaccion] = 'V' THEN 'Venta'
            ELSE 'Desconocido'
        END AS tipotransaccion
      ,[tra_cantidad] as cantidad
      ,[tra_precio_unitario] as preciounitario
      ,[tra_precio_total] as preciototal
      ,[tra_detalle] as detalle
    FROM [dbo].[pbo_transaccion] t
    INNER JOIN [dbo].[pbo_producto] p ON t.tra_id_producto = p.pro_id_producto
    WHERE 
        (@tipo = 'T' OR t.[tra_tipo_transaccion] = @tipo)
        AND (@fechaInicio IS NULL OR CAST(t.[tra_fecha] AS DATE) >= @fechaInicio)
        AND (@fechaFin IS NULL OR CAST(t.[tra_fecha] AS DATE) <= @fechaFin)
	ORDER BY t.[tra_fecha] DESC, p.[pro_nombre] ASC
END
GO
/****** Object:  StoredProcedure [dbo].[SaveTransaction]    Script Date: 23/3/2025 12:11:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--6.8 SP Guardar transaccion
CREATE   PROCEDURE [dbo].[SaveTransaction]
    @producto_id INT,
    @cantidad INT,
    @precio_unitario DECIMAL(18, 2),
    @precio_total DECIMAL(18, 2),
    @tipo_transaccion CHAR(1),
	@detalle NVARCHAR(200)
AS
BEGIN
INSERT INTO [dbo].[pbo_transaccion]
           ([tra_id_producto]
           ,[tra_tipo_transaccion]
           ,[tra_cantidad]
           ,[tra_precio_unitario]
           ,[tra_precio_total]
           ,[tra_detalle])
           VALUES (@producto_id, @tipo_transaccion, @cantidad, @precio_unitario, @precio_total, @detalle);
    RETURN 1;
END
GO
/****** Object:  StoredProcedure [dbo].[UpdateBuyStock]    Script Date: 23/3/2025 12:11:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 6.6 SP Actualizar stock en compra
CREATE   PROCEDURE [dbo].[UpdateBuyStock]
    @pro_id_producto INT,
    @cantidad INT
AS
BEGIN
        UPDATE pbo_producto
        SET pro_stock = pro_stock + @cantidad
        WHERE pro_id_producto = @pro_id_producto;
        IF @@ROWCOUNT = 0
        BEGIN
            RETURN 1;
        END
		ELSE	
		BEGIN
           
            RETURN 0;
        END
END
GO
/****** Object:  StoredProcedure [dbo].[UpdateProduct]    Script Date: 23/3/2025 12:11:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 6.3 SP Actualizar Producto


CREATE   PROCEDURE [dbo].[UpdateProduct]
    @pro_id_producto_ INT,
    @pro_nombre_ NVARCHAR(200),
    @pro_descripcion_ NVARCHAR(200),
    @pro_categoria_ NVARCHAR(200),
    @pro_imagen_ NVARCHAR(500),			  
    @pro_precio_ DECIMAL(18, 6),           
    @pro_stock_ INT,                      
    @pro_estado_ INT
AS
BEGIN
    BEGIN TRY
        -- Actualizamos el 
		UPDATE [dbo].[pbo_producto]
	   SET [pro_nombre] = @pro_nombre_
		  ,[pro_descripcion] = @pro_descripcion_
		  ,[pro_categoria] = @pro_categoria_
		  ,[pro_imagen] = @pro_imagen_
		  ,[pro_precio] = @pro_precio_
		  ,[pro_stock] = @pro_stock_
		  ,[pro_estado] = @pro_estado_
		WHERE [pro_id_producto] = @pro_id_producto_;

        IF @@ROWCOUNT = 0
        BEGIN
            PRINT 'No se encontró el producto con el ID proporcionado.';
            RETURN;
        END
        
        PRINT 'Producto actualizado correctamente.';
    END TRY
    BEGIN CATCH
        PRINT 'Error en la actualización del producto: ' + ERROR_MESSAGE();
    END CATCH
END;
GO
/****** Object:  StoredProcedure [dbo].[UpdateSaleStock]    Script Date: 23/3/2025 12:11:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 6.7 SP Actualizar stock en venta
CREATE   PROCEDURE [dbo].[UpdateSaleStock]
    @pro_id_producto INT,
    @cantidad INT
AS
BEGIN
    DECLARE @stockActual INT;
    
    SELECT @stockActual = pro_stock
    FROM pbo_producto
    WHERE pro_id_producto = @pro_id_producto;

    IF @stockActual >= @cantidad
    BEGIN
        UPDATE pbo_producto
        SET pro_stock = pro_stock - @cantidad
        WHERE pro_id_producto = @pro_id_producto;

        RETURN 1;
    END
    ELSE
    BEGIN
        RETURN 0;
    END
END
GO
