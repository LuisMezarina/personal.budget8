# Gestión de Presupuesto Personal

---

### Exportar presupuesto a PDF
Se añadió un botón que genera un archivo PDF conteniendo: 

- Totales de ingresos, egresos y balance
- Lista de movimientos con fecha, tipo, monto y descripción

---

### Buscar los balances por fecha
Se añadio un buscador por fechas, cabe resaltar que se podrá buscar a partir del día siguiente para que no se encuentre un dia con ingresos o egresos incompletos. 

## Decisiones tecnicas: 

### Para exportar a pdf se tuvo que usar la libreria jsPDF con el siguiente link: 

"<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>"

Luego se aplicó la función exportarAPDF en la cual se le dió los parametros a exportar asi como la orden para descargar el archivo,  doc.save("presupuesto.pdf");

### Para crear el buscador por fechas: 

Primeramente se creó los campos en el HTML y posteriormente se creó una función en JS en la cual se aplica "getElementById para vincularlos y el .filter para que una vez puestas las fechas las busque y suba. 