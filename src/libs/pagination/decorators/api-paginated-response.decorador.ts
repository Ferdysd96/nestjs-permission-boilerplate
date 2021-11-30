import { ResponseDto } from '../../../common/dtos';
import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { PaginationResponseDto } from '../pagination-response.dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiQuery({ name: 'orderBy', type: 'String', required: false }),
    ApiQuery({
      name: 'orderDirection',
      enum: ['ASC', 'DESC'],
      required: false,
    }),
    ApiQuery({ name: 'page', type: 'number', required: false, example: '1' }),
    ApiQuery({ name: 'limit', type: 'number', required: false, example: '20' }),
    ApiExtraModels(PaginationResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              payload: {
                allOf: [
                  { $ref: getSchemaPath(PaginationResponseDto) },
                  {
                    properties: {
                      content: {
                        type: 'array',
                        items: { $ref: getSchemaPath(model) },
                      },
                    },
                  },
                ],
              },
              timestamp: {
                type: 'number',
              },
            },
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({ description: 'Not authenticated' }),
    ApiForbiddenResponse({ description: 'Access denied' }),
    ApiNotFoundResponse({ description: 'Not found' }),
    ApiInternalServerErrorResponse({ description: 'Server error' }),
  );
};
