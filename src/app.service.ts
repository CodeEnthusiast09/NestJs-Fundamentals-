import { Inject, Injectable } from '@nestjs/common';
import { DevConfigService } from './common/providers/DevConfigService';

@Injectable()
export class AppService {
  constructor(
    private devConfigService: DevConfigService,
    @Inject('CONFIG')
    private config: { port: string },
  ) {
    console.log(this.config);
  }
  getHello(): string {
    return `Hello I am learning Nest.js Fundamentals, Host: ${this.devConfigService.getDBHOST()}, PORT: ${this.config.port}`;
  }
}
