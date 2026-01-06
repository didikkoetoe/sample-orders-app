const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
});

export const formatRupiah = (value) => {
  const numericValue = Number(value);
  return rupiahFormatter.format(Number.isFinite(numericValue) ? numericValue : 0);
};
