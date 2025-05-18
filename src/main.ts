import { Auth } from "./adapters/http/authentication/Auth";
import { Authorize } from "./adapters/http/authorization/Authorize";
import { ExpressAdapter } from "./adapters/http/ExpressAdapter"
import { MainController } from "./adapters/controller/MainController";
import { PostgresDatabase } from "./adapters/persistence/database/PostgresDatabase";
import { AlimentoService } from "./application/service/AlimentoService";
import { AlimentoController } from "./adapters/controller/AlimentoController";
import { AlimentoPostgresDatabase } from "./adapters/persistence/AlimentoPostgresDatabase";
import { AbilityPermission } from "./adapters/http/authorization/Permission";
import { RolePermissionsPostgresDatabase } from "./adapters/persistence/RolePermissionsPostgresDatabase";
import { FamiliaController } from "./adapters/controller/FamiliaController";
import { FamiliaPostgresDatabase } from "./adapters/persistence/FamiliaPostgresDatabase";
import { FamiliaService } from "./application/service/FamiliaService";
import { AuthService } from "./application/service/AuthService";
import { UserPostgresDatabase } from "./adapters/persistence/UserPostgresDatabase";
import { SecurityPostgresDatabase } from "./adapters/persistence/SecurityPostgresDatabase";
import { config } from 'dotenv';
import { AuthPostgresDatabase } from "./adapters/persistence/AuthPostgresDatabase";
config();

(async () => {
    const postgresDatabase = new PostgresDatabase();
    await postgresDatabase.init();
    const httpClient = new ExpressAdapter();
    const roleRepository = new RolePermissionsPostgresDatabase(postgresDatabase);
    const alimentoPostgres = new AlimentoPostgresDatabase(postgresDatabase);
    const familiaRepository = new FamiliaPostgresDatabase(postgresDatabase);
    const userRepository = new UserPostgresDatabase(postgresDatabase);
    const securityRepository = new SecurityPostgresDatabase(postgresDatabase);
    const authRepository = new AuthPostgresDatabase(postgresDatabase);
    const abilityPermission = new AbilityPermission(roleRepository);
    await abilityPermission.setupPermissions();
    const alimentoUseCase = new AlimentoService(alimentoPostgres);
    const familiaUseCase = new FamiliaService(familiaRepository);
    const authUseCase = new AuthService(userRepository, securityRepository, authRepository);
    const auth = new Auth(authRepository);
    const authorize = new Authorize(abilityPermission.getAppAbility());
    new MainController(httpClient, authUseCase);
    new AlimentoController(httpClient, auth, authorize, alimentoUseCase);
    new FamiliaController(httpClient, auth, authorize, familiaUseCase);
    const PORT = parseInt(process.env.PORT as string);
    httpClient.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));
})()