import { Test, TestingModule } from '@nestjs/testing';
import { AgiliboService } from './agilibo.service';

describe('AgiliboService', () => {
  let service: AgiliboService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgiliboService],
    }).compile();

    service = module.get<AgiliboService>(AgiliboService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
