import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DecrementQueryId = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    data.forEach((element) => {
      let idQuery = request.query[element];
      if (idQuery) {
        request.query[element] = idQuery - 1;
      }
    });
    return data;
  },
);
