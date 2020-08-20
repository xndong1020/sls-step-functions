// import "source-map-support/register";

// interface Data {
//   x: number;
//   y: number;
//   n: number | null;
// }

// class NumberIsTooBigError extends Error {
//   constructor(n: number) {
//     super(`${n} is too big`)
//     this.name = 'NumberIsTooBigError'
//     Error.captureStackTrace(this, NumberIsTooBigError)
//   }
// }

// export const add = async ({ x, y }: Data): Promise<number> => {
//   return x + y // if we specified ResultPath, then the result will be saved into ResultPath
// };

// export const double = async (n: number): Promise<number> => {
//   if (n > 50) throw new NumberIsTooBigError(n)
//   return n * 2
// };

// export const doubleBigNumber = async (n: number): Promise<number> => {
//   return n * 10
// };

// export const print = async (event, _context): Promise<void> => {
//   console.log(JSON.stringify(event))
// }

export const handleSQS = async (event, _context): Promise<void> => {
  console.log(JSON.stringify(event))
}

