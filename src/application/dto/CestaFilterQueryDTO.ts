import { StatusCestaEnum } from "./enuns/StatusCestaEnum";

export class CestaFilterQueryDTO {
    constructor(
        readonly page: number,
        readonly pageSize: number,
        readonly statusCesta: StatusCestaEnum
    ) {}
}