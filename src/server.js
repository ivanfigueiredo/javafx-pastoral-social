const path = require('path');
const {buildApp} = require(path.join(__dirname, '../dist/main'));

let app = null;

(async () => {
    if (!app) {
        app = await buildApp();
    }
    const PORT = 3000;
    app.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));
})()