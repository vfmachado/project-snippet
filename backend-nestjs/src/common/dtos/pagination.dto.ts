import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderDto } from './order.dto';

export class PaginationDto extends OrderDto {
  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  limit?: number;
}
