document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fechaNacimiento').addEventListener('change', cargarDatos);
    document.querySelectorAll('input[name="sexo"]').forEach(radio => {
        radio.addEventListener('change', cargarDatos);
    });

    cargarDatos(); 
});

function nomenclatura(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let diferencia = hoy - nacimiento; 
    
    const edadHoras = Math.floor(diferencia / (1000 * 60 * 60));
    const edadDias = Math.floor(edadHoras / 24);
    const edadMeses = Math.floor(edadDias / 30); 
    const edadAnios = Math.floor(edadMeses / 12);

    if (edadHoras < 24) { 
        return `${padLeft(edadHoras)}H`;
    } else if (edadDias < 30) { 
        return `${padLeft(edadDias)}D`;
    } else if (edadMeses < 12) { 
        return `${padLeft(edadMeses)}M`;
    } else { 
        return `${padLeft(edadAnios)}A`;
    }
}

function padLeft(number) {
    return number.toString().padStart(3, '0');
}

function criterios(item, fechaNacimiento, sexoSeleccionado) {
    let edadNomenclatura = null;
    if (fechaNacimiento) {
        edadNomenclatura = nomenclatura(fechaNacimiento);
    }
    
    //Ejemplo 1: Si el lsex es NO, pero linf y lsup si tiene criterios, se deben de tener en cuenta los otros criterios
    if (sexoSeleccionado === 'NO' && edadNomenclatura) {
        return item.linf <= edadNomenclatura && item.lsup >= edadNomenclatura;
    }

    //Ejemplo 2: Si todo dice NO (lsex, linf, lsup), el diagnostico siempre estará en la lista de resultados
    if (sexoSeleccionado === 'NO' && !edadNomenclatura) {
        return item.lsex === 'NO' && item.linf === 'NO' && item.lsup === 'NO';
    }

    //Ejemplo 3: Si lsex dice MUJER y los otros criterios dicen NO, los resultados aplican a mujeres de cualquier edad
    if (sexoSeleccionado === 'MUJER') {
        return item.lsex === 'MUJER';
    }

    //Ejemplo: Si lsex dice NO y los otros criterios dicen linf = 028D y lsup = 120A, los resultados aplican a cualquier sexo que tenga entre 28 días de nacido y 120 años.
    if ((sexoSeleccionado === 'NO' || !sexoSeleccionado) && edadNomenclatura >= '028D' && edadNomenclatura <= '120A') {
        return true;
    }

    return false; 
}

function cargarDatos() {
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    let sexoSeleccionado = "NO";

    document.querySelectorAll('input[name="sexo"]').forEach(radio => {
        if (radio.checked) {
            if (radio.value === 'F') {
                sexoSeleccionado = 'MUJER';
            } else if (radio.value === 'M') {
                sexoSeleccionado = 'HOMBRE';
            } else if (radio.value === 'N') {
                sexoSeleccionado = 'NO';
            }
        }
    });
    
    

    fetch('http://localhost:3000/items', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
        if (!response.ok) throw new Error('Falló la petición: ' + response.statusText);
        return response.json();
    })
    .then(data => {
        const datalist = document.getElementById('itemsDatalist');
        datalist.innerHTML = '';
        data.forEach(item => {
            if (criterios(item, fechaNacimiento, sexoSeleccionado)) {
                const option = document.createElement('option');
                option.value = `${item.catalog_key} - ${item.nombre}`;
                datalist.appendChild(option);
            }
        });
    })
    .catch(error => console.error('Error en la petición:', error));
}
