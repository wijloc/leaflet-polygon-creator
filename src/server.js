//importar dependencias
const express = require("express");
const path = require("path");
const pages = require("./pages.js");

//iniciando o express
const server = express();

server
  //utilizar body do req
  .use(express.urlencoded({extended: true}))
  //utilizando os arquivos estásticos
  .use(express.static("public"))

  //configurar template engine
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "hbs")

//criar rotas da aplicacao
.get("/", pages.index)
.get('/polygons', pages.polygons)
.get('/create-polygon', pages.createPolygon)
.get('/polygon', pages.polygon)
.post("/save-polygon", pages.savePolygon)

//ligar o servidor
server.listen(process.env.PORT || 5500);