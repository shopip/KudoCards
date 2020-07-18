import { Test, TestingModule } from '@nestjs/testing';
import { AgiliboNotificationService } from './agilibo-notification.service';

describe('AgiliboNotificationService', () => {
  let service: AgiliboNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgiliboNotificationService],
    }).compile();

    service = module.get<AgiliboNotificationService>(AgiliboNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
