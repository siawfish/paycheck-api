export enum KeyType {
  REGISTER = 'register',
  PROFILE = 'profile',
  PAYMENT = 'payment',
}

export enum KeyAdmin {
  INVOICE = 'invoice',
  PAYCHECK = 'pay_check',
  BANKTRANSFER = 'bank_transfer',
  COMPANY = 'company',
}

export enum FieldNameOfFileType {
  //Files in user
  personal_accidents_insurance_url = 'personal_accidents_insurance_url',
  identity_card_url = 'identity_card_url',
  form_101_url = 'form_101_url',
  hiring_contract_url = 'hiring_contract_url',
  insurance_policy_url = 'insurance_policy_url',
  car_license_url = 'car_license_url',
  pension_policy_url = 'pension_policy_url',
  driving_license_url = 'driving_license_url',
  life_insurance_url = 'life_insurance_url',
  health_insurance_url = 'health_insurance_url',
  avatar_url = 'avatar_url',
  //Files in payment
  tax_coordinations_urls = 'tax_coordinations_urls',
  social_security_coordinations_urls = 'social_security_coordinations_urls',
  approval_of_illness_urls = 'approval_of_illness_urls',
  release_papers_url = 'release_papers_url',
  disability_approval_url = 'disability_approval_url',
  military_work_permit_url = 'military_work_permit_url',
  additional_documents_urls = 'additional_documents_urls',
}

export class UploadFile {
  file_url: Array<string>;
  file_name: string;
}
