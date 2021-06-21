export const uuid = (() => {
  const uuid = (function* uuid() {
    let counter = 0;

    while (true)
      yield (counter = (counter + 1) % 1000).toString().padEnd(3, "0") +
        parseInt(Date.now().toString(2).split("").reverse().join(""), 2)
          .toString()
          .padEnd(15, "0");
  })();

  return () => uuid.next().value;
})();

export const hex = (() => {
  const hex = "0123456789abcdef";

  return (length: number) =>
    new Array(length)
      .fill("")
      .map(() => hex[Math.floor(Math.random() * hex.length)])
      .join("");
})();
