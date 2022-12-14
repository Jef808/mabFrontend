import { computed, reactive, toRef, toRaw, ref, watch, type Ref } from "vue"
import { defineStore } from "pinia"
import modelsData from "../data/models.json" assert { type: "json" }
import policiesData from "../data/policies.json" assert { type: "json" }
import optionsData from "../data/options.json" assert { type: "json" }

export type Category = "models" | "policies" | "options"

export const useFormStore = defineStore("formStore", () => {

    const models = reactive(modelsData);
    const policies = reactive(policiesData);
    const options = reactive(optionsData);

    function showRaw() {
        console.log("models: ", JSON.stringify(toRaw(models)));
        console.log("policies: ", JSON.stringify(toRaw(policies)));
        console.log("options: ", JSON.stringify(toRaw(options)));
    }

    // The data needed to populate the selectors (only computed once)
    // const modelNames = computed(() => models.map(({ name }) => name));
    // const policyNames = computed(() => policies.map(({ name }) => name));
    const names = {
        models: models.map(m => {
            console.log(m.name);
            return m.name;
        }),
        policies: policies.map(p => {
            console.log(p.name);
            return p.name;
        }),
    };

    // References to strings representing the currently selected model/policy.
    const currentModel = ref("");
    const currentPolicy = ref("");

    // Intermediate computation to obtain references to the raw objects
    const currentModelIdx = computed(() => {
        return models.findIndex((m) => m.name === currentModel.value);
    });
    const currentPolicyIdx = computed(() => {
        return policies.findIndex((p) => p.name === currentPolicy.value)
    });
    // The Options group really is not selectable...
    const currentOptionsIdx = { value: 0 };

    // Selecting a new model or policy simply amounts to changing the value of their name
    // in the above reference
    const selectModel = (name: string) => currentModel.value = name;
    const selectPolicy = (name: string) => currentPolicy.value = name;

    // Arrays of refs to the actual values of the selected items' parameters
    let modelsParametersValue = reactive([] as Ref<number>[]);
    let policiesParametersValue = reactive([] as Ref<number>[]);
    // Since the underlying object never changes, we probably don't need a full ref
    // (i.e. only a reactive array of copied values would suffice for preserving reactivity
    // throughout one session, although the array of refs would allow for eventual persistent
    // changes at the source...
    let optionsParametersValue = reactive([] as Ref<number>[]);

    // Gather the necessary data for rendering forms for the object parameters
    const modelParametersProps = computed(() =>
        models[currentModelIdx.value].parameters.map((param) => {
            const { value, name, label, ...sliderProps } = param;
            return {
                value,
                name,
                label,
                sliderProps
            }
        }));
    const policyParametersProps = computed(() =>
        policies[currentPolicyIdx.value].parameters.map((param) => {
            const { value, name, label, ...sliderProps } = param;
            return {
                value,
                name,
                label,
                sliderProps
            }
        }));
    const optionsParametersProps = computed(() =>
        options[currentOptionsIdx.value].parameters.map((param) => {
            const { value, name, label, ...sliderProps } = param;
            return {
                value,
                name,
                label,
                sliderProps
            }
        }));

    const modelsParametersValueRef = computed(() => {
        const params = models[currentModelIdx.value].parameters;
        return params.map((_, idx) => toRef(params[idx], "value"));
    });
    const policiesParametersValueRef = computed(() => {
        const params = policies[currentPolicyIdx.value].parameters;
        return params.map((_, idx) => toRef(params[idx], "value"));
    });
    // The options parameters array is a simple reactive array
    const optionsParametersValueRef = computed(() => {
        const params = options[currentOptionsIdx.value].parameters;
        return params.map((_, idx) => toRef(params[idx], "value"));
    });



    // Generate an array of refs to each parameter value upon changing a selection.
    watch(currentModel, async (newSelection, oldSelection) => {
        // TODO: Remove if unnecessary
        if (newSelection === oldSelection) {
            console.warn("watch triggered when selecting an already selected item");
            return;
        }
        console.log("oldSelection: ", oldSelection);
        console.log("newSelection: ", newSelection);
        console.log("current policy: ", currentModel.value);
        if (!!currentModel.value) {
            try {
                modelsParametersValue = modelsParametersValueRef.value;
                console.log("Selected", currentModel.value);
            } catch (error) {
                console.error("Error: Select Model Watcher: ", error);
            }
        }
    });

    watch(currentPolicy, async (newSelection, oldSelection) => {
        // TODO: Remove if unnecessary
        if (newSelection === oldSelection) {
            console.warn("watch triggered when selecting an already selected item");
            return;
        }
        console.log("oldSelection: ", oldSelection);
        console.log("newSelection: ", newSelection);
        console.log("current policy: ", currentPolicy.value);

        if (!!currentPolicy.value) {
            try {
                policiesParametersValue = policiesParametersValueRef.value;
                console.log("Selected", currentPolicy.value);
            }
            catch (error) {
                console.error("Error: Select Policy Watcher: ", error);
            }
        }
    })

    // Generate the list of names and labels,
    // Also generate the parameter data for the options group here since
    // it will stay the same.
    const initializeFormStore = () => {

        // Initial selections
        currentModel.value = names.models[0];
        currentPolicy.value = names.policies[0];

        // Set up Options parameter references
        try {
            optionsParametersValue = optionsParametersValueRef.value;
            console.log(optionsParametersValue);
        }
        catch (error) {
            console.error("Error when initializing the options parameters", error);
        }
    }

    function updateCurrentModel(values: number[]) {
        modelsParametersValue.forEach((p, idx) => p.value = values[idx]);
    }
    function updateCurrentPolicy(values: number[]) {
        policiesParametersValue.forEach((p, idx) => p.value = values[idx]);
    }
    function updateCurrentOptions(values: number[]) {
        optionsParametersValue.forEach((p, idx) => p.value = values[idx]);
    }

    function onUpdate(category: Category, values: number[]) {
        switch (category) {
            case "models": updateCurrentModel(values); break;
            case "policies": updateCurrentPolicy(values); break;
            case "options": updateCurrentOptions(values); break;
        }
    }

    function onSelect(category: Category, name: string) {
        console.log("onSelect: ", category, name);
        switch (category) {
            case "models": selectModel(name); break;
            case "policies": selectPolicy(name); break;
        }
    }

    const modelLabelMap = new Map<string, string>(models.map(m => ([m.name, m.label])));
    const policyLabelMap = new Map<string, string>(policies.map(m => ([m.name, m.label])));
    const labelOf = (category: Category, name: string) => {
        return category === "models" ? modelLabelMap.get(name) : policyLabelMap.get(name);
    }

    return {
        names,
        labelOf,
        currentModel,
        currentPolicy,
        modelParametersProps,
        policyParametersProps,
        optionsParametersProps,
        onUpdate,
        initializeFormStore,
        showRaw,
        onSelect
    };
});
