var progressText = document.getElementById('progress-text');
var progressCircle = document.querySelector('.progress');

var totalTime = 20000; // Tiempo total de la animación (20 segundos)
var totalSteps = 100; // 100 pasos para sincronizar el porcentaje (0% - 100%)
var interval = totalTime / totalSteps; // Tiempo por cada actualización
var progress = 0;

var timer = setInterval(function () {
    progress++;
    var offset = 282.6 - (progress / 100) * 282.6; // Calcula el offset para la circunferencia
    progressCircle.style.strokeDashoffset = offset; // Actualiza el progreso
    progressText.textContent = progress + '%'; // Actualiza el texto del porcentaje

    if (progress >= 100) {
        clearInterval(timer);
        window.location.href = 'loguin.html'; // Redirige al finalizar
    }
}, interval);
