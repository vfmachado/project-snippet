import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Organization } from 'src/organizations/entities/organization.entity';
import { CreateRatePolicyDto } from './dto/create-rate-policy.dto';
import { UpdateRatePolicyDto } from './dto/update-rate-policy.dto';
import { RatePolicy } from './entities/rate-policy.entity';
import { validateDebtAge } from 'src/common/tools/validate-interval-date';

// TODO CREATE A METHOD TO RETRIEVE THE CORRECT RATE POLICY GIVEN THE DAYS OF DEBT
@Injectable()
export class RatePoliciesService {
  constructor(
    @InjectRepository(RatePolicy)
    private readonly ratePoliciesRepository: Repository<RatePolicy>,

    @InjectRepository(Organization)
    private readonly organizationsRepository: Repository<Organization>,
  ) {}

  async create(
    organizationId: string,
    createRatePolicyDto: CreateRatePolicyDto,
  ) {
    if (
      createRatePolicyDto.debtAgeStart > createRatePolicyDto.debtAgeEnd &&
      createRatePolicyDto.debtAgeEnd !== -1
    ) {
      throw new BadRequestException('Start Debt date should be smaller ');
    }

    // validate organization id
    const organization = await this.organizationsRepository.findOne(
      organizationId,
    );
    if (!organization) {
      throw new NotFoundException('Organization ID not found');
    }

    const policies = await this.findAll(organizationId);
    const filtered = policies.filter((p) => p.isActive);
    const canBeInserted = await validateDebtAge(
      filtered,
      createRatePolicyDto.debtAgeStart,
      createRatePolicyDto.debtAgeEnd == -1
        ? null
        : createRatePolicyDto.debtAgeEnd,
    );
    if (!canBeInserted) {
      throw new ConflictException('Debt start/end date overlaps other data');
    }

    // check range debtAgeStart / debtAgeEnd
    const policy = this.ratePoliciesRepository.create({
      organizationId,
      ...createRatePolicyDto,
    });
    await this.ratePoliciesRepository.save(policy);
    return policy;
  }

  async findAll(organizationId: string) {
    try {
      const ratePolicies = await this.ratePoliciesRepository.find({
        where: { organizationId },
        order: { debtAgeStart: 'ASC' },
      });
      return ratePolicies;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(organizationId: string, id: number) {
    try {
      const ratePolicy = await this.ratePoliciesRepository.findOneOrFail({
        where: { organizationId, id },
      });
      return ratePolicy;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    organizationId: string,
    id: number,
    updateRatePolicyDto: UpdateRatePolicyDto,
  ) {
    try {
      const policy = await this.ratePoliciesRepository.findOneOrFail({
        where: { organizationId, id },
      });

      let canBeUpdated = true;

      if (
        updateRatePolicyDto.debtAgeStart ||
        updateRatePolicyDto.debtAgeEnd ||
        updateRatePolicyDto.isActive
      ) {
        const policies = await this.findAll(organizationId);
        const filtered = policies.filter(
          (elem) => elem.id != policy.id && elem.isActive,
        );
        canBeUpdated = await validateDebtAge(
          filtered,
          updateRatePolicyDto.debtAgeStart || policy.debtAgeStart,
          updateRatePolicyDto.debtAgeEnd == -1
            ? null
            : updateRatePolicyDto.debtAgeEnd || policy.debtAgeEnd,
        );
      }

      if (!canBeUpdated) {
        throw new ConflictException('Debt start/end date overlaps other data');
      }

      await this.ratePoliciesRepository.update(policy.id, {
        updatedAt: new Date(),
        ...updateRatePolicyDto,
      });
      const updated = await this.ratePoliciesRepository.findOne(policy.id);
      return updated;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
