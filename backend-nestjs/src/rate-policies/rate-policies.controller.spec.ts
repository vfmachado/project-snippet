import { Test, TestingModule } from '@nestjs/testing';
import { RatePoliciesController } from './rate-policies.controller';
import { RatePoliciesService } from './rate-policies.service';

describe('RatePoliciesController', () => {
  let controller: RatePoliciesController;

  const mockServiceController = {
    //
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatePoliciesController],
      providers: [RatePoliciesService],
    })
      .overrideProvider(RatePoliciesService)
      .useValue(mockServiceController)
      .compile();

    controller = module.get<RatePoliciesController>(RatePoliciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
