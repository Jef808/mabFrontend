import modelsData from "../data/models.json" assert { type: "json" }
import policiesData from "../data/policies.json" assert { type: "json" }
import optionsData from "../data/options.json" assert { type: "json" }
import type { Model, Policy, Options } from "../data/types";
import { isReactive, reactive, ref, toRefs } from "vue"

export const useDataStore = () => {
    const models = reactive(modelsData);
    const policies = reactive(policiesData);
    const options = reactive(optionsData);

    console.log(
        "<h4>DataStore Reactivity:</h4>",
        "models: ", isReactive(models),
        "policies: ", isReactive(policies),
        "options: ", isReactive(options),
    )

    return {
        models,
        policies,
        options,
    };
};
