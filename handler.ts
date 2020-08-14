import "source-map-support/register";

interface Data {
  name: string;
}

export const hello = async ({ name }: Data) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Hello ${name}`,
      },
      null,
      2
    ),
  };
};
