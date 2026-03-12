import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { SaleService } from '../service/sale.service';
import { SalePaymentService } from '../service/sale-payment.service';
import { SaleReceiptService } from '../service/sale-receipt.service';
import { CreateSaleRequestDto } from '../dto/request/sale.request.dto';
import { SaleMapper } from '../mapper/sale.mapper';
import { CreateSalePaymentRequestDto } from '../dto/request/sale-payment.request.dto';
import {
  ApiCreateSale,
  ApiCreateSalePayment,
  ApiFindAllSales,
  ApiGetSaleReceipt,
  ApiSale,
} from '../doc/sale.doc';

@ApiSale()
@Controller('sales')
export class SaleController {
  constructor(
    private readonly saleService: SaleService,
    private readonly salePaymentService: SalePaymentService,
    private readonly saleReceiptService: SaleReceiptService,
  ) {}

  @ApiCreateSale()
  @Post()
  async createSale(
    @Body() request: CreateSaleRequestDto,
    @CurrentUser('sub') createdBy: string,
  ) {
    const sale = await this.saleService.createSale(request, createdBy);
    return {
      data: SaleMapper.toResponse(sale),
    };
  }

  @ApiFindAllSales()
  @Get()
  async findAll() {
    const sales = await this.saleService.findAllSales();
    return {
      data: SaleMapper.toResponseList(sales),
    };
  }

  @ApiCreateSalePayment()
  @Post('/:id/payments')
  async createPayment(
    @Param('id') id: string,
    @CurrentUser('sub') createdBy: string,
    @Body() body: CreateSalePaymentRequestDto,
  ) {
    const salePayment = await this.salePaymentService.createPayment(
      id,
      body,
      createdBy,
    );
    return {
      data: SaleMapper.toResponse(salePayment),
    };
  }

  @ApiGetSaleReceipt()
  @Get('/:id')
  async getSaleReceipt(
    @Param('id') id: string,
    @CurrentUser('sub') updatedBy: string,
  ) {
    const receipt = await this.saleReceiptService.findSaleReceiptById(
      id,
      updatedBy,
    );

    return {
      data: receipt,
    };
  }
}
