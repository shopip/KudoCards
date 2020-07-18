import { Test, TestingModule } from '@nestjs/testing';
import { KudoController } from './kudo.controller';

describe('Kudo Controller', () => {
  let controller: KudoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KudoController],
    }).compile();

    controller = module.get<KudoController>(KudoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
