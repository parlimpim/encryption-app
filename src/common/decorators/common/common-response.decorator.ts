import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto/response.dto';

export const ApiCommonResponse = <TModel extends Type<any>>({
  status,
  model,
  description,
  options,
}: {
  status: HttpStatus;
  model?: TModel;
  description?: string;
  options?: ApiResponseOptions;
}) => {
  return applyDecorators(
    ApiExtraModels(ResponseDto, model),
    ApiResponse({
      ...options,
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
                nullable: true,
              },
            },
          },
        ],
      },
    }),
  );
};
