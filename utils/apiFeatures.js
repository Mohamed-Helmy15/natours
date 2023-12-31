class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    if (this.queryStr.duration) {
      this.query = this.query.where("duration").lt(this.queryStr.duration);
    }
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-ratingsAverage");
    }
    return this;
  }

  limitingFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagintate() {
    if (this.queryStr.page) {
      const page = this.queryStr.page * 1 || 1;
      const limit = this.queryStr.limit * 1 || 100;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}
module.exports = APIFeatures;
