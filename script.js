window.onload = mostrarNotas;

document.getElementById('btnAgregar').addEventListener('click', () => agregar());
document.getElementById('btnEliminar').addEventListener('click', () => eliminar());
document.getElementById('btnGuardar').addEventListener('click', guardarCambios);
document.getElementById('btnCancelar').addEventListener('click', cancelarEdicion);
document.getElementById('inputBusqueda').addEventListener('input', () => mostrarNotas());

let editando = false;
let idEdicion = null;

function eliminar () {
    if (confirm("Estas seguro de que quieres eliminar TODOS los usuarios?")) {

    localStorage.clear();
    mostrarNotas();
    }
}

function agregar () {
    if(editando) {
        alert("¡Estás en modo edición! Guarda o cancela los cambios primero.");
        return;
    }

    let arrayUsers = [];

    let name = document.getElementById('txtUsers').value;
    let number = document.getElementById('txtNumber').value;
    let nota = document.getElementById('txtNotas').value;

    if (name == "" || number == "" || nota == "") {
        alert("Los campos de usuario, numero y nota son requeridos para crear un usuario");
        return;
    }

    let data = {
        "id": Date.now(), // ID único basado en timestamp
        "notas": nota,
        "name": name,
        "number": number,
        "createdAt": new Date().toISOString() // Fecha de creación
    }

    if (localStorage.users) { // Verificamos si existen datos en el locaStorage
        arrayUsers = JSON.parse(localStorage.users); // Lo convertimos en un array para poder agregarle nuevos usuarios
    }

    // Agreagamos lo que tenga el objeto "data" al arrayUsers
    arrayUsers.push(data); 
    // Despues lo guardamos en el localStorage y lo convertimos string para que se puede guardar
    localStorage.users = JSON.stringify(arrayUsers); 
    mostrarNotas();


}
function eliminarUsuario (id) {
    if (confirm("Estas seguro de eliminar este usuario?")) {
        let arrayUsers = JSON.parse(localStorage.users); // Buscamos lso datos guardados en el local
        // Actualizamos el array y comparamos el id que recibimos y los id del localStorage, busca los id del local que no coincidan con el id del parametro, si no coinciden los mantiene y si coinciden los excluye
        arrayUsers = arrayUsers.filter(usuarios => usuarios.id != id);
        // Filtra y Mantiene los usuarios cuyo ID no coincida con el id recibido como parámetro (que es el ID de usuario que queremos eliminar)

        // Actulizadondo el localStorage con el array que creamos y lo mostramos
        localStorage.users = JSON.stringify(arrayUsers);
        mostrarNotas();
    }
}

// === Funcion para editar los clientes / usuarios ===
function editarUsuario(id) {
    editando = true;
    idEdicion = id; // Almacenamos el ID en una variable global

    let arrayUsers = JSON.parse(localStorage.users);
    // Buscamos en el array el usuario que cumpla con nuestras condiciones
    let usuario = arrayUsers.find(user => user.id == id);

    // llenamos los campos del formulario con los campos del usuario encontrado
    document.getElementById('txtUsers').value = usuario.name;
    document.getElementById('txtNumber').value = usuario.number;
    document.getElementById('txtNotas').value = usuario.notas;

    // Mostramos/ocultamos botones
    document.getElementById('btnAgregar').style.display = 'none';
    document.getElementById('btnGuardar').style.display = 'inline-block';
    document.getElementById('btnCancelar').style.display = 'inline-block';
    
    document.getElementById('txtUsers').focus();

}

// === Funcion para guardar los cambios al editar un cliente ===
function guardarCambios() {
    let arrayUsers = JSON.parse(localStorage.users);
    // Buscamos el índice usando la variable global idEdicion
    let index = arrayUsers.findIndex(user => user.id == idEdicion);

    // Spread operator - copia todas las propiedades existentes del usuario
    // Operador spread (...): Copia todas las propiedades existentes y Sobrescribe los campos modificados del formulario
    arrayUsers[index] = {
        ...arrayUsers[index],
        name: document.getElementById('txtUsers').value,
        number: document.getElementById('txtNumber').value,
        notas: document.getElementById('txtNotas').value,

        // Actualizamos los campos modificados y agregamos updatedAt
        updatedAt: new Date().toISOString()
    };
    localStorage.users = JSON.stringify(arrayUsers);
    
    // Restauramos la interfaz
    cancelarEdicion();
    mostrarNotas();
}

// Función cancelar edición
function cancelarEdicion() {
    editando = false;
    idEdicion = null;
    clearForm();
    
    // Restauramos visibilidad de botones
    document.getElementById('btnAgregar').style.display = 'inline-block';
    document.getElementById('btnGuardar').style.display = 'none';
    document.getElementById('btnCancelar').style.display = 'none';
}

function clearForm() {
    document.getElementById('txtUsers').value = '';
    document.getElementById('txtNumber').value = '';
    document.getElementById('txtNotas').value = '';
}

// === Funcion para mostrar la lista de usuarios ===
function mostrarNotas () {
    let arrayUsers = [];
    const busqueda = document.getElementById('inputBusqueda').value.toLowerCase();

    if (localStorage.users) { // Verificamos si existen datos en el locaStorage
        arrayUsers = JSON.parse(localStorage.users); // Lo convertimos en un array para poder recorrer cada obejto y aplicar los filtros si existen datos guardados en el localStorage (es decir usuarios/clientes)
        
        // Aplicar filtro
        arrayUsers = arrayUsers.filter(user => {
            return user.name.toLowerCase().includes(busqueda) ||
                   user.number.toString().includes(busqueda) ||
                   user.notas.toLowerCase().includes(busqueda);
        });
    }
    
    let html = "";
    // for (let i = 0; i < arrayUsers.length; i++) {
    //     html += `<br/> ${arrayUsers[i].name} <br/> ${arrayUsers[i].number} <br/> ${arrayUsers[i].notas} <br/>`
    // }

    // Tambien se puede utilizar el "forEach" para recorrer los elementos del array
    arrayUsers.forEach(users => {
        html += `
        <div class="card mb-3 shadow-sm">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="card-title mb-1">${users.name}</h5>
                        <p class="text-muted mb-2">Número: ${users.number}</p>
                        <p class="card-text">${users.notas}</p>
                    </div>
                    <div class="d-flex flex-column">  <!-- Contenedor en columna -->
                        <button class="btn btn-sm btn-outline-secondary mb-1" onclick="editarUsuario('${users.id}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario('${users.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <small class="text-muted">Creado: ${new Date(users.createdAt || Date.now()).toLocaleDateString()}</small>
            </div>
        </div>
        `;
    });
    
    document.getElementById('lista').innerHTML = html;
    
    console.log(arrayUsers);
}