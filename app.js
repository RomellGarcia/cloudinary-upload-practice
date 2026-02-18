const nombreNube   = "dbzobibnj";      
const presetSubida = "TU_UPLOAD_PRESET"; 

// Elementos del DOM
const entradaArchivo = document.getElementById("entradaArchivo");
const btnSubir       = document.getElementById("btnSubir");
const estado         = document.getElementById("estado");
const vistaPrevia    = document.getElementById("vistaPrevia");
const imagenSubida   = document.getElementById("imagenSubida");

entradaArchivo.addEventListener("change", function () {
    const archivo = entradaArchivo.files[0];

    if (!archivo) return;

    //Validar que sea una imagen
    if (!archivo.type.startsWith("image/")) {
        estado.textContent = "El archivo debe ser una imagen.";
        btnSubir.disabled = true;
        vistaPrevia.style.display = "none";
        return;
    }

    // Mostrar vista previa local
    const lector = new FileReader();
    lector.onload = function (evento) {
        vistaPrevia.src = evento.target.result;
        vistaPrevia.style.display = "block";
    };
    lector.readAsDataURL(archivo);

    estado.textContent = "";
    imagenSubida.style.display = "none";
    btnSubir.disabled = false;
});

btnSubir.addEventListener("click", function () {
    const archivo = entradaArchivo.files[0];

    if (!archivo) {
        estado.textContent = "Selecciona una imagen primero.";
        return;
    }
    // Indicador de carga
    btnSubir.disabled = true;
    btnSubir.textContent = "Subiendo...";
    estado.textContent = "Subiendo...";
    imagenSubida.style.display = "none";

    const datosFormulario = new FormData();
    datosFormulario.append("file", archivo);
    datosFormulario.append("upload_preset", presetSubida);

    fetch("https://api.cloudinary.com/v1_1/" + nombreNube + "/image/upload", {
        method: "POST",
        body: datosFormulario
    })
    .then(function (respuesta) {
        if (!respuesta.ok) {
            throw new Error("Error del servidor: " + respuesta.status);
        }
        return respuesta.json();
    })
    .then(function (datos) {
        imagenSubida.src = datos.secure_url;
        imagenSubida.style.display = "block";
        estado.textContent = "Imagen subida correctamente.";
        btnSubir.disabled = false;
        btnSubir.textContent = "Subir a Cloudinary";
    })
    .catch(function (error) {
        estado.textContent = "Error al subir: " + error.message;
        btnSubir.disabled = false;
        btnSubir.textContent = "Subir a Cloudinary";
    });
});