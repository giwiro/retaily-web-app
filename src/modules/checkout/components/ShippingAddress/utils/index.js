// @flow
import type {Address} from '../../../../../entities';

export function mapToAddress(
  data: {[key: string]: string},
  idPrefix: string
): Address {
  const r = {};
  Object.keys(data)
    .filter(k => k.startsWith(idPrefix))
    .forEach(k => {
      const newKey = k
        .replace(idPrefix + '-', '')
        .replace(/-(.)/g, (match, group) => group.toUpperCase());
      r[newKey] = data[k];
    });
  return r;
}
