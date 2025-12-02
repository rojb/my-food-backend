import { Customer } from "src/modules/customers/entities/customer.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "./address.entity";

@Entity('customer_addresses')
export class CustomerAddress {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'customer_id' })
    customerId: number;

    @Column({ name: 'address_id' })
    addressId: number;

    @ManyToOne(() => Customer, (customer) => customer.customerAddresses)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @ManyToOne(() => Address)
    @JoinColumn({ name: 'address_id' })
    address: Address;
}