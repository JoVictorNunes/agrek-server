import { Test, TestingModule } from '@nestjs/testing';
import { SprayingsService } from 'customers/services/sprayings.service';

describe('SprayingssService', () => {
  let service: SprayingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SprayingsService],
    }).compile();

    service = module.get<SprayingsService>(SprayingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
