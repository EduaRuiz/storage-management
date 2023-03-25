export interface IRepositoryBase<Entity> {
  create(entity: Entity): Promise<Entity>;
  update(entityId: string, entity: Entity): Promise<Entity>;
  delete(entityId: string): Promise<Entity>;
  findAll(): Promise<Entity[]>;
  findOneById(entityId: string): Promise<Entity>;
}
