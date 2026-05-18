import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.ObjectSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata): unknown {
    const { error } = this.schema.validate(value);

    if (error) {
      throw new BadRequestException(
        error.details[0]?.message ?? 'Validation failed',
      );
    }

    return value;
  }
}
