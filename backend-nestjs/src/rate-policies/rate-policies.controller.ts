import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RatePoliciesService } from './rate-policies.service';
import { CreateRatePolicyDto } from './dto/create-rate-policy.dto';
import { UpdateRatePolicyDto } from './dto/update-rate-policy.dto';
import { UserPermissions } from 'src/enums/route-permissions.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/config/guards/user-permissions.guard';
import { Permissions } from 'src/config/guards/user-permissions.decorator';
import { UserOrganizationGuard } from 'src/config/guards/user-organization.guard';

@ApiTags('Organizations Rate Policies')
@ApiBearerAuth('jwt-token')
@Controller({
  path: 'organizations/:organization_id/rate-policies',
  version: '1',
})
export class RatePoliciesController {
  constructor(private readonly ratePoliciesService: RatePoliciesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(UserPermissions.ORGANIZATION_RATE_POLICIES_CREATE)
  create(
    @Param('organization_id') organizationId: string,
    @Body() createRatePolicyDto: CreateRatePolicyDto,
  ) {
    return this.ratePoliciesService.create(organizationId, createRatePolicyDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, UserOrganizationGuard)
  @Permissions(UserPermissions.ORGANIZATION_RATE_POLICIES_GET)
  findAll(@Param('organization_id') organizationId: string) {
    console.log('Organization id', organizationId);
    return this.ratePoliciesService.findAll(organizationId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, UserOrganizationGuard)
  @Permissions(UserPermissions.ORGANIZATION_RATE_POLICIES_GET)
  findOne(
    @Param('organization_id') organizationId: string,
    @Param('id') id: string,
  ) {
    return this.ratePoliciesService.findOne(organizationId, +id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(UserPermissions.ORGANIZATION_RATE_POLICIES_UPDATE)
  update(
    @Param('organization_id') organizationId: string,
    @Param('id') id: string,
    @Body() updateRatePolicyDto: UpdateRatePolicyDto,
  ) {
    return this.ratePoliciesService.update(
      organizationId,
      +id,
      updateRatePolicyDto,
    );
  }
}
