import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DecrementParamId = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    data.forEach((element) => {
      let idParam = request.params[element];
      if (idParam) {
        request.params[element] = idParam - 1;
      }
    });
    return data;
  },
);
