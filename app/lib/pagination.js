import isNil from "lodash/isNil";

class Pagination {
  constructor(page, total, itemsPerPage = 10) {
    if (isNil(page)) page = 1;
    else page = parseInt(page);
    this.total = total;
    this.totalPages = Math.ceil(total / itemsPerPage);
    this.page = page;
    this.itemsPerPage = itemsPerPage;
  }

  toJSON() {
    return {
      pages: {
        page: this.page,
        total: this.total,
        totalPages: this.totalPages,
        itemsPerPage: this.itemsPerPage,
        nextLink: this.nextLink,
        prevLink: this.prevLink,
      },
    };
  }

  request() {
    return {
      limit: this.itemsPerPage,
      offset: (this.page - 1) * this.itemsPerPage,
    };
  }

  setNextLink(string) {
    if (
      this.total > this.itemsPerPage &&
      this.page * this.itemsPerPage < this.total &&
      this.page <= this.totalPages
    ) {
      this.nextLink = string;
    }
  }

  setPrevLink(string) {
    if (this.total > this.itemsPerPage && this.page - 1 > 0)
      this.prevLink = string;
  }
}

export default Pagination;
