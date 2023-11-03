const Product = require('../models/product')

const getAllProductsStatic = async (req,res) =>{
    const search = 'ac'
    const products = await Product.find({price :{$gt:30}})
                                    .sort('price')
                                    .select('name price')
                                    .limit(10)
                                    .skip(1)
    res.status(200).json({products,nbHits:products.length})
}

const getAllProducts = async (req,res) =>{
    const {featured,company,name,sort,fields,numericFilters} = req.query
    const queryObject = {}
    if(featured){
        queryObject.featured = featured === 'true'?true:false
    }
    if(company){
        queryObject.company = company
    }
    if(name){
        queryObject.name = { $regex: name, $options:'i'}//options i indicates case insensitive
        //$regex is a query operator
    }
    if(numericFilters){
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regEx=/\b(<|>|>=|<=|=)\b/g
        let filters = numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)

        const options = ['price','rating'];
        filters = filters.split(',').forEach((item) => {
            const [fields,operator,value] = item.split('-')
            if(options.includes(fields)){
                queryObject[fields] = {[operator]:Number(value)}
            }
        });
    }




    console.log(queryObject)
    let result = Product.find(queryObject)
    if(sort){
        const sortList = sort.split(',').join(' ');//name -price
        result = result.sort(sortList)
    }
    else{
        result = result.sort('craetedAt')
    }

    if(fields){
        const fieldsList = fields.split(',').join(' ');//rating company
        result = result.select(fieldsList)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1) * limit;
    // 23 prod  4 pages 7 7 7 2 

    result = result.skip(skip).limit(limit)
    const products = await result 
    res.status(200).json({products,nbHits:products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}

/*Sort is used to specify the order of the results (ascending or descending) based on 
one or more fields.
Select is used to choose which fields to include or exclude from the returned documents. */