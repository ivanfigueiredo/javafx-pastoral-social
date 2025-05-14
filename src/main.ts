import { Auth } from "./adapters/http/authentication/Auth";
import { Authorize } from "./adapters/http/authorization/Authorize";
import { ExpressAdapter } from "./adapters/http/ExpressAdapter"
import { MainController } from "./adapters/MainController";
import { PostgresDatabase } from "./adapters/persistence/database/PostgresDatabase";
import { config } from 'dotenv';
config();

(async () => {
    const postgresDatabase = new PostgresDatabase();
    await postgresDatabase.init();
    const httpClient = new ExpressAdapter();
    new MainController(httpClient, new Auth(), new Authorize());
    const PORT = parseInt(process.env.PORT as string);
    httpClient.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));
})()