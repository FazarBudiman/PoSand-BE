import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CustomerService } from '../service/customer.service';
import {
  CustomerCreateRequestDto,
  CustomerUpdateRequestDto,
} from '../dto/request/customer.request';
import { CustomerMapper } from '../mapper/customer.mapper';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(@Body() body: CustomerCreateRequestDto) {
    const createdCustomer = await this.customerService.createCustomer(body);
    return {
      data: CustomerMapper.toResponse(createdCustomer),
    };
  }

  @Get()
  async findAllCustomers() {
    const customers = await this.customerService.findAllCustomers();
    return {
      data: CustomerMapper.toResponseList(customers),
    };
  }

  @Get('/:id')
  async findCustomerById(@Param('id') id: string) {
    const costumer = await this.customerService.findCustomerById(id);
    return {
      data: CustomerMapper.toResponse(costumer),
    };
  }

  @Patch('/:id')
  async updateCustomerById(
    @Param('id') id: string,
    @Body() body: CustomerUpdateRequestDto,
  ) {
    const customerUpdated = await this.customerService.updateCustomerById(
      id,
      body,
    );
    return {
      data: CustomerMapper.toResponse(customerUpdated),
    };
  }

  @Delete('/:id')
  async deleteCustomerById(@Param('id') id: string) {
    await this.customerService.deleteCustomerById(id);
    return {
      message: 'Customer berhasil dihapus',
    };
  }
}
