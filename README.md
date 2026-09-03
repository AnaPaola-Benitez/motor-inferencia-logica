***Motor de Inferencia Lógica como Servicio***

Proyecto desarrollado con Node.js, Express y Tau Prolog.

   *Descripción*

Este proyecto implementa un motor de inferencia lógica mediante un servicio HTTP.

El servidor recibe consultas de Prolog mediante el endpoint `/query` y devuelve los resultados de la inferencia en formato JSON.

  *Tecnologías utilizadas*

* Node.js
* Express
* Tau Prolog
* JavaScript
* Prolog

  *Estructura del proyecto*

```text
motor-inferencia/
├── index.js
├── knowledge.pl
├── package.json
├── package-lock.json
├── .gitignore

```

## Instalación

Primero instalar las dependencias:

```bash
npm install
```

## Ejecución

Iniciar el servidor con:

```bash
node index.js
```

El servidor estará disponible en:

```text
http://localhost:3000
```

## Endpoint

### POST `/query`

El endpoint recibe una consulta de Prolog.

Ejemplo:

```json
{
    "query": "penalty_applicable(contract1)"
}
```

El servidor procesa la consulta utilizando Tau Prolog y devuelve las respuestas obtenidas.

## Base de conocimiento

La base de conocimiento se encuentra en:

```text
knowledge.pl
```

Contiene hechos y reglas de Prolog utilizados por el motor de inferencia.
