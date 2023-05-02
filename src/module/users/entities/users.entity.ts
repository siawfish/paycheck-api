import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

export enum WorkStatus {
  BLOCKED = 'blocked',
  NOT_WORKING = 'not_working',
  WORKING = 'working',
}

export enum LanguageType {
  HEBREW = 'Hebrew',
  ENGLISH = 'English',
}

export enum UserType {
  FREELANCER = 'freelancer',
  DELIVERY = 'delivery',
}
export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export enum FieldNameApprovalFreelancerProfile {
  full_name = 'full_name',
  email = 'email',
  phone_number = 'phone_number',
  companies = 'companies',
  personal_accidents_insurance_url = 'personal_accidents_insurance_url',
  insurance_policy_url = 'insurance_policy_url',
  pension_policy_url = 'pension_policy_url',
  life_insurance_url = 'life_insurance_url',
  health_insurance_url = 'health_insurance_url',
}

export enum FieldNameApprovalDeliveryProfile {
  full_name = 'full_name',
  email = 'email',
  phone_number = 'phone_number',
  companies = 'companies',
  personal_accidents_insurance_url = 'personal_accidents_insurance_url',
  insurance_policy_url = 'insurance_policy_url',
  car_license_url = 'car_license_url',
  pension_policy_url = 'pension_policy_url',
  life_insurance_url = 'life_insurance_url',
  health_insurance_url = 'health_insurance_url',
  driving_license_url = 'driving_license_url',
}

export enum FieldNameUpdateApproval {
  full_name = 'full_name',
  email = 'email',
  companies = 'companies',
}

export enum FieldNameNoApproval {
  language = 'language',
  password_hashed = 'password_hashed',
  personal_id = 'personal_id',
  country_code = 'country_code',
  avatar_url = 'avatar_url',
  employment_name = 'employment_name',
  role = 'role',
  work_status = 'work_status',
  fcm_token = 'fcm_token',
}

export enum VerifyType {
  INVALID = 'invalid',
  PENDING = 'pending',
  APPROVED = 'approved',
  PENDING_ADMIN = 'pending_admin',
}

@Entity('users')
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: 'Value is a single String of 12 bytes or a string of 24 hex characters',
    example: '6217499149d2c6a17cdc702b',
  })
  @ObjectIdColumn({ name: '_id' })
  _id: string;

  @Exclude()
  @Column()
  password_hashed: string;

  @ApiProperty({
    example: 'vu quyet',
  })
  @Column()
  full_name: string;

  @ApiProperty({
    example: 'pending',
  })
  @Column({ type: 'enum', enum: VerifyType, default: VerifyType.PENDING })
  full_name_approval: string;

  @ApiProperty({
    example: 'Ha Noi',
  })
  @Column()
  address: string;

  @ApiProperty({
    example: 'pending',
  })
  address_approval: string;

  @ApiProperty({
    example: '+84',
  })
  @Column()
  country_code: string;

  @ApiProperty({
    example: '964816205',
  })
  @Column({ nullable: false })
  phone_number: string;

  @ApiProperty({
    example: 'pending',
  })
  @Column('enum', {
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  phone_number_approval: string;

  @ApiProperty({
    example: 'phamthanh.hung.work@gmail.com',
  })
  @Column({ nullable: false })
  email: string;

  @ApiProperty({
    example: 'pending',
  })
  @Column('enum', {
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  email_approval: string;

  @ApiProperty({
    example: null,
  })
  @Column()
  employment_id: string;

  @ApiProperty({
    example: null,
  })
  @Column()
  employment_id_approval: string;

  @ApiProperty({
    example: null,
  })
  @Column()
  employment_name: string;

  @ApiProperty({
    example: null,
  })
  @Column()
  identity_number: string;

  @ApiProperty({
    example: 'null',
  })
  @Column()
  identity_number_approval: string;

  @ApiProperty({
    example: 'not_working',
  })
  @Column({ type: 'enum', enum: WorkStatus, default: WorkStatus.NOT_WORKING })
  work_status: string;

  // @ApiProperty({
  //   example: 'not_working',
  // })
  // @Column({ type: 'enum', enum: VerifyType, default: VerifyType.PENDING })
  // unify_status: string;

  @ApiProperty({
    example: 'user',
  })
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: string;

  @ApiProperty({
    example: 'freelancer',
  })
  @Column({ type: 'enum', enum: UserType, default: UserType.FREELANCER })
  freelancer_type: string;

  @ApiProperty({
    example: 'English',
  })
  @Column({ type: 'enum', enum: LanguageType, default: LanguageType.ENGLISH })
  language: string;

  @ApiProperty({
    example: 'Viet Nam',
  })
  @Column({ nullable: false })
  country: string;

  @ApiProperty({
    example: ['625d2245f9c10da8a564906d', '625d2333eb64abb4ae08f66d', '625d233deb64abb4ae08f66e'],
  })
  @Column({ nullable: false })
  companies: Array<string>;

  @ApiProperty({
    example: 'pending',
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  companies_approval: VerifyType;

  @ApiProperty({
    example: '053605416',
  })
  @Column({ nullable: false })
  personal_id: string;

  @ApiProperty({
    example: null,
  })
  @Column({ nullable: true, default: 'hung' })
  workFor: string;

  // The types below are file formats

  @ApiProperty({
    example: null,
  })
  @Column({ nullable: true, default: null, type: 'longtext', length: 500 })
  avatar_url: string;

  @ApiProperty({
    example: null,
  })
  @Column({ length: 500, nullable: true })
  identity_card_url: string;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  identity_card_url_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ length: 500, nullable: true })
  form_101_url: string;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  form_101_url_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ length: 500, nullable: true })
  hiring_contract_url: string;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  hiring_contract_url_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ length: 500, nullable: true })
  personal_accidents_insurance_url: string;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  personal_accidents_insurance_url_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ length: 500, nullable: true })
  insurance_policy_url: string;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  insurance_policy_url_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ length: 500, nullable: true })
  car_license_url: string;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'simple-enum',
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  car_license_url_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ length: 500, nullable: true })
  pension_policy_url: string;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  pension_policy_url_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ length: 500, nullable: true })
  driving_license_url: string;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  driving_license_url_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ length: 500, nullable: true })
  life_insurance_url: string;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  life_insurance_url_approval: VerifyType;

  @ApiProperty({
    example: null,
  })
  @Column({ length: 500, nullable: true })
  health_insurance_url: string;

  @ApiProperty({
    example: null,
  })
  @Column({
    type: 'enum',
    nullable: true,
    enum: VerifyType,
    default: VerifyType.PENDING,
  })
  health_insurance_url_approval: VerifyType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
