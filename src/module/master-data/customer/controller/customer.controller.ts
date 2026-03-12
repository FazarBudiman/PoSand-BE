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
import {
  ApiCreateCustomer,
  ApiCustomer,
  ApiDeleteCustomer,
  ApiFindAllCustomers,
  ApiFindCustomerById,
  ApiUpdateCustomer,
} from '../doc/customer.doc';

@ApiCustomer()
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiCreateCustomer()
  @Post()
  async create(@Body() body: CustomerCreateRequestDto) {
    const customer = await this.customerService.createCustomer(body);
    return {
      message: 'Customer Berhasil dibuat',
      data: customer,
    };
  }

  @ApiFindAllCustomers()
  @Get()
  async findAll() {
    const customers = await this.customerService.findAllCustomers();
    return {
      data: customers,
    };
  }

  @ApiFindCustomerById()
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const customer = await this.customerService.findCustomerById(id);
    return {
      data: customer,
    };
  }

  @ApiUpdateCustomer()
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: CustomerUpdateRequestDto,
  ) {
    const customer = await this.customerService.updateCustomerById(id, body);
    return {
      data: customer,
    };
  }

  @ApiDeleteCustomer()
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.customerService.deleteCustomerById(id);
    return {
      message: 'Customer dihapus',
    };
  }
}
