import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { UserEntity } from "./UserEntity";

@Entity('tps_security')
export class SecurityEntity {
  @PrimaryGeneratedColumn()
  id: number | null;

  @ManyToOne(() => UserEntity, (u) => u.security)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'token_hash', type: 'varchar' })
  tokenHash: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'NOW()' })
  createdAt?: Date;

  @Column({ default: false, type: 'bool' })
  revoked: boolean;

  constructor(
    id: number | null,
    tokenHash: string,
    expiresAt: Date,
    revoked: boolean,
    user: UserEntity,
    createdAt?: Date
  ) {
    this.id = id;
    this.tokenHash = tokenHash;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
    this.revoked = revoked;
    this.user = user;
  }
}