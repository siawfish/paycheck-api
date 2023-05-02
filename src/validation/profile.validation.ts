import { isURL, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint()
export class UrlConstraint implements ValidatorConstraintInterface {
  public async validate(url: string, args: ValidationArguments) {
    switch (true) {
      case !url:
        return true;
      case isURL(url):
        return true;
    }
    this.defaultMessage(args);
    // return false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return String(`${validationArguments.property} must be an URL address`);
  }
}
