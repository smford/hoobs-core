const NPM = require("../npm");

module.exports = class PluginsController {
    constructor() {
        global.app.get("/plugins", (request, response) => this.installed(request, response));
        global.app.get("/plugins/:name", (request, response) => this.package(request, response));
        global.app.post("/plugins/:query/:limit", (request, response) => this.search(request, response));
        global.app.put("/plugins/:name", (request, response) => this.install(request, response));
        global.app.post("/plugins/:name", (request, response) => this.update(request, response));
        global.app.delete("/plugins/:name", (request, response) => this.uninstall(request, response));
    }

    installed(request, response) {
        if (!global.admin) {
            return response.status(403).json({
                error: "unauthorized"
            });
        }

        NPM.installed().then((results) => {
            return response.send(results);
        });
    }

    package(request, response) {
        if (!global.admin) {
            return response.status(403).json({
                error: "unauthorized"
            });
        }

        const installed = NPM.list();
        const version = installed[request.params.name] ? installed[request.params.name].version : null

        NPM.package(request.params.name, version).then((results) => {
            return response.send(results);
        });
    }

    search(request, response) {
        NPM.search(request.params.query, request.params.limit).then((results) => {
            response.send(results);
        });
    }

    install(request, response) {
        if (!global.admin) {
            return response.status(403).json({
                error: "unauthorized"
            });
        }

        if (NPM.list()[request.params.name]) {
            return response.send({
                error: "package already installed"
            });
        }

        NPM.install(request.params.name).then(() => {
            global.log.info(`[${new Date().toLocaleString()}] Installed "${request.params.name}" package.`);

            return response.send({
                success: true
            });
        });
    }

    uninstall(request, response) {
        if (!global.admin) {
            return response.status(403).json({
                error: "unauthorized"
            });
        }

        if (!NPM.list()[request.params.name]) {
            return response.send({
                error: "package not installed"
            });
        }

        NPM.uninstall(request.params.name).then(() => {
            global.log.info(`[${new Date().toLocaleString()}] "${request.params.name}" package removed.`);

            return response.send({
                success: true
            });
        });
    }

    update(request, response) {
        if (!global.admin) {
            return response.status(403).json({
                error: "unauthorized"
            });
        }

        if (!NPM.list()[request.params.name]) {
            return response.send({
                error: "package not installed"
            });
        }

        NPM.update(request.params.name).then(() => {
            global.log.info(`[${new Date().toLocaleString()}] "${request.params.name}" package updated.`);

            return response.send({
                success: true
            });
        });
    }
}