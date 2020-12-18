function savePolygon(db, polygon){
  return db.run(`
      INSERT INTO polygons(
          name,
          area
      ) VALUES (
          "${polygon.name}",
          "${polygon.area}"
      );
  `)
}

module.exports = savePolygon;