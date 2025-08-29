export default function paginate<T>(
  data: T[],
  page: string | null,
  limit: number = 20
) {
  if (!page) return { paginatedData: data, hasNextPage: false };

  const pageNumber = parseInt(page);
  const start = (pageNumber - 1) * limit;
  const end = start + limit;

  const paginatedData = data.slice(start, end);
  const hasNextPage = end < data.length;

  return {
    paginatedData,
    hasNextPage,
    currentPage: pageNumber,
    totalPages: Math.ceil(data.length / limit),
  };
}
