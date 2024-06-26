# Taller "Crea tu Asistente con OpenAI"

Este taller ofrece ejemplos para la creación de asistentes utilizando tanto la API de OpenAI (carpeta `openAi`) como la de Azure AI Studio (carpeta `aiAzure`). Cada carpeta incluye ejemplos para Python, Node.js y Curl.

[Link a la presentación](https://docs.google.com/presentation/d/1aKNAtkDicpVw1jUv_NvLFH60-yevlFqOdnBtvNUFAfc/edit#slide=id.g2cd145db8c1_0_5)

## Instrucciones para Ejecutar los Ejemplos

### Node.js

1. Navega a la carpeta `node/`.
2. Ejecuta `npm install` para instalar las dependencias.
3. Crea un archivo `.env` y añade la línea: `API_KEY=XXX`, donde `XXX` es tu API Key.
4. Ejecuta `node testOpenAIAssistant.js` o `node testAzureAssistant.js`. Podrás escribir mensajes en la consola que serán enviados al asistente, y su respuesta aparecerá en el terminal. La ejecución continuará hasta que cierres la aplicación (presionando Ctrl+C).

### Python

1. Navega a la carpeta `python/`.
2. Instala las siguientes dependencias: `openai` y `python-dotenv`.
3. Crea un archivo `.env` y añade la línea: `API_KEY=XXX`, donde `XXX` es tu API Key.
4. Ejecuta `python3 testOpenAIAssistant.py "Tu mensaje"` o `python3 testAzureAssistant.py "Tu mensaje"`. Esto ejecutará el asistente con tu mensaje y mostrará la respuesta.

### Curl

1. Crea una hoja de cálculo en Google Drive y asígnale un nombre adecuado.
2. Haz clic en Extensiones -> Apps Script.
3. Copia el código del archivo correspondiente (`googleSpreadsheetOpenAIAssistant.js` o `googleSpreadsheetAzureAssistant.js`) y pégalo en el editor de Apps Script.
4. Introduce tu API Key en la línea `var apiKey = '';`.
5. Refresca la hoja de cálculo y verifica que se ha creado una nueva entrada en el menú (OpenAI API o Azure OpenAI API).
6. Escribe algo en una celda y ejecuta la nueva opción de menú (te pedirá permiso la primera vez). El contenido de la celda se enviará al asistente y la respuesta se insertará en la celda a su derecha.
