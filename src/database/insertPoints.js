async function insertPoints(db, data){

  const results = await db.all(
    `SELECT MAX(id) AS id FROM polygons`
  );
  const id = results[0].id;

  let points = []  
  data.points.forEach(element => {
    points.push(`(${id}, ${element[0]}, ${element[1]})`);
  });  
  const pointsText = points.join(',')

  return db.run(`
      INSERT INTO points(
        polygon_id,
        lat,
        lng
      ) VALUES ${pointsText}      
  `)
}

module.exports = insertPoints;