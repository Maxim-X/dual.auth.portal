import { Test, TestingModule } from '@nestjs/testing';
import { GeneralAuthController } from './general-auth.controller';

describe('GeneralAuthController', () => {
  let controller: GeneralAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralAuthController],
    }).compile();

    controller = module.get<GeneralAuthController>(GeneralAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
