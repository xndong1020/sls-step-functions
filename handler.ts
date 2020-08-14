import "source-map-support/register";

interface Data {
  x: number;
  y: number;
  n: number | null;
}

export const add = async ({ x, y }: Data): Promise<number> => {
  return x + y // if we specified ResultPath, then the result will be saved into ResultPath
};

export const double = async (n: number): Promise<number> => {
  return n * 2
};
