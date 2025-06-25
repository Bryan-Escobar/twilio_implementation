# Descripción del Proyecto

Este proyecto consiste en una prueba de integración avanzada de un bot de WhatsApp, empleando Twilio como plataforma de mensajería y Gemini AI de Google para el procesamiento inteligente de mensajes. El objetivo principal es habilitar la comunicación y la automatización de tareas mediante mensajes de texto o audio en WhatsApp, permitiendo la interacción eficiente con usuarios y la gestión automatizada de procesos.

## Tecnologías utilizadas

- **Twilio**: Provee la infraestructura para el envío y recepción de mensajes en WhatsApp.
- **Gemini AI (Google GenAI)**: Motor de inteligencia artificial para el análisis y generación de respuestas automáticas.
- **Node.js y TypeScript**: Entorno de ejecución y lenguaje principal para el desarrollo del backend.
- **Prisma ORM**: Gestión y acceso a bases de datos relacionales.
- **Swagger**: Documentación interactiva de la API.
- **TSX**: Ejecución y recarga en caliente de archivos TypeScript durante el desarrollo.

Esta integración permite recibir mensajes de WhatsApp, procesarlos mediante Gemini AI y responder automáticamente, facilitando la comunicación y la automatización de tareas desde la aplicación de mensajería.



## Pasos para levantar el proyecto

1-Instalar las dependencias
```npm i```


2-copiar el .env.template y renombarlo a .env y luego rellenar los datos solicitados (el .env nunca se debe subir a los repositorios de github)

3-Ejecutar ````npx prisma generate```` para generar el cliente del ORM PRISMA

3-Ejecutar ```npm run dev``` para ejecutar el programa

3-Abrir postman y hacer una solicitud GET a la url ```localhost:3000/api/overview```
    Si postman devuelve:
    ```{
        "message": "API is running"
       }
    ```
    Significa que la api esta corriendo como debe

## OTROS COMANDOS UTILES PARA BASES DE DATOS:
COMANDO PARA GENERAR EL SCHEMA/CLIENTE DE PRISMA: ````npx prisma generate````
COMANDO PARA CREAR DB EN BASE AL ORM: ````npx prisma migrate dev --name init````
COMANDO PARA CREAR LOS MODELOS DEL ORM SI LA BASE YA EXISTE: ````npx prisma db pull````








## estructura principal del proyecto
src->aca se colocan los archivos principales de codigo ts
    config/envs.ts-->aca se importan las variables de entorno

    domain--> aca se almacenan las reglas de negocio (interfaces y tipos de dato personalizados)

    presentation-->aca se ubican las clases principales y modulos del proyecto
    
        presentation/services-->aca se ubican las clases principales que tendran los metodos de la api
         (Ej: Clase Usuario (metodos crud de usuario)), estos seran utilizados por el programa en el server.ts

        presentation/controladores (EJ: usuarioController)-->Aca se mandan a llamar los metodos de las clase de services,  y se organizan en controladores

        presentation7routes.ts-->Aca se definen los endpoints de la api (urls)

.env--> aca se guardan las variables de entorno (contraseñas, codigos secretos, api keys, llaves, direcciones url y credenciales)

package.json-->aca se muestran las dependencias instaladas y los scripts principales




## pasos para configurar swagger-documentacion
1-Ejecutar los comandos de instalacion

````npm install swagger-jsdoc swagger-ui-express````
````npm i --save-dev @types/swagger-jsdoc````
```npm i --save-dev @types/swagger-ui-express```

2-Crear el swagger.ts en la carpeta config con el siguiente contenido:

```ts 
import swaggerJSDoc, { Options } from "swagger-jsdoc";


const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "API de Busroutes mobile",
        version: "1.0.0",
        description: "Documentación de la API para el software de gestión de taller automotriz.",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Servidor de desarrollo",
        },
    ],
};

const options: Options = {
    swaggerDefinition,
    apis: ["src/presentation/parada/*.ts"], // Ruta donde se encuentran las rutas documentadas
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
```


3-Aplicar el middleware de swagger en server.ts (donde se configuran la api de forma generla)
```// Middleware para Swagger```
```app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));```

4-descomentar la siguiente lineal en el tsconfig.json:
```    "resolveJsonModule": true,```

5-Comenzar a documentar cada endpoint especifico, EJ:
--Documentacion del endpoint de paradas cercanas (en paradasRoutes.ts)
```ts
/**
 * @swagger
 * /api/paradas/coordenadas:
 *   get:
 *     summary: Obtiene las coordenadas de todas las paradas.
 *     tags:
 *       - Paradas
 *     responses:
 *       200:
 *         description: Lista de coordenadas de paradas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
```
!!/api/paradas/coordenadas se debe sustituir con el endpoint

LISTO!, ahora puedes probar tu documentacion en 
```localhost:[puerto]/api-docs```


# ACTUALIZACION DE CONFIGURACIONES DE PROYECTO PARA GOOGLE/GENAI
Se realizo una reconfiguracion del proyecto para la compatibilidad con el nuevo paquete google/genai, para el cliente de gemini.
!!La libreria anteriormente utilizada estaba obsoleta y no era compatible con los functioncalls de gemini.

Se instalo @google/genai.

Se reemplazo commonjs con ES6Next en el tsconfig:
```"module": "ESNext", /* Specify what module code is generated. */```
    ````"moduleResolution": "bundler"```

Se instalo tsx (reemplazo de tsnodedev) 

Se modifico el script de dev, sistituyendo tsnodedev con tsx:
ANTIGUO:``    "dev": "tsnd --respawn --clear src/app.ts",``
NUEVO:     ````"dev": "tsx watch src/app.ts",````

Se añadio el parametro type:module en el package.json
````ts
 "name": "busroutes-mobile-backend",
  "type": "module",
  "version": "1.0.0",
  "main": "index.js",````
