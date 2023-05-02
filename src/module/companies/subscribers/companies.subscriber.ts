import { Injectable } from '@nestjs/common';
import { CompanyFile } from 'src/module/company-file/entities/company-file.entity';
import { EventSubscriber, EntitySubscriberInterface, LoadEvent, Repository } from 'typeorm';
import { Company } from '../entities/company.entity';

@Injectable()
@EventSubscriber()
export class CompaniesSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Company;
  }

  async afterLoad(entity: any, event?: LoadEvent<Company>) {
    const cfRepository: Repository<CompanyFile> = event.connection.manager.getRepository<CompanyFile>('company_files');

    //Find document of company
    const files = await cfRepository.find({ company_id: entity._id.toString() });
    files.forEach((value, i) => {
      files[i]._id = files[i]._id.toString();
    });
    entity.files = files;
  }
}
