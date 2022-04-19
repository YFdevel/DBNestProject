import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DecrementBodyId = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    data.forEach((element) => {
      let idBody = request.body[element];
      if (idBody) {
        request.body[element] = idBody - 1;
      }
    });
    return data;
  },
);
