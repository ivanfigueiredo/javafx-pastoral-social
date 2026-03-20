import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tps_temp_data', { schema: 'config' })
export class TempDataEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
    id: number | null;

    @Column({ name: 'data', type: 'jsonb', nullable: false })
    data: any | null;

    @Column({ name: 'created_at', type: 'timestamp', nullable: true })
    createdAt: Date | null;

    constructor(
        id: number | null,
        data: any | null,
        createdAt: Date | null
    ) {
        this.id = id;
        this.data = data;
        this.createdAt = createdAt;
    }
}