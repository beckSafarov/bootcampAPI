const advancedResults = (model, populate) => async (req, res, next) => {
  let query,
    //copy req.query
    reqQuery = { ...req.query };

  //fields to execute
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //remove the removeFields members
  removeFields.forEach((param) => delete reqQuery[param]);

  //turn the query into a string
  let queryStr = JSON.stringify(reqQuery);

  //convert lt, gt, etc into comparison operators
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte)|in\b/g,
    (match) => `$${match}`
  );

  //search for the queryStr, or required resource
  query = model.find(JSON.parse(queryStr));

  //Function for selecting certain fields
  if (req.query.select) {
    //join the selected fields. E.g. select=name,description, => [select description]
    const fields = req.query.select.split(',').join(' ');

    query = query.select(fields); //search for the selected fields
  }

  //Function for sorting
  if (req.query.sort) {
    // const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(req.query.sort);
  } else {
    query = query.sort('-createdAt');
  }

  //Function for pagination
  const page = parseInt(req.query.page, 10) || 1, //required page number
    limit = parseInt(req.query.limit, 10) || 10, //bootcamps per page
    startIndex = (page - 1) * limit, //the first bootcamp to be sent
    endIndex = page * limit, //the last bootcamp to be sent
    total = await model.countDocuments(); //total number of documents to be sent

  //start from startIndex bootcamp and show limit number of bootcamps per page
  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  //executing the query
  const results = await query;

  //object to store pagination results and stats
  const pagination = {};

  //data about the next page
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  //data about the previous page
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
