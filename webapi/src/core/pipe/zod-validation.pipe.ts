import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      console.log(error.issues);

      let contentError: string = error.issues[0].message;
      if (error.issues.length > 1) {
        for (let i = 1; i < error.issues.length; i++) {
          contentError = `${contentError}; ${error.issues[i].message}`;
        }
      }

      throw new BadRequestException(
        `Erreur de validation des données : ${contentError}`,
      );
    }
  }
}
