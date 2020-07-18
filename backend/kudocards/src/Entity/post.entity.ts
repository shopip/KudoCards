
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  title: string;

  @Column('text')
  subTitle: string;

  @Column({ length: 150 })
  imageUrl: string;

  @Column('text')
  content: string;

 
}