import { Module } from '@nestjs/common';
import { RatePoliciesService } from './rate-policies.service';
import { RatePoliciesController } from './rate-policies.controller';
import { RatePolicy } from './entities/rate-policy.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RatePolicy, Organization])],
  controllers: [RatePoliciesController],
  providers: [RatePoliciesService],
})
export class RatePoliciesModule {}
