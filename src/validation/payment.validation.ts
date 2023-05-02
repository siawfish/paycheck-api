import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint()
export class BankIDConstraint implements ValidatorConstraintInterface {
  public async validate(bank_detail: any) {
    const bank_id = bank_detail?.bank_id;
    if (bank_id) {
      return bank_id.length === 24 ? true : false;
    }
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return String(`bank ID must be a single String of 12 bytes or a string of 24 hex characters`);
  }
}
