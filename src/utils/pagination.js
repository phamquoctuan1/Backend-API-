
exports.getPaginationData = (data, count,_page , _limit) => {
  const _totalRows = count;
  return { pagination: { _limit, _page, _totalRows }, data: data };
};
