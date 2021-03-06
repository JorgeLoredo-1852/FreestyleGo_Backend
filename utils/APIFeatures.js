class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1A ) Normal filtering             (?registrationPrice=50&format=1vs1)
    const queryObj = { ...this.queryString };
    const excludedFields = ["limit", "sort", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //1B ) Advanced filtering           (?registrationPrice[gte]=10&format=1vs1)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`); //Replace { gte : '5'} to { $gte: 5}

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    //(?sort=registrationPrice) or (?sort=-registrationPrice) or (?sort=registrationPrice,date)
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("date");
    }

    return this;
  }

  limitFields() {
    //(?fields=name,eventType,date)
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
}

module.exports = APIFeatures;
