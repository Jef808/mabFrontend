import Fastify from "fastify";
import * as config from "@/data/apiConfig.json" assert { type: "json" };
import { Request } from "zeromq";
import type { QueryForm } from "@/data/types";

const reqSock = new Request();

const server = Fastify();

server.post("/api", async (request, reply) => {
    try {
        await reqSock.send(JSON.stringify(request));
        const [response] = await reqSock.receive();
        reply.send(JSON.parse(response.join()));
    } catch (err) {
        reply.send({ error: new Error("Error while querying worker") });
    }
});

const main = async () => {
    try {
        await server.listen({ port: 3000 });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

try {
    reqSock.connect(config.apiAddress);
    console.log("Request socket connected to ", config.apiAddress);
} catch (err) {
    console.error(err);
    process.exit(1);
}

export async function submitQuery(queryObject: QueryForm) {
    await reqSock.send(JSON.stringify(queryObject));
    const [response] = await reqSock.receive();
    return JSON.parse(response.join());
}
