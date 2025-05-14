import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { UserEntity } from "./UserEntity";

@Entity('TPS_SECURITY')
export class SecurityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (u) => u.security)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'token_hash', type: 'varchar' })
  tokenHash: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date | null;

  @Column({ default: false, type: 'bool' })
  revoked: boolean;

  constructor(
    id: number,
    tokenHash: string,
    expiresAt: Date,
    createdAt: Date | null,
    revoked: boolean,
    user: UserEntity
  ) {
    this.id = id;
    this.tokenHash = tokenHash;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
    this.revoked = revoked;
    this.user = user;
  }
}