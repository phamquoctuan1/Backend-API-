exports.getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};
exports.getPaginationData = (data, _page = 0, _limit = 10) => {
  const _totalRows = data.length;
  return { pagination: { _limit, _page, _totalRows }, data: data };
};
