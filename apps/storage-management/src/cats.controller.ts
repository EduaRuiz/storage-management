import { Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';
@Controller()
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  findAll() {
    return this.catsService.findAll();
  }
}
