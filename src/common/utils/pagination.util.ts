export const getPagination = (page?: string, limit?: string) => {
  const pageNum = page ? parseInt(page, 10) : 1;
  const limitNum = limit ? parseInt(limit, 10) : 10;
  const skip = (pageNum - 1) * limitNum;

  return { skip, take: limitNum };
};
