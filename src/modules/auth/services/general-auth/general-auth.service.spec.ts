import { Test, TestingModule } from '@nestjs/testing';
import { GeneralAuthService } from './general-auth.service';

describe('GeneralAuthService', () => {
  let service: GeneralAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneralAuthService],
    }).compile();

    service = module.get<GeneralAuthService>(GeneralAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
