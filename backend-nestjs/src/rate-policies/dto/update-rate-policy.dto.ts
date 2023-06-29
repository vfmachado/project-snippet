import { PartialType } from '@nestjs/swagger';
import { CreateRatePolicyDto } from './create-rate-policy.dto';

export class UpdateRatePolicyDto extends PartialType(CreateRatePolicyDto) {}
