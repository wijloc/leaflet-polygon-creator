const Database = require("./database/db");
const savePolygon = require("./database/savePolygon");

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
      console.log(polygons)
      return res.render("polygons", { polygons });
    } catch (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }
  },
  createPolygon(req, res) {
    return res.render("create-polygon");
  },
  async savePolygon(req, res) {
    const fields = req.body;
    console.log(fields)

    //validar se todos os campos estão preenchidos
    if (Object.values(fields).includes("")) {
      return res.send("Todos os campos devem ser preenchidos!");
    }

    try {      
      const db = await Database;
      await savePolygon(db, {
        name: fields.name,
        area: fields.area,
      });

      //redirecionamento
      return res.redirect("/polygons");
    } catch (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }
  },
}