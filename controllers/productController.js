const database = require('../services/database');

exports.getAllProducts = async (req, res) => {
    try {
      const result = await database.pool.query(`
                          select p.id,p.name,p.description,p.price,p.currency,
                          p.quantity,p.active,p.created_date,p.updated_date,
                          (select ROW_TO_JSON(category_obj) from(
                          select id,name from category where id = p.category_id
                          )category_obj) as category
                          from product p	`);
      return res.status(200).json(result.rows);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  exports.createProduct = async (req,res) => {
    try {
            const existsResult = await database.pool.query({
                text : 'select exists (select * from category where id=$1) ',
                values: [req.body.category_id] 
            })
            if(!existsResult.rows[0].exists)
            {
                return res.status(422).json({error : 'category id not found'})
            }
        const result = await database.pool.query({
            text : `insert into product (name,description,price,currency,quantity,active,category_id)
            values ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *`,    
            values :[
                req.body.name,
                req.body.description ? req.body.description : null,
                req.body.price,
                req.body.currency ? req.body.currency : 'USD',
                req.body.quantity ? req.body.quantity : 0,
                'active' in req.body ? req.body.active : true,
                req.body.category_id
            ]
    })

    return res.status(201).json(result.rows[0])
    }catch(error){
        return res.status(500).json({error : error.message})
    }
    
  }

  exports.updateProduct = async (req,res) =>
  {
    try{
        const existsResult = await database.pool.query({
            text : 'select exists (select * from category where id=$1) ',
            values: [req.body.category_id] 
        })
        if(!existsResult.rows[0].exists)
        {
            return res.status(422).json({error : 'category id not found'})
        }
        
            const result = await database.pool.query({
                text : `update product 
                        set name = $1,description=$2,price=$3,currency=$4,quantity=$5,active=$6,category_id=$7,updated_date= current_timestamp
                        where id = $8
                        returning * `,
                values : [req.body.name,
                    req.body.description,
                    req.body.price,
                    req.body.currency,
                    req.body.quantity,
                    req.body.active,
                    req.body.category_id,
                req.params.id]
            })
    if(result.rowCount == 0 ){
        return res.status(404).json({error:"product not found!"})
    }
    return res.status(200).json(result.rows[0])
        }
    catch(error){
        return res.status(500).json({error : error.message})
    }
  }

  exports.deleteProduct = async (req,res) => {
    try{
        const result = await database.pool.query({
            text : 'delete from product where id=$1',
            values:[req.params.id]
        })
        if(result.rowCount == 0){
            return res.status(404).json({error:"product not found"})
        }
        return res.status(204).send();
    }catch(error){
        return res.status(500).json({error:error.message})
    }
  }
  
  exports.softDelete = async (req,res) => {
    try{
         const result = await database.pool.query({
            text : 'UPDATE product SET soft_deleted = TRUE WHERE id = $1 RETURNING *',
            values : [req.params.id]
         })
         if (result.rows.length === 0) {
            return res.status(404).send({ message: 'Product does not exist!' });
        }
        res.status(200).json({message: `${result.rows[0].name} soft deleted successfully `});
    }catch(error)
    {
        return res.status(500).json({error : error.message})
    }
  }
  exports.getActiveProducts = async (req,res) => {
    try{
          const result = await database.pool.query('select * from product where soft_deleted = false')  
        return res.status(200).json(result.rows);
        
        }
    catch(error){
        return res.status(500).json({error : error.message})
    }
  }

  exports.getProductById = async (req,res) => {
    try{
       
        const result = await database.pool.query({
            text : `select p.id,p.name,p.description,p.price,p.currency,
                          p.quantity,p.active,p.created_date,p.updated_date,
                          (select ROW_TO_JSON(category_obj) from(
                          select id,name from category where id = p.category_id
                          )category_obj) as category
                          from product p
                          where p.id = $1`,
            values : [req.params.id]
        })
        if(result.rowCount == 0 ){
            return res.status(404).json({error: "product not found !!"})
        }
        return res.status(200).json(result.rows[0])
    }catch(error){
        return res.status(500).json({error:error.message})
    }
  }

  exports.getProductsByCategoryId = async (req, res) => {
    try {
        const existsResult = await database.pool.query({
            text : 'select exists (select * from category where id=$1) ',
            values: [req.params.id] 
        })
        if(!existsResult.rows[0].exists)
        {
            return res.status(404).json({error : 'category id not found'})
        }
        const result = await database.pool.query({
            text: `
            SELECT p.id, p.name, p.description, p.price, p.currency, 
                p.quantity, p.active, p.created_date, p.updated_date,
                
                (SELECT ROW_TO_JSON(category_obj) FROM (
                    SELECT id, name FROM category WHERE id = p.category_id
                ) category_obj) AS category
                
            FROM product p   
            WHERE p.category_id = $1`,
            values: [req.params.id]
        })
        return res.status(200).json(result.rows)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

  exports.JsonData = async (req,res) => {
    try{
        const result = await database.pool.query({
            text : 'UPDATE product SET json_d = $1 WHERE id = $2 RETURNING *',
            values : [req.body,req.params.id]
        })
        if (result.rowCount === 0) {
            return res.status(404).send({ error: 'Row not found' });
        }
        res.status(200).send({
            message: 'JSON data updated successfully',
            updatedData: result.rows[0],
        });
    }catch(error){
        return res.status(500).json({error : error.message})
    }
}