import * as config from "@/data/apiConfig.json" assert { type: "json" };
import { Reply } from "zeromq";

const sock = new Reply();

const main = async () => {
    try {
        sock.bind(config.apiAddress);
        console.log("Reply socket bound to ", config.apiAddress);

        for await (const [msg] of sock) {
            const jsonMsg = msg.toJSON;
            console.log("Received message ", jsonMsg);
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

main();
