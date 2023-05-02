import { isPhoneNumber, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint()
export class IDConstraint implements ValidatorConstraintInterface {
  public async validate(id: string) {
    if (id) {
      return id.length === 24 ? true : false;
    }
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return String(`${validationArguments.property} must be a single String of 12 bytes or a string of 24 hex characters`);
  }
}

@ValidatorConstraint()
export class IDSConstraint implements ValidatorConstraintInterface {
  public async validate(ids: Array<string>) {
    ids.forEach((value) => {
      if (!isID(value)) {
        return false;
      }
    });
    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return String(`${validationArguments.property} must be a single String of 12 bytes or a string of 24 hex characters`);
  }
}

@ValidatorConstraint()
export class PhoneNumberIsarelConstraint implements ValidatorConstraintInterface {
  public async validate(phoneNumber: string) {
    if (phoneNumber.length > 9) {
      phoneNumber = phoneNumber.slice(1, 10);
    }

    phoneNumber = `+972${phoneNumber}`;
    return isPhoneNumber(phoneNumber);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return String(`${validationArguments.property} Phone Number Isarel Constraint`);
  }
}

export const isID = (id: string) => {
  if (id) {
    return id.length === 24 ? true : false;
  }
  return false;
};
