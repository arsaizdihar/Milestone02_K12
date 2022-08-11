export function toRupiah(number: number) {
  return (
    'Rp' +
    number.toLocaleString('id', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
