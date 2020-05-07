// @flow
const DELIMITER = ',';
const DECIMAL_MARK = '.';
const DECIMAL_SCALE = 2;

export const commaFormat = (
  price: number | string,
  precision: number = DECIMAL_SCALE
): string => {
  if (typeof price === 'undefined') return '';
  let p: string = '';
  if (typeof price !== 'number' && typeof price !== 'string') return '';
  if (typeof price === 'number') p = price.toFixed(precision);
  else {
    p = price;
  }

  let parts = '',
    partInteger = p,
    partDecimal = '';
  if (precision > 0 && p.indexOf(DECIMAL_MARK) >= 0) {
    parts = p.split(DECIMAL_MARK);
    partInteger = parts[0];
    partDecimal = DECIMAL_MARK + parts[1].slice(0, precision);
  }
  partInteger = partInteger.replace(/(\d)(?=(\d{3})+$)/g, '$1' + DELIMITER);
  return `${partInteger}${partDecimal}`;
};
