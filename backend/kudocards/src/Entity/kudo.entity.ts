
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Kudo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  companyId: number;

  @Column({ length: 500 })
  title: string;

  @Column("json")
  kudoType: string;

  @Column('int',{nullable:true})
  kudoId: number;

  @Column('text')
  content: string;

  @Column('text')
  fromEmail: string;

  @Column('text')
  fromName: string;

  @Column('int',{default: 0,nullable : true})
  team?: number;

  @Column({default: '',nullable : true})
  teamName: string;

  @Column('int',{default: 0,nullable : true})
  sprint?: number;

  @Column({default: '',nullable : true})
  sprintName: string;

  @Column({default: '',nullable : true})
  fromImage : string;

  @Column({default: '',nullable : true})
  toImage : string;

  @Column('text')
  toEmail: string;

  @Column('text')
  toName: string;


  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public createdAt: Date;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updatedAt: Date;

  
 
}