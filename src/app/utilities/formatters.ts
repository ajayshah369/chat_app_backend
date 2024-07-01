export const titleCase = (val: string): string => {
  return val
    .split(" ")
    .map((e) => {
      return e[0].toLocaleUpperCase() + e.substring(1).toLocaleLowerCase();
    })
    .join(" ");
};
