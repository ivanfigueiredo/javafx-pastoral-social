import { HttpClient } from "./http/HttpClient";
import { Auth } from "./http/authentication/Auth";
import { Authorize } from "./http/authorization/Authorize";

export class MainController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: Auth,
        readonly authorize: Authorize,
    ) {
        httpClient.on("post", "/create-user", auth.authentication.bind(auth), authorize.can.bind(authorize), async function (params: any, data: any) {
            const output = {OK:true};
            return output;
        });
    }
}