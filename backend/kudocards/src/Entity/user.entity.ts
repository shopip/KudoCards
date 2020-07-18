import { Entity, Column, PrimaryGeneratedColumn,BeforeInsert } from 'typeorm';
import * as crypto from 'crypto';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({default: ''})
  avatar: string;
  
  @Column({ type: "longtext",nullable: true })
  token: string;

  @Column("json")
  data: string;

  @Column({ unique: true }) 
  email: string;

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }
  @Column()
  password: string;
}