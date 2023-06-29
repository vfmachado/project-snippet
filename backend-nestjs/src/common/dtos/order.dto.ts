import { ApiPropertyOptional } from '@nestjs/swagger';

export class OrderDto {
  @ApiPropertyOptional()
  orderField?: string;

  @ApiPropertyOptional()
  orderDirection?: string;
}
