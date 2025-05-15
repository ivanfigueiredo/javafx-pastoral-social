import { Auth } from "./adapters/http/authentication/Auth";
import { Authorize } from "./adapters/http/authorization/Authorize";
import { ExpressAdapter } from "./adapters/http/ExpressAdapter"
import { MainController } from "./adapters/MainController";
import { PostgresDatabase } from "./adapters/persistence/database/PostgresDatabase";
import { config } from 'dotenv';
import { AlimentoService } from "./application/service/AlimentoService";
import { AlimentoController } from "./adapters/AlimentoController";
import { AlimentoPostgresDatabase } from "./adapters/persistence/AlimentoPostgresDatabase";
config();

(async () => {
    const postgresDatabase = new PostgresDatabase();
    await postgresDatabase.init();
    const httpClient = new ExpressAdapter();
    const alimentoPostgres = new AlimentoPostgresDatabase(postgresDatabase);
    const alimentoUseCase = new AlimentoService(alimentoPostgres);
    const auth = new Auth();
    const authorize = new Authorize();
    new MainController(httpClient, auth, authorize);
    new AlimentoController(httpClient, auth, authorize, alimentoUseCase);
    const PORT = parseInt(process.env.PORT as string);
    httpClient.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));
})()