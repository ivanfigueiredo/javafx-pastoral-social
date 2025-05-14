import { DataSource } from "typeorm";

export interface Connection {
    init(): Promise<void>;
    getDataSourcer(): DataSource;
}