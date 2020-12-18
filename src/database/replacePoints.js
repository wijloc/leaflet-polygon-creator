async function replacePoints(db, {id, points}){

  let stringArray = []  
  points.forEach(element => {
    stringArray.push(`(${id}, ${element[0]}, ${element[1]})`);
  });  
  const pointsText = stringArray.join(',')

  db.run(`
      DELETE FROM points
        WHERE polygon_id = ${id}
  `)

  return db.run(`
      INSERT INTO points(
        polygon_id,
        lat,
        lng
      ) VALUES ${pointsText}      
  `)
}

module.exports = replacePoints;