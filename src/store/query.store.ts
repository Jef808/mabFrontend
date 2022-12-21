import uniqueId from "lodash.uniqueid";
import { readonly, ref, watch, type Ref, shallowReactive } from "vue";
import { useWebSocket } from "@vueuse/core";
import { defineStore } from "pinia";
import { useFormStore } from "@/store/form.store";
import type {
    DataQuery,
    QueryResult,
    WithId,
} from "@/data/types";

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

    const wsUrl = ref("ws://localhost:8080");

    // A websocket for two-way communication with the backend
    const { status: wsStatus, data: wsData, send: wsSend, open: wsOpen, close: wsClose, ws } = useWebSocket(
        wsUrl.value,
        {
            autoReconnect: true,// {
            // retries: -1,
            // delay: 2000,
            // onFailed() {
            //     console.error("Failed to connect WebSocket after 3 retries");
            // },
            // },
            heartbeat: {
                message: "ping",
                interval: 1500,
                pongTimeout: 1500,
            },
            onConnected: (ws) => {
                console.log(
                    "Successfully connected to WebSocket at ", wsUrl.value
                );
            },
            onMessage: (ws, event) => {
                console.log("Received", event);
                resultHistory.push(JSON.parse(event.data));
            },
            onDisconnected: (ws: WebSocket, event: CloseEvent) => {
                console.warn("Web Socket Disconncted", event);
            },
            onError: (ws, event) => {
                console.error(event);
            }
        }
    );

    function wsReset() {
        wsUrl.value = "ws://localhost:8080";
        wsOpen();
    }

    /**
     * Watch the results list for changes
     */
    watch(
        () => resultHistory,
        (value: WithId<QueryResult>[], oldValue) => {
            value
                .slice(oldValue.length)
                .forEach((res) => console.log("New Result: ", res));
        }
    );

    /**
     * Send the curent query to the backend through the WebSocket
     */
    async function submitQuery() {
        const query = getQuery();
        const nbQueries = queryHistory.length;

        const previousEntry = queryHistory.find((q) => {
            const { id, ...rest } = q;
            return rest === query;
        });

        // Do nothing if the query has already been processed
        if (previousEntry !== undefined) {
            currentResult.value = previousEntry.id;
            return;
        }

        if (wsStatus.value !== "OPEN") {
            console.warn("submitQuery called with non-open websocket, query will be buffered", ws);
        }

        try {
            const queryWithId = { id: uniqueId("query-"), ...query };
            if (wsSend(JSON.stringify(queryWithId))) {
                queryHistory.push(queryWithId);
                console.log("Sent query", queryWithId.id);
            }
        } catch (err) {
            console.error("Error while sending query", query);
            queryHistory.length = nbQueries;
        }
    }

    const setWebSocketUrl = (url: string) => {
        wsUrl.value = url;
    }

    return {
        wsReset,
        wsStatus,
        wsUrl: readonly(wsUrl),
        submitQuery,
        queryHistory,
        resultHistory,
        setWebSocketUrl,
    };
});
