// Función constructora base Movimiento
function Movimiento(tipo, monto, descripcion) {
    this.tipo = tipo;
    this.monto = parseFloat(monto);
    this.descripcion = descripcion;
    this.fecha = new Date();
}

// Métodos comunes en el prototipo
Movimiento.prototype.validar = function() {
    if (this.monto <= 0) {
        throw new Error("El monto debe ser mayor a cero");
    }
    if (!this.descripcion || this.descripcion.trim() === "") {
        throw new Error("La descripción no puede estar vacía");
    }
    return true;
};

Movimiento.prototype.render = function() {
    const movimientoElement = document.createElement('div');
    movimientoElement.className = `list-group-item ${this.tipo === 'ingreso' ? 'list-group-item-success' : 'list-group-item-danger'}`;
    
    movimientoElement.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${this.descripcion}</h5>
            <small>${this.fecha.toLocaleDateString()}</small>
        </div>
        <p class="mb-1">${this.tipo === 'ingreso' ? '+' : '-'}$${this.monto.toFixed(2)}</p>
        <small>${this.tipo.toUpperCase()}</small>
    `;
    
    return movimientoElement;
};

// Función constructora para Ingreso
function Ingreso(monto, descripcion) {
    Movimiento.call(this, 'ingreso', monto, descripcion);
}
Ingreso.prototype = Object.create(Movimiento.prototype);
Ingreso.prototype.constructor = Ingreso;

// Función constructora para Egreso
function Egreso(monto, descripcion) {
    Movimiento.call(this, 'egreso', monto, descripcion);
    
    // Validación adicional para egresos
    this.validar = function() {
        Movimiento.prototype.validar.call(this);
        if (this.monto > 10000) {
            throw new Error("Los egresos no pueden superar los $10,000");
        }
        return true;
    };
}
Egreso.prototype = Object.create(Movimiento.prototype);
Egreso.prototype.constructor = Egreso;

// Array global para almacenar movimientos
const movimientos = [];

// Función para recalcular totales
function recalcularTotales() {
    const totalIngresos = movimientos
        .filter(m => m.tipo === 'ingreso')
        .reduce((sum, m) => sum + m.monto, 0);
    
    const totalEgresos = movimientos
        .filter(m => m.tipo === 'egreso')
        .reduce((sum, m) => sum + m.monto, 0);
    
    document.getElementById('totalIngresos').textContent = totalIngresos.toFixed(2);
    document.getElementById('totalEgresos').textContent = totalEgresos.toFixed(2);
    document.getElementById('balanceTotal').textContent = (totalIngresos - totalEgresos).toFixed(2);
}

// Función para mostrar mensaje de confirmación
function mostrarConfirmacion(mensaje, tipo = 'success') {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show mt-3`;
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('main').prepend(alerta);
    
    setTimeout(() => {
        alerta.classList.remove('show');
        setTimeout(() => alerta.remove(), 150);
    }, 3000);
}

// Manejo del formulario
document.getElementById('movimientoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const tipo = document.getElementById('tipoMovimiento').value;
    const monto = document.getElementById('monto').value;
    const descripcion = document.getElementById('descripcion').value;
    
    try {
        let movimiento;
        
        if (tipo === 'ingreso') {
            movimiento = new Ingreso(monto, descripcion);
        } else if (tipo === 'egreso') {
            movimiento = new Egreso(monto, descripcion);
        } else {
            throw new Error("Selecciona un tipo válido");
        }
        
        movimiento.validar();
        movimientos.push(movimiento);
        
        // Renderizar movimiento
        document.getElementById('listaMovimientos').prepend(movimiento.render());
        
        // Actualizar totales
        recalcularTotales();
        
        // Mostrar confirmación
        mostrarConfirmacion(`Movimiento de ${tipo} registrado exitosamente`);
        
        // Resetear formulario
        this.reset();
        
    } catch (error) {
        mostrarConfirmacion(error.message, 'danger');
    }
});