/******Modulos******/
const express = require ('express');
const path = require('path');
const {Server : HttpServer} = require ('http');
const {Server : IOServer} = require ('socket.io');
const Contenedor = require('./src/contenedor.js');
const productos = new Contenedor('./src/productos.json');
const historial = new Contenedor('./src/historial.json')
const morgan = require('morgan');
const handlebars = require('express-handlebars');

//Instancias de servidor
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

/******Middleware******/
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
app.use(morgan('dev'));

//Motores de plantillas
//HBS
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname +'/views/layouts',
    partialsDir: __dirname +'/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views','./views');

/******Rutas******/
app.get('/', (req,res)=>{
    res.render('main')
});

/******Servidor******/
const PORT = 3000;
const server = httpServer.listen(PORT, ()=>{
    console.log('Tu servidor esta corriendo en el puerto http://localhost:' + PORT);
})

/******Web Socket******/
//Productos
io.on('connection', async (socket)=>{
    console.log('Usuario Conectado');
    const prods = await productos.getAll();
    
    socket.emit('productos', prods);
    socket.on('new-prod', data =>{
        productos.save(data);
        io.sockets.emit('productos',prods);
    });
});

//Chat
io.on('connection', async (socket)=>{
    const chat = await historial.getAll();
    
    socket.emit('mensajes',chat);
    socket.on('new-mensaje', data =>{
        historial.save(data);
        io.sockets.emit('mensajes', chat);
    });
})