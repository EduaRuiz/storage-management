import { MessagePattern, Payload } from '@nestjs/microservices';
import { LocationService, StockService } from '../persistance/services';
import { Controller } from '@nestjs/common';
import { StockInventoryEventManagerUseCase } from '../../application/use-cases';
import { Observable, tap } from 'rxjs';
import { StockDomainModel } from '../../domain/models';

@Controller()
export class StorageEventController {
  constructor(
    private readonly stock$: StockService,
    private readonly location$: LocationService,
  ) {}

  @MessagePattern('registered-inventory-movement')
  inscriptionCommitted(@Payload() data: string): Observable<StockDomainModel> {
    const stockInventoryEventManagerUseCase =
      new StockInventoryEventManagerUseCase(this.stock$, this.location$);
    return stockInventoryEventManagerUseCase
      .execute(JSON.parse(data)?.stock)
      .pipe(
        tap(() => {
          console.log('registered-inventory-movement');
        }),
      );
  }
}
