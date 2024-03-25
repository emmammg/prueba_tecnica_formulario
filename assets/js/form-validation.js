document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formConsulta');
    const text = form.querySelectorAll('input[type="text"]');
    const textarea = form.querySelector('textarea');
    const dataList = form.querySelector('[list]'); 

    text.forEach(input => {
        input.addEventListener('input', function() {
            if (input.value.trim()) {
                limpiarError(input);
            }
        });
    });

    textarea.addEventListener('input', function() {
        if (textarea.value.trim()) {
            limpiarError(textarea);
        }
    });

    dataList.addEventListener('input', function() {
        const opcionesDatalist = Array.from(document.querySelector('#' + dataList.getAttribute('list')).options).map(option => option.value);
        if (opcionesDatalist.includes(dataList.value)) {
            limpiarError(dataList);
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        let datosValidos = true;

        text.forEach(input => {
            if (!input.value.trim()) {
                mostrarError(input, "Este campo es requerido.");
                datosValidos = false;
            }
        });

        if (!textarea.value.trim()) {
            mostrarError(textarea, "Este campo es requerido.");
            datosValidos = false;
        }

        const opcionesDatalist = Array.from(document.querySelector('#' + dataList.getAttribute('list')).options).map(option => option.value);
        if (!opcionesDatalist.includes(dataList.value)) {
            mostrarError(dataList, "Selecciona una opción.");
            datosValidos = false;
        }

        if (datosValidos) {
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            const queryString = new URLSearchParams(data).toString();
            window.location.href = 'resumen.html?' + queryString;
        }
    });

    function mostrarError(elemento, mensaje) {
        const spanError = elemento.nextElementSibling.classList.contains('error') ?
                          elemento.nextElementSibling :
                          elemento.parentElement.querySelector('.error');
        spanError.textContent = mensaje;
        elemento.classList.add('is-invalid');
    }

    function limpiarError(elemento) {
        const spanError = elemento.nextElementSibling.classList.contains('error') ?
                          elemento.nextElementSibling :
                          elemento.parentElement.querySelector('.error');
        spanError.textContent = '';
        elemento.classList.remove('is-invalid');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.atropometrico');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '').substring(0, 3);
        });
    });
});