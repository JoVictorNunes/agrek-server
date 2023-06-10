import { Test, TestingModule } from '@nestjs/testing';
import { SprayingsController } from 'customers/controllers/sprayings.controller';

describe('SprayingsController', () => {
  let controller: SprayingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SprayingsController],
    }).compile();

    controller = module.get<SprayingsController>(SprayingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
