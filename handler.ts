import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";

export const hello: APIGatewayProxyHandler = async ({ name }) => {
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
