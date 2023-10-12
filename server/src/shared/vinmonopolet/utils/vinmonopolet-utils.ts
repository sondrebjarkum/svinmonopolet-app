// //Some store names contain commas, this function checks if that is the case, if so, formats it for sqlite3.
// export function formatVinmonopoletStoreName2(name: string) {
//   if (name.includes(',') || name.includes(' ') || name.includes('&')) {
//     if (name.includes('.')) {
//       name = name.substring(0, name.length - 1);
//     }
//     return name.replace(/[,& ]+/g, '_');
//   } else {
//     return name;
//   }
// }

export function formatVinmonopoletStoreName(name: string) {
  const formatted = name.split(',')[1];
  if (!formatted) {
    return name;
  }
  return formatted.trim();
}
