import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { CreateCustomerDTO } from 'customers/dto/create.dto';
import { UpdateCustomerDTO } from 'customers/dto/update.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(customerDTO: CreateCustomerDTO) {
    const addressDTO = customerDTO.address;
    const customer = await this.prisma.customer.create({
      data: {
        cpf: customerDTO.cpf,
        name: customerDTO.name,
        phone: customerDTO.phone,
        address: addressDTO
          ? {
              create: {
                address: addressDTO.address,
                cep: addressDTO.cep,
                city: addressDTO.city,
                neighborhood: addressDTO.neighborhood,
                number: addressDTO.number,
                state: addressDTO.state,
              },
            }
          : undefined,
      },
      include: {
        address: true,
        areas: true,
      },
    });

    return customer;
  }

  async findAll(
    withAddress: boolean,
    withAreas: boolean,
    withSprayings: boolean,
  ) {
    const customers = await this.prisma.customer.findMany({
      include: {
        address: withAddress,
        areas: withAreas
          ? {
              include: {
                path: true,
                sprayings: withSprayings,
              },
            }
          : false,
      },
    });
    return customers;
  }

  async findById(
    customerId: string,
    withAddress = false,
    withAreas = false,
    withSprayings = false,
  ) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: customerId,
      },
      include: {
        address: withAddress,
        areas: withAreas
          ? {
              include: {
                path: true,
                sprayings: withSprayings,
              },
            }
          : false,
      },
    });
    return customer;
  }

  async findByCPF(cpf: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        cpf,
      },
    });
    return customer;
  }

  async update(customerId: string, updateCustomerDTO: UpdateCustomerDTO) {
    const { address: addressDTO, ...customerDTO } = updateCustomerDTO;
    const customer = await this.prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        ...customerDTO,
        address: addressDTO
          ? {
              update: {
                ...addressDTO,
              },
            }
          : undefined,
      },
    });
    return customer;
  }

  async delete(customerId: string) {
    const customer = this.prisma.customer.delete({
      where: {
        id: customerId,
      },
      include: {
        address: true,
        areas: {
          include: {
            path: true,
            sprayings: true,
          },
        },
      },
    });
    return customer;
  }
}
