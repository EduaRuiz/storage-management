import { IStockEventFromStorageDomain } from '@inventory/domain/interfaces';

export interface IRegisteredInventoryTransferMap {
  stockOut: IStockEventFromStorageDomain;
  stockIn: IStockEventFromStorageDomain;
}
