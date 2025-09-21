import { TemplateUseCase } from "../../application/port/in/TemplateUseCase";
import { HttpClient } from "../http/HttpClient";

export class TemplateController {
    constructor(
        readonly httpClient: HttpClient,
        readonly templateUseCase: TemplateUseCase
    ) {
        
    }
}