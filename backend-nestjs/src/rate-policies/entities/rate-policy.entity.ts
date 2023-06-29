import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { RatePolicyType } from '../enums/rate-policy.enum';

@Entity('organization_rate_policies', {
  schema: 'public',
  name: 'organization_rate_policies',
})
export class RatePolicy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'organization_id',
  })
  organizationId: string;

  @Column({
    name: 'description',
  })
  description: string | null;

  @Column({
    name: 'interest_rate',
  })
  interestRate: number;

  @Column({
    name: 'interest_type',
  })
  interestType: RatePolicyType;

  @Column({
    name: 'interest_monthly',
  })
  interestMonthly: number;

  @Column({
    name: 'fee_rate',
  })
  feeRate: number;

  @Column({
    name: 'debt_age_start',
  })
  debtAgeStart: number;

  @Column({
    name: 'debt_age_end',
  })
  debtAgeEnd: number | null;

  @Column({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Timestamp;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Timestamp;

  @Column({
    name: 'is_active',
    type: 'boolean',
  })
  isActive: boolean;
}
