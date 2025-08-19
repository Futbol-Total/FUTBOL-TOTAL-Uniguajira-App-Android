var progressText = document.getElementById('progress-text');
var progressCircle = document.querySelector('.progress');

var totalTime = 3000; // Tiempo total de la animación (3 segundos)
var totalSteps = 100; // 100 pasos para sincronizar el porcentaje (0% - 100%)
var interval = totalTime / totalSteps; // Tiempo por cada actualización
var progress = 0;

// Simular carga de recursos reales
var loadingTasks = [
    { name: 'Conectando...', duration: 800 },
    { name: 'Cargando datos...', duration: 1000 },
    { name: 'Preparando interfaz...', duration: 700 },
    { name: 'Finalizando...', duration: 500 }
];

var currentTask = 0;
var taskStartTime = Date.now();

var timer = setInterval(function () {
    var currentTime = Date.now();
    var elapsed = currentTime - taskStartTime;
    
    // Cambiar mensaje según la tarea actual
    if (currentTask < loadingTasks.length) {
        var task = loadingTasks[currentTask];
        document.getElementById('loading-message').textContent = task.name;
        
        if (elapsed >= task.duration) {
            currentTask++;
            taskStartTime = currentTime;
        }
    }
    
    progress += 2; // Incremento más rápido
    var offset = 282.6 - (progress / 100) * 282.6; // Calcula el offset para la circunferencia
    progressCircle.style.strokeDashoffset = offset; // Actualiza el progreso
    progressText.textContent = progress + '%'; // Actualiza el texto del porcentaje

    if (progress >= 100) {
        clearInterval(timer);
        // Pequeña pausa antes de redirigir
        setTimeout(() => {
            window.location.href = 'loguin.html';
        }, 300);
    }
}, interval);

// Botón para saltar la carga
document.getElementById('skip-loading').addEventListener('click', function() {
    clearInterval(timer);
    window.location.href = 'loguin.html';
});

// Auto-skip si toma demasiado tiempo (fallback)
setTimeout(function() {
    if (progress < 100) {
        clearInterval(timer);
        window.location.href = 'loguin.html';
    }
}, 5000); // Máximo 5 segundos