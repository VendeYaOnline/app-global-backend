# Backend - Prueba Técnica (Nest.js + PostgreSQL)

Este proyecto corresponde a una prueba técnica enfocada en el desarrollo backend con **Nest.js**, siguiendo buenas prácticas de organización, seguridad y escalabilidad. Se implementó una arquitectura modular por recursos y una configuración completa de autenticación, autorización y persistencia de datos.

## 🛠️ Stack Tecnológico

| Herramienta                         | Uso Principal                                         |
| ----------------------------------- | ----------------------------------------------------- |
| **Nest.js**                         | Framework backend modular y escalable                 |
| **TypeORM**                         | ORM para modelado y comunicación con la base de datos |
| **PostgreSQL (pg)**                 | Base de datos relacional                              |
| **bcrypt**                          | Hasheado de contraseñas                               |
| **JWT**                             | Autenticación basada en tokens                        |
| **Guards (AuthGuard & RolesGuard)** | Protección y permisos por rol y sesión                |
| **DTOs**                            | Validación de datos de entrada                        |

---

## 📁 Estructura del Proyecto

Se utilizó la estructuración **clásica por módulos de recurso** de Nest.js:

```
src/
├── auth/
├── users/
├── programs/
├── common/
└── main.ts

```

- Cada módulo mantiene sus controladores, servicios, entidades y DTOs.
- Esto permite mantener el código ordenado, escalable y mantenible.

---

## 🔑 Autenticación y Seguridad

La autenticación se maneja mediante **JWT**, retornado y almacenado en **cookie HTTP-only**, lo que reduce el riesgo de robo del token en el navegador.

- Las contraseñas se almacenan utilizando **bcrypt** para garantizar seguridad.
- Las rutas están protegidas mediante **Guards**, permitiendo acceso solo a usuarios autenticados y/o con el rol adecuado.

Por ejemplo, para restringir creación de programas solo a administradores:

```
@Post()
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
create(@Body() createProgramDto: CreateProgramDto) {
  return this.programService.create(createProgramDto);
}
```

## 🛠️ Instrucciones de Configuración y Ejecución

Sigue estos pasos para poner el proyecto en marcha:

### Paso 1: Preparación Inicial

1.  **Clonar el proyecto** desde el repositorio.
2.  Asegúrate de tener **Node.js** instalado en tu sistema.

### Paso 2: Configuración de la Base de Datos (Docker)

Para simplificar el montaje de la base de datos local, utilice Docker:

1.  **Instala y abre Docker Desktop**.
2.  Crea un archivo llamado **`.env`** en la raíz del proyecto y añade las siguientes variables de entorno:

    ```bash
    DB_HOST=localhost
    DB_PORT=5433
    DB_USER=postgres
    DB_PASS=12345
    DB_NAME=database_global
    JWT_SECRET=TE8tnQ8yPD
    ```

3.  **Conecta el _backend_ a la base de datos** ejecutando el siguiente comando:

    ```bash
    pnpm run database
    ```

### Paso 3: Verificación de la Conexión

1.  Verifica la conexión a la base de datos accediendo a la siguiente ruta local:

    ```
    http://localhost:4000/health
    ```

2.  Deberías obtener una respuesta similar a esta, que confirma la conexión exitosa:

    ```json
    {
      "status": "OK ✅ Conectado a la base de datos"
    }
    ```

### Paso 4: Ejecutar el _Seed_ (Datos de Prueba)

1.  Ejecuta el _seed_ para poblar la base de datos con registros de prueba, accediendo a la siguiente ruta:

    ```
    http://localhost:4000/seed
    ```

## ⚠️ Estado de la Funcionalidad y Pendientes

Quiero ser transparente sobre la finalización de los servicios del módulo administrador:

| Módulo          | Funcionalidades Completadas (CRUD)                 | Funcionalidades Pendientes |
| :-------------- | :------------------------------------------------- | :------------------------- |
| **Estudiantes** | ✅ Crear, Obtener, Actualizar, Eliminar (Completo) | Ninguna                    |
| **Programas**   | ✅ Obtener, Crear                                  | ❌ Actualizar, Eliminar    |

Debido a restricciones de tiempo causadas por otra prueba técnica, no fue posible completar las funciones de **Actualizar** y **Eliminar** para el módulo de **Programas**.

**Aclaración:** De haber contado con más tiempo, la lógica y estructura implementadas para el módulo de **Estudiantes** se habrían replicado y aplicado directamente para completar las operaciones pendientes en el módulo de **Programas**, manteniendo la consistencia en el diseño del _backend_.
