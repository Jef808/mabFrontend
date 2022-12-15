import { computed, reactive, toRef, toRaw, ref, watch, type Ref } from "vue"
import { defineStore } from "pinia"
import modelsData from "../data/models.json" assert { type: "json" }
import policiesData from "../data/policies.json" assert { type: "json" }
import optionsData from "../data/options.json" assert { type: "json" }
import type { Parameter } from "@/data/types"

export const useFormStore = defineStore("formStore", () => {

    const models = reactive(modelsData);
    const policies = reactive(policiesData);
    const options = reactive(optionsData);

    function showRaw() {
        console.log("models: ", JSON.stringify(toRaw(models), null, 2));
        console.log("policies: ", JSON.stringify(toRaw(policies), null, 2));
        console.log("options: ", JSON.stringify(toRaw(options), null, 2));
    }

    // SELECTION DATA
    const modelSelectionItems = models.map(({ name, label }) => ({ name, label }));
    const policySelectionItems = policies.map(({ name, label }) => ({ name, label }));
    const currentModel = ref(modelSelectionItems[0].name);
    const currentPolicy = ref(policySelectionItems[0].name);

    // PARAMETER VIEW DATA
    const modelParametersProps = computed(() =>
        models.find(e => e.name === currentModel.value)?.parameters.map((param) => {
            const { value, name, label, ...sliderProps } = param;
            return {
                value,
                name,
                label,
                sliderProps
            }
        }));
    const policyParametersProps = computed(() =>
        policies.find(e => e.name === currentPolicy.value)?.parameters.map((param) => {
            const { value, name, label, ...sliderProps } = param;
            return {
                value,
                name,
                label,
                sliderProps
            }
        }));
    const optionsParametersProps = computed(() =>
        options[0].parameters.map((param) => {
            const { value, name, label, ...sliderProps } = param;
            return {
                value,
                name,
                label,
                sliderProps
            }
        }));

    // const modelsParametersValueRef = computed(() => {
    //     const params = models.find(e => e.name === currentModel.value)?.parameters;
    //     return params?.map((_, idx) => toRef(params[idx], "value"));
    // });
    // const policiesParametersValueRef = computed(() => {
    //     const params = policies.find(e => e.name === currentModel.value)?.parameters;
    //     return params?.map((_, idx) => toRef(params[idx], "value"));
    // });
    // // The options parameters array is a simple reactive array
    // const optionsParametersValueRef = computed(() => {
    //     const params = options.find(e => e.name === currentModel.value)?.parameters;
    //     return params?.map((_, idx) => toRef(params[idx], "value"));
    // });

    const currentModelObject = computed(() => {
        return models.find(e => e.name === currentModel.value);
    })
    const currentPolicyObject = computed(() => {
        return policies.find(e => e.name === currentPolicy.value);
    })

    function updateCurrentModel(values: number[]) {
        values.forEach((val, idx) => {
            (currentModelObject.value?.parameters as Parameter[])[idx].value = val;
        });
        // currentModelObject.value?.parameters
        //     .forEach((p, idx) => p.value = values[idx]);
    }
    function updateCurrentPolicy(values: number[]) {
        values.forEach((val, idx) => {
            (currentPolicyObject.value?.parameters as Parameter[])[idx].value = val;
        });
    }
    function updateCurrentOptions(values: number[]) {
        values.forEach((val, idx) => { options[0].parameters[idx].value = val; });
    }

    // function onUpdateAll(modelValues: number[], policyValues: number[], optionsValues: number[]) {
    //     updateCurrentModel(modelValues);
    //     updateCurrentPolicy(modelValues);
    //     updateCurrentOptions(modelValues);
    // }

    function onUpdate(category: "model" | "policy" | "options", values: number[]) {
        switch (category) {
            case "model": updateCurrentModel(values); break;
            case "policy": updateCurrentPolicy(values); break;
            case "options": updateCurrentOptions(values); break;
        }
    }

    return {
        modelSelectionItems,
        policySelectionItems,
        currentModel,
        currentPolicy,
        modelParametersProps,
        policyParametersProps,
        optionsParametersProps,
        onUpdate,
        showRaw,
    };
});
