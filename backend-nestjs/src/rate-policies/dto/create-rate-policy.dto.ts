import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, Min } from 'class-validator';
import { RatePolicyType } from '../enums/rate-policy.enum';

export class CreateRatePolicyDto {
  @ApiPropertyOptional()
  description: string | null;

  @ApiProperty()
  interestRate: number;

  @ApiProperty()
  @IsString()
  interestType: RatePolicyType;

  @ApiProperty()
  @IsNumber()
  interestMonthly: number;

  @ApiProperty()
  @IsNumber()
  feeRate: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  debtAgeStart: number;

  @ApiProperty()
  @IsNumber()
  @Min(-1)
  debtAgeEnd: number;

  @ApiPropertyOptional()
  @IsBoolean()
  isActive: boolean;
}
