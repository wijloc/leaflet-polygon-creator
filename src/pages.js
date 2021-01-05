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
  async createPolygon(req, res) {
    const responsePolygons = await api.get('polygons');
    const polygons = responsePolygons.data.map((polygon) => {
      return {
        id: polygon.id,
        area: polygon.area,
        name: polygon.name,
        points: polygon.points
      }
    });
    return res.render("polygon", { polygons: JSON.stringify(polygons) });
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
          lng: latlng[1],
          order: latlng[2]
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
      const pointsArray = points.map((point) => ([point.lat, point.lng, point.order]))

      const responsePolygons = await api.get('polygons');
      const polygons = responsePolygons.data.map((polygon) => {
        return {
          id: polygon.id,
          area: polygon.area,
          name: polygon.name,
          points: polygon.points
        }
      });
      const filteredPolygons = polygons.filter((element) => (element.id !== id));
      return res.render('polygon', { polygon, points: JSON.stringify(pointsArray), polygons: JSON.stringify(filteredPolygons) })
    } catch (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }
  },
  async deletePolygon(req, res) {
    const { id } = req.query;
    const deleteResponse = await api.delete('/polygons', { data: { id } })
    return res.redirect("/polygons");
  }
}