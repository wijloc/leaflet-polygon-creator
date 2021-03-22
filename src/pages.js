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
          fileName: polygon.name.replaceAll(" ", "_")
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
    const { area, name, latlngs: textLatlngs } = req.body;

    latlngs = JSON.parse(textLatlngs);

    //validar se todos os campos estão preenchidos
    if (Object.values({ area, name }).includes("")) {
      return res.send("Todos os campos devem ser preenchidos!");
    }

    if (latlngs.length === 0) {
      return res.send("Points of polygon is required.")
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
      console.log(err);
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
  },
  async alterPolygon(req, res) {
    const { id, area, name, latlngs: textLatlngs } = req.body;

    latlngs = JSON.parse(textLatlngs);

    //validar se todos os campos estão preenchidos
    if (Object.values({ area, name }).includes("")) {
      return res.send("Todos os campos devem ser preenchidos!");
    }

    if (latlngs.length === 0) {
      return res.send("Points of polygon is required.")
    }

    try {
      const response = await api.put(`/polygons/${id}`, {
        name: name,
        area: area,
      });

      const polygon_id = id;

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
      console.log(err);
      return res.send("Erro no banco de dados!");
    }
  },
  async manageCustomers(req, res) {
    id = req.query.id;
    try {
      const responsePolygon = await api.get(`/polygons/${id}`)
      const polygon = responsePolygon.data;

      const responsePoints = await api.get(`/points/${id}`)
      const points = responsePoints.data;
      const pointsArray = points.map((point) => ([point.lat, point.lng, point.order]))

      const responseCustomers = await api.get(`/customers/${id}`)
      const customers = responseCustomers.data;
      const customersArray = customers.map((customer) => ([customer.lat, customer.lng]))

      const responseLockers = await api.get(`/lockers`)
      const lockers = responseLockers.data;
      const lockersArray = lockers.map((locker) => ([locker.lat, locker.lng]))

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

      return res.render('polygon-customers', {
        polygon,
        points: JSON.stringify(pointsArray),
        polygons: JSON.stringify(filteredPolygons),
        customers: JSON.stringify(customersArray),
        lockers: JSON.stringify(lockersArray)
      })
    } catch (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }
  },
  async savePolygonCustomers(req, res) {
    const { polygon_id, customers_data } = req.body;

    customers = JSON.parse(customers_data);

    //validar se todos os campos estão preenchidos
    if (customers.length === 0) {
      return res.send("Please inform customers!");
    }

    try {
      const customers_array = customers.map((customer) => ({ lat: customer.lat, lng: customer.lng }));

      await api.post('/customers', {
        polygon_id,
        customers: customers_array
      })

      //redirecionamento
      return res.redirect("/polygons");
    } catch (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }
  },
  async manageLockers(req, res) {
    id = req.query.id;
    try {
      const responsePolygon = await api.get(`/polygons/${id}`)
      const polygon = responsePolygon.data;

      const responsePoints = await api.get(`/points/${id}`)
      const points = responsePoints.data;
      const pointsArray = points.map((point) => ([point.lat, point.lng, point.order]))

      const responseCustomers = await api.get(`/customers`)
      const customers = responseCustomers.data;
      const customersArray = customers.map((customer) => ([customer.lat, customer.lng]))

      const responseLockers = await api.get(`/lockers/${id}`)
      const lockers = responseLockers.data;
      const lockersArray = lockers.map((locker) => ([locker.lat, locker.lng]))


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

      return res.render('polygon-customers', {
        polygon,
        points: JSON.stringify(pointsArray),
        polygons: JSON.stringify(filteredPolygons),
        customers: JSON.stringify(customersArray),
        lockers: JSON.stringify(lockersArray),
        source_lockers: true
      })
    } catch (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }
  },
  async savePolygonLockers(req, res) {
    const { polygon_id, lockers_data } = req.body;

    lockers = JSON.parse(lockers_data);

    //validar se todos os campos estão preenchidos
    if (lockers.length === 0) {
      return res.send("Please inform lockers!");
    }

    try {
      const lockers_array = lockers.map((locker) => ({ lat: locker.lat, lng: locker.lng }));

      await api.post('/lockers', {
        polygon_id,
        lockers: lockers_array
      })

      //redirecionamento
      return res.redirect("/polygons");
    } catch (err) {
      return res.send("Erro no banco de dados!");
    }
  },
  async instance(req, res) {
    try {
      const responseCustomers = await api.get(`/customers`)
      const customers = responseCustomers.data;
      const customersArray = customers.map((customer) => ([customer.lat, customer.lng]))

      const responseLockers = await api.get(`/lockers`)
      const lockers = responseLockers.data;
      const lockersArray = lockers.map((locker) => ([locker.lat, locker.lng]))


      const responsePolygons = await api.get('polygons');
      const polygons = responsePolygons.data.map((polygon) => {
        return {
          id: polygon.id,
          area: polygon.area,
          name: polygon.name,
          points: polygon.points
        }
      });

      return res.render('instance', {
        polygons: JSON.stringify(polygons),
        customers: JSON.stringify(customersArray),
        lockers: JSON.stringify(lockersArray)
      })
    } catch (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }
  },
  async polygonInstance(req, res){
    const id = req.params.id;
    const response = await api.get(`polygons/${id}/instance`)
    const instanceObj = response.data;
    return res.send(instanceObj.instance);
  },
  async lockersInstance(req, res){
    const response = await api.get('lockers/instance')
    const instanceObj = response.data;
    return res.send(instanceObj.instance);
  }
}
