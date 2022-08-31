const socket = io();

function renderProductos(data){
    const html = data.map((producto, index) =>{
        return(`<tr>
        <td scope="row">${producto.titulo}</td>
        <td>$ ${producto.precio}</td>
        <td>
            <img src=${producto.url} class="img-thumbnail" style="max-width: 60px ;" alt="Foto de ${producto.titulo}">
        </td>
        </tr>`);
    }).join('');
    document.getElementById('tabla-body').innerHTML = html;
};

function addProd(e){
    const producto = {
        titulo: document.getElementById('titulo').value,
        precio: document.getElementById('precio').value,
        url: document.getElementById('url').value
    };
    socket.emit('new-prod', producto);
    return false;
}

socket.on('productos', function(data){
    renderProductos(data);
});