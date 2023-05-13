import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmsOtp } from './entities/sms-otp.entity';
import { SendOtpDto } from './dto/create-sms-otp.dto';
import * as dotenv from 'dotenv';
import * as request from 'request';
dotenv.config();

@Injectable()
export class SmsOtpService {
  constructor(
    @InjectRepository(SmsOtp)
    private readonly SmsOtpRepository: Repository<SmsOtp>,
  ) {}

  async create(userId: string, phone_number: string) {
    const otp = String(Math.floor(1000 + Math.random() * 9999));
    const ttl = 2 * 60 * 1000;
    const expires = Date.now() + ttl;
    const hash = await bcrypt.hash(otp, 10);
    const save = {
      userId: userId,
      expires: expires,
      hash: hash,
    };
    console.log('🚀 ~ OTP -----> ', otp);
    await this.SmsOtpRepository.save(save);
    await this.sendOTP({ phone_number: phone_number, OTP: otp });
  }

  async sendOTP(inf: SendOtpDto) {
    console.log('🚀 ~ file: sms-otp.service.ts ~ line 48 ~ SmsOtpService ~ inf', inf);
    const options = {
      method: 'POST',
      url: 'https://my.textme.co.il/api',
      headers: { 'Cache-Control': 'no-cache', 'Content-Type': 'application/xml' },
      body: `
      <?xml version='1.0' encoding='UTF-8'?>\r\n
            <sms>\r\n
            <user>\r\n
            <username>${process.env.USERNAME_TEXtME}</username>\r\n
            <password>${process.env.PASSWORD_TEXtME}</password>\r\n
            </user>\r\n
            <source>TextMe</source>\r\n
            <destinations>\r\n
            <phone id=''>${inf.phone_number}</phone>\r\n
            </destinations>\r\n
            <message>OTP: ${inf.OTP}</message>\r\n
           </sms>
      `,
    };

    try {
      request.post(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(query: any): Promise<SmsOtp> {
    const payment = await this.SmsOtpRepository.findOne({ where: query, order: { createdAt: -1 } });
    if (payment) {
      payment._id = payment._id.toString();

      return payment;
    }
    return null;
  }
}
