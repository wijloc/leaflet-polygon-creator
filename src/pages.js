const Database = require("./database/db");
const savePolygon = require("./database/savePolygon");
const editPolygon = require("./database/editPolygon");
const replacePoints = require("./database/replacePoints");
const insertPoints = require("./database/insertPoints");

module.exports = {
  index(req, res) {
    return res.render("index");
  },
  async polygons(req, res){
    try{
      const db = await Database;
      const polygons = await db.all(
        `SELECT id, area, name FROM polygons`
      );
      return res.render("polygons", { polygons });
    } catch (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }
  },
  createPolygon(req, res) {
    return res.render("polygon");
  },
  async savePolygon(req, res) {
    const {id, area, name, latlngs: textLatlngs} = req.body;
    
    latlngs = JSON.parse(textLatlngs);

    //validar se todos os campos estão preenchidos
    if (Object.values({area, name}).includes("")) {
      return res.send("Todos os campos devem ser preenchidos!");
    }

    try {      
      const db = await Database;

      if (id){
        await editPolygon(db, {
          id: id,
          name: name,
          area: area,
        });
        await replacePoints(db, {
          id: id,
          points: latlngs
        });
      } else {
        await savePolygon(db, {
          name: name,
          area: area,
        });
        await insertPoints(db, {          
          points: latlngs
        });
      }      

      //redirecionamento
      return res.redirect("/polygons");
    } catch (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }
  },
  async polygon(req, res){
    id = req.query.id;
    try{
      const db = await Database;
      const results = await db.all(
        `SELECT id, area, name FROM polygons WHERE id = ${id}`
      );
      const polygon = results[0];
      return res.render('polygon', {polygon})
    } catch (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }
    
  }
}