const { api } = require("./services/api");

module.exports = {
  index(req, res) {
    return res.render("index");
  },
  async polygons(req, res) {
    try {
      const response = await api.get('polygons');
      const polygons = response.data.map((polygon) => {
        return {
          id: polygon.id,
          area: polygon.area,
          name: polygon.name,
        }
      });
      return res.render("polygons", { polygons });
    } catch (err) {
      console.log(err);
      return res.send("Erro ao obter dados!");
    }
  },
  createPolygon(req, res) {
    return res.render("polygon");
  },
  async savePolygon(req, res) {
    const { id, area, name, latlngs: textLatlngs } = req.body;

    latlngs = JSON.parse(textLatlngs);

    //validar se todos os campos estão preenchidos
    if (Object.values({ area, name }).includes("")) {
      return res.send("Todos os campos devem ser preenchidos!");
    }

    try {
      const response = await api.post('/polygons', {
        name: name,
        area: area,
      });

      const polygon_id = response.data.id;

      latlngs.forEach(async (latlng) => {
        await api.post('/points', {
          polygon_id,
          lat: latlng[0],
          lng: latlng[1]
        })
      })

      //redirecionamento
      return res.redirect("/polygons");
    } catch (err) {
      return res.send("Erro no banco de dados!");
    }
  },
  async polygon(req, res) {
    id = req.query.id;
    try {
      const responsePolygon = await api.get(`/polygons/${id}`)
      const polygon = responsePolygon.data;

      const responsePoints = await api.get(`/points/${id}`)
      const points = responsePoints.data;
      const pointsArray = points.map((point) => ([point.lat, point.lng]))

      const responsePolygons = await api.get('polygons');
      const polygons = responsePolygons.data.map((polygon) => {
        return {
          id: polygon.id,
          area: polygon.area,
          name: polygon.name,
          points: polygon.points
        }
      });
      return res.render('polygon', { polygon, points: JSON.stringify(pointsArray), polygons: JSON.stringify(polygons) })
    } catch (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }

  }
}