const {buildApp} = require("../dist/main");

(async () => {
    const app = await buildApp();
    const PORT = parseInt(process.env.PORT);
    app.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));
})()