import { CustomerResponseDto } from '../dto/response/customer.response';
import { CustomerRow } from '../repository/customer.row';

export class CustomerMapper {
  static toResponse(customer: CustomerRow): CustomerResponseDto {
    return {
      id: customer.id,
      fullname: customer.fullname,
      phone: customer.phone ?? undefined,
      address: customer.address ?? undefined,
      tags: customer.tags ?? [],
    };
  }

  static toResponseList(customers: CustomerRow[]): CustomerResponseDto[] {
    return customers.map((customer) => this.toResponse(customer));
  }
}
