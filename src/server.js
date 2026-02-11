const {buildApp} = require("../dist/main");

(async () => {
    const app = await buildApp();
    const PORT = 3000;
    app.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));
})()