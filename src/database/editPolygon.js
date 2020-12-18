function editPolygon(db, polygon){
  return db.run(`
      UPDATE polygons SET name = "${polygon.name}", area = "${polygon.area}"
      WHERE ID = "${polygon.id}"      
  `)
}

module.exports = editPolygon;