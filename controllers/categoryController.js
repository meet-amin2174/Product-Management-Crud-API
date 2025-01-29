const database = require('../services/database');


exports.getAllCategories = async (req, res) => {
    try {
      const result = await database.pool.query("select * from category order by id asc");
      return res.status(200).json(result.rows);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

exports.getCategoryById = async (req,res) => {
  try{

      const result = await database.pool.query({
        text : 'select * from category where id=$1',
        values: [req.params.id]
      })
      if(result.rowCount==0){
        return res.status(404).json({error : "category not found"})
      }
      return res.status(200).json(result.rows[0])
  }catch(error){
    return res.status(500).json({error : error.message})
  }
  
}

exports.createCategory = async (req,res) => {
  try{
    const existsResult = await database.pool.query({
      text : 'select exists ( select * from category  where name = $1 )',
              values : [req.body.name]
    })
    if(existsResult.rows[0].exists){
      return res.status(409).json({error: `Category ${req.body.name} already exists !!! `})
    }
    const result = await database.pool.query({
      text : 'insert into category (name) values ($1) RETURNING *',
      values : [req.body.name]
    })
      return res.status(201).json(result.rows[0])
      
  }catch(error){
    return res.status(500).json({error:error.message})
  }
}

exports.updateCategory = async (req,res) => {
  try{
    const existsResult = await database.pool.query({
      text : 'select exists ( select * from category  where name = $1 )',
              values : [req.body.name]
    })
    if(existsResult.rows[0].exists){
      return res.status(409).json({error: `Category ${req.body.name} already exists !!! `})
    }
       const result = await database.pool.query({
        text : `update category set name = $1 , updated_date = current_timestamp
                where id = $2 returning *`,
        values : [req.body.name,req.params.id]
       })
       if(result.rowCount == 0){
        res.status(404).json({error : "category not found !"})
       }
       return res.status(200).json(result.rows[0])
  
      }catch(error){
    return res.status(500).json({error : error.message});
  }
}

exports.deleteCategory = async (req,res) => {
  try{
    const countResult = await database.pool.query({
      text : `select count(*)
from product where category_id = $1`,
values : [req.params.id]
    })
    if(countResult.rows[0].count>0){
return res.status(409).json({error : `category is being used in ${countResult.rows[0].count} products !! `})
    }
      const result = await database.pool.query({
        text : 'delete from category where id=$1',
        values : [req.params.id]
      })
      if(result.rowCount == 0){
        return res.status(404).json({error:"category not found"})
      }
      return res.status(204).send();
  }catch(error){
    return res.status(500).json({error : error.message})
  }
}