import { Auth } from "./adapters/http/authentication/Auth";
import { Authorize } from "./adapters/http/authorization/Authorize";
import { ExpressAdapter } from "./adapters/http/ExpressAdapter"
import { MainController } from "./adapters/MainController";

(async () => {
    const httpClient = new ExpressAdapter();
    new MainController(httpClient, new Auth(), new Authorize());
    httpClient.listen(5000, () => console.log(`Rodando na porta: ${5000}`));
})()