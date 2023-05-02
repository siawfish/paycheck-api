import { isNotEmpty, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint()
export class IdentityIDConstraint implements ValidatorConstraintInterface {
  public async validate(identityID: string) {
    if (isNotEmpty(identityID)) {
      if (identityID.length > 9 || identityID.length < 5) {
        return false;
      }
      identityID = identityID.length < 9 ? ('00000000' + identityID).slice(-9) : identityID;

      return (
        Array.from(identityID, Number).reduce((counter, digit, i) => {
          const step = digit * ((i % 2) + 1);
          return counter + (step > 9 ? step - 9 : step);
        }) %
          10 ===
        0
      );
    }

    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return String(` Israeli ID:{${validationArguments.value}} invalid `);
  }
}
@ValidatorConstraint()
export class EmailConstraint implements ValidatorConstraintInterface {
  validate(email: string): boolean | Promise<boolean> {
    if (email) {
      const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (re.test(email)) {
        return true;
      }
      return false;
    }
    return true;
  }
}

@ValidatorConstraint()
export class FullNameConstraint implements ValidatorConstraintInterface {
  public async validate(fullName: string) {
    if (fullName?.split(' ').length < 2 && fullName) return false;
    return true;
  }
}

@ValidatorConstraint()
export class PasswordConstraint implements ValidatorConstraintInterface {
  public async validate(password: string) {
    if (password?.length < 6 && password) return false;
    return true;
  }
}

@ValidatorConstraint()
export class AddressConstraint implements ValidatorConstraintInterface {
  public async validate(address: string) {
    if ((address?.length < 6 && address) || (address?.split(' ').length < 2 && address)) return false;
    return true;
  }
}
