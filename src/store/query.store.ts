import uniqueId from "lodash.uniqueid";
import { ref, reactive, watch, type Ref, shallowReactive } from "vue";
import { useWebSocket } from "@vueuse/core";
import { defineStore } from "pinia";
import { useFormStore } from "@/store/form.store";
import type {
    Model,
    Policy,
    Options,
    DataQuery,
    QueryResult,
    WithId,
} from "@/data/types";

// function buildDataQuery({
//     model: { name: modelName, parameters: modelParameters },
//     policy: { name: policyName, parameters: policyParameters },
//     options: { parameters: optionsParameters },
// }: {
//     model: Model;
//     policy: Policy;
//     options: Options;
// }): DataQuery {
//     return {
//         model: {
//             name: modelName,
//             parameters: modelParameters.map(({ name, value }) => ({ name, value })),
//         },
//         policy: {
//             name: policyName,
//             parameters: policyParameters.map(({ name, value }) => ({ name, value })),
//         },
//         options: optionsParameters.map(({ name, value }) => ({ name, value })),
//     };
// }

// const getQuery = (): DataQuery => {
//     const { model, policy, options } = useFormStore().currentData;
//     return buildDataQuery({
//         model: model,
//         policy: policy,
//         options,
//     });
// };

const getQuery = (): DataQuery => {
    const {
        model: { name: modelName, parameters: mParameters },
        policy: { name: policyName, parameters: pParameters },
        options: { parameters: oParameters },
    } = useFormStore().currentData;
    return {
        modelName,
        modelParameters: Object.fromEntries(
            mParameters.map((param) => [param.name, param.value])
        ),
        policyName,
        policyParameters: Object.fromEntries(
            pParameters.map((param) => [param.name, param.value])
        ),
        options: Object.fromEntries(
            oParameters.map((param) => [param.name, param.value])
        ),
    };
};

export const useQueryStore = defineStore("queryStore", () => {
    const queryHistory = shallowReactive([] as WithId<DataQuery>[]);
    const resultHistory = shallowReactive([] as WithId<QueryResult>[]);

    let currentResult: Ref<string | number>;

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

    watch(
        () => resultHistory,
        (value: WithId<QueryResult>[], oldValue) => {
            value
                .slice(oldValue.length)
                .forEach((res) => console.log("New Result: ", res));
        }
    );

    async function submitQuery() {
        const query = getQuery();
        const nbQueries = queryHistory.length;

        const previousEntry = queryHistory.find((q) => {
            const { id, ...rest } = q;
            return rest === query;
        });

        if (previousEntry !== undefined) {
            currentResult.value = previousEntry.id;
            return;
        }

        if (status.value !== "OPEN") {
            console.warn("submitQuery called with non-open websocket", ws.value);
        }

        try {
            const queryWithId = { id: uniqueId("query-"), ...query };
            if (send(JSON.stringify(queryWithId))) {
                queryHistory.push(queryWithId);
                console.log("Sent query", queryWithId.id);
            }
        } catch (err) {
            console.error("Error while sending query", query);
            queryHistory.length = nbQueries;
        }
    }

    return {
        submitQuery,
        queryHistory,
        resultHistory,
    };
});
