import { ref, reactive, watch } from "vue";
import { useWebSocket } from "@vueuse/core";
import { defineStore } from "pinia";
import { useFormStore } from "@/store/form.store";
import type { Model, Policy, Options, DataQuery } from "@/data/types";

function buildDataQuery({
    model: { name: modelName, parameters: modelParameters },
    policy: { name: policyName, parameters: policyParameters },
    options: { parameters: optionsParameters },
}: {
    model: Model;
    policy: Policy;
    options: Options;
}): DataQuery {
    return {
        model: {
            name: modelName,
            parameters: modelParameters.map(({ name, value }) => ({ name, value })),
        },
        policy: {
            name: policyName,
            parameters: policyParameters.map(({ name, value }) => ({ name, value })),
        },
        options: optionsParameters.map(({ name, value }) => ({ name, value })),
    };
}

const getQuery = (): DataQuery => {
    const { model, policy, options } = useFormStore().currentData;
    return buildDataQuery({
        model: model,
        policy: policy,
        options,
    });
};

export const useQueryStore = defineStore("queryStore", () => {
    const queryHistory = reactive([] as DataQuery[]);
    const resultHistory = reactive([] as DataQuery[]);

    const { status, data, send, open, close, ws } = useWebSocket(
        "ws://localhost:8080",
        {
            autoReconnect: {
                retries: 3,
                delay: 1000,
                onFailed() {
                    console.error("Failed to connect WebSocket after 3 retries");
                },
            },
            heartbeat: {
                message: "ping",
                interval: 1000,
                pongTimeout: 1000,
            },
            onConnected: (ws) => {
                console.log(
                    "Successfully connected to WebSocket at ws://localhost:8080"
                );
            },
            onMessage: (ws, event) => {
                console.log("Received", event);
                resultHistory.push(JSON.parse(event.data));
            },
        }
    );

    async function submitQuery() {
        const query = getQuery();
        const nbQueries = queryHistory.length;

        if (status.value !== "OPEN") {
            console.warn("submitQuery called with non-open websocket", ws.value);
        }

        try {
            if (send(JSON.stringify(query))) {
                queryHistory.push(query);
                console.log("Sent query");
            }
        } catch (err) {
            console.error(err);
            queryHistory.length = nbQueries;
        }
    }

    return {
        submitQuery,
        queryHistory,
        resultHistory,
    };
});
