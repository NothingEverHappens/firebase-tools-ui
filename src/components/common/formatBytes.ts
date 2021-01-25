function formatNumber(num: number) {
  var parts = num.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (+parts[1] === 0) {
    return parts[0];
  }
  return parts.join('.');
}

export function formatBytes(bytes: number) {
  const threshold = 1000;
  if (Math.round(bytes) < threshold) {
    return bytes + ' B';
  }
  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let u = -1;
  let formattedBytes = bytes;
  do {
    formattedBytes /= threshold;
    u++;
  } while (Math.abs(formattedBytes) >= threshold && u < units.length - 1);
  return formatNumber(formattedBytes) + ' ' + units[u];
}
