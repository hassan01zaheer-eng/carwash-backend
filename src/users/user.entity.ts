import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../auth/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  // Shop owner details (optional for customers)
  @Column({ nullable: true })
  ownerName?: string;

  @Column({ nullable: true })
  shopName?: string;

  @Column({ nullable: true })
  shopAddress?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  shopLocation?: string; // Could be a stringified lat/lng or geojson
}
