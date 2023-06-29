import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { assert } from 'console';
import { Organization } from 'src/organizations/entities/organization.entity';
import { CreateRatePolicyDto } from './dto/create-rate-policy.dto';
import { RatePolicy } from './entities/rate-policy.entity';
import { RatePolicyType } from './enums/rate-policy.enum';
import { RatePoliciesService } from './rate-policies.service';

describe('RatePoliciesService', () => {
  let service: RatePoliciesService;

  const mockRatePoliciesData = [];
  let id = 1;

  const mockOrgazanitionsRepository = {
    findOne: jest.fn((id) => {
      return { id };
    }),
  };

  const mockRatePoliciesRepository = {
    create: jest.fn((dto) => {
      return {
        id: id++,
        ...dto,
      };
    }),

    save: jest.fn((entity) => {
      mockRatePoliciesData.push(entity);
      return entity;
    }),

    update: jest.fn((id, dto) => {
      const idx = mockRatePoliciesData.findIndex((e) => e.id === id);
      mockRatePoliciesData[idx] = {
        ...mockRatePoliciesData[idx],
        ...dto,
        updatedAt: new Date(),
      };
      return mockRatePoliciesData[idx];
    }),

    findOne: jest.fn((id) => {
      const idx = mockRatePoliciesData.findIndex((e) => e.id === id);
      if (idx >= 0) return mockRatePoliciesData[idx];
      return null;
    }),

    findOneOrFail: jest.fn((filter) => {
      const idx = mockRatePoliciesData.findIndex(
        (e) =>
          e.organizationId == filter.where.organizationId &&
          e.id == filter.where.id,
      );
      if (idx >= 0) return mockRatePoliciesData[idx];
      throw new Error('RatePolicy not found for id ' + id);
    }),

    find: jest.fn((filter) => {
      const data = mockRatePoliciesData
        .filter((e) => e.organizationId == filter.where.organizationId)
        .sort((a, b) => a.debtAgeStart - b.debtAgeEnd);
      return data;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatePoliciesService,
        {
          provide: getRepositoryToken(RatePolicy),
          useValue: mockRatePoliciesRepository,
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: mockOrgazanitionsRepository,
        },
      ],
    }).compile();

    service = module.get<RatePoliciesService>(RatePoliciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a rate policy when there is none previously registered', async () => {
    const policy: CreateRatePolicyDto = {
      description: 'Initial rule',
      interestRate: 5,
      interestType: RatePolicyType.SIMPLE,
      interestMonthly: 2.5,
      feeRate: 10,
      debtAgeStart: 11,
      debtAgeEnd: 30,
      isActive: true,
    };
    const orgIdA = 'ORG-A';
    const resultA = await service.create(orgIdA, policy);

    expect(resultA).toHaveProperty('id');
    expect(resultA).toHaveProperty('organizationId');
    expect(mockRatePoliciesRepository.save).toHaveBeenCalledTimes(1);

    const policyB: CreateRatePolicyDto = {
      description: 'Initial rule',
      interestRate: 5,
      interestType: RatePolicyType.SIMPLE,
      interestMonthly: 2.5,
      feeRate: 10,
      debtAgeStart: 11,
      debtAgeEnd: 30,
      isActive: true,
    };
    const orgIdB = 'ORG-B';
    const resultB = await service.create(orgIdB, policyB);

    expect(resultB).toHaveProperty('id');
    expect(resultB).toHaveProperty('organizationId');
    expect(mockRatePoliciesRepository.save).toHaveBeenCalledTimes(2);
  });

  it('should throw error when adding policies which start or end date overlaps', async () => {
    //
    expect.assertions(4);
    const orgIdA = 'ORG-A';
    const policy: CreateRatePolicyDto = {
      description: 'Initial rule',
      interestRate: 5,
      interestType: RatePolicyType.SIMPLE,
      interestMonthly: 2.5,
      feeRate: 10,
      debtAgeStart: 1,
      debtAgeEnd: 30,
      isActive: true,
    };

    try {
      await service.create(orgIdA, policy);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }

    policy.debtAgeStart = 1;
    policy.debtAgeEnd = 15;
    try {
      await service.create(orgIdA, policy);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }

    policy.debtAgeStart = 15;
    policy.debtAgeEnd = 20;
    try {
      await service.create(orgIdA, policy);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }

    policy.debtAgeStart = 20;
    policy.debtAgeEnd = 40;
    try {
      await service.create(orgIdA, policy);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should insert a new policy overlaping if the oldest is inactive', async () => {
    //
    const orgIdC = 'ORG-C';
    const policy: CreateRatePolicyDto = {
      description: 'Initial rule',
      interestRate: 5,
      interestType: RatePolicyType.SIMPLE,
      interestMonthly: 2.5,
      feeRate: 10,
      debtAgeStart: 100,
      debtAgeEnd: 110,
      isActive: false,
    };

    const policyA = await service.create(orgIdC, policy);

    policy.isActive = true;
    const policyB = await service.create(orgIdC, policy);

    expect(policyA).toHaveProperty('id');
    expect(policyA).toHaveProperty('organizationId');

    expect(policyB).toHaveProperty('id');
    expect(policyB).toHaveProperty('organizationId');
  });

  it('should be able to update a rate policy', async () => {
    //
    const orgIdD = 'ORG-D';
    const policyDto: CreateRatePolicyDto = {
      description: 'Initial rule',
      interestRate: 5,
      interestType: RatePolicyType.SIMPLE,
      interestMonthly: 2.5,
      feeRate: 10,
      debtAgeStart: 100,
      debtAgeEnd: 110,
      isActive: false,
    };

    const policy = await service.create(orgIdD, policyDto);
    expect(policy).toHaveProperty('id');
    expect(policy).toHaveProperty('organizationId');

    const updated = await service.update(orgIdD, policy.id, {
      debtAgeStart: 1,
      debtAgeEnd: 30,
    });
    expect(updated).toHaveProperty('id');
    expect(updated).toHaveProperty('organizationId');
    expect(updated.debtAgeStart).toBe(1);
    expect(updated.debtAgeEnd).toBe(30);
  });

  it('should throw a execption when update overlaps any active current policies', async () => {
    //
    const orgIdE = 'ORG-E';
    const policyDto: CreateRatePolicyDto = {
      description: 'Initial rule',
      interestRate: 5,
      interestType: RatePolicyType.SIMPLE,
      interestMonthly: 2.5,
      feeRate: 10,
      debtAgeStart: 1,
      debtAgeEnd: 10,
      isActive: true,
    };
    await service.create(orgIdE, policyDto);

    policyDto.debtAgeStart = 11;
    policyDto.debtAgeEnd = 20;
    const policy = await service.create(orgIdE, policyDto);

    expect.assertions(1);
    try {
      await service.update(orgIdE, policy.id, {
        debtAgeStart: 5,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should validate rate policy with just start date', async () => {
    //
    const orgId = 'ORG-F';
    const policyDto: CreateRatePolicyDto = {
      description: 'Initial rule',
      interestRate: 5,
      interestType: RatePolicyType.SIMPLE,
      interestMonthly: 2.5,
      feeRate: 10,
      debtAgeStart: 1,
      debtAgeEnd: -1,
      isActive: true,
    };
    const policy = await service.create(orgId, policyDto);
    expect(policy).toHaveProperty('id');
  });

  it('should validate an updated rate policy removing end date if it does not overlap', async () => {
    //
    const orgId = 'ORG-G';
    const policyDto: CreateRatePolicyDto = {
      description: 'Initial rule',
      interestRate: 5,
      interestType: RatePolicyType.SIMPLE,
      interestMonthly: 2.5,
      feeRate: 10,
      debtAgeStart: 1,
      debtAgeEnd: 10,
      isActive: true,
    };
    expect.assertions(1);

    try {
      await service.create(orgId, policyDto);

      policyDto.debtAgeStart = 11;
      policyDto.debtAgeEnd = 20;
      const policy = await service.create(orgId, policyDto);

      const updated = await service.update(orgId, policy.id, {
        debtAgeStart: 11,
        debtAgeEnd: null,
      });
      expect(updated.debtAgeEnd).toBe(null);
    } catch (error) {
      console.log(error);
      assert(true);
    }
  });

  it('should throw an error if update remove end date and it overlaps', async () => {
    //
    const orgId = 'ORG-H';
    const policyDto: CreateRatePolicyDto = {
      description: 'Initial rule',
      interestRate: 5,
      interestType: RatePolicyType.SIMPLE,
      interestMonthly: 2.5,
      feeRate: 10,
      debtAgeStart: 21,
      debtAgeEnd: 30,
      isActive: true,
    };
    expect.assertions(1);

    try {
      await service.create(orgId, policyDto);

      policyDto.debtAgeStart = 11;
      policyDto.debtAgeEnd = 20;
      const policy = await service.create(orgId, policyDto);

      await service.update(orgId, policy.id, {
        debtAgeStart: 11,
        debtAgeEnd: -1,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should retrieve only rate policies for 1 organization', async () => {
    //
    const policyDto: CreateRatePolicyDto = {
      description: 'Initial rule',
      interestRate: 5,
      interestType: RatePolicyType.SIMPLE,
      interestMonthly: 2.5,
      feeRate: 10,
      debtAgeStart: 21,
      debtAgeEnd: 30,
      isActive: true,
    };
    await service.create('ORG-X', policyDto);
    await service.create('ORG-Y', policyDto);
    const orgX = await service.findAll('ORG-X');
    expect(orgX).toHaveLength(1);
  });
});
