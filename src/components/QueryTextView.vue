<script setup lang="ts">
import { computed } from "vue";
import type { DataQuery } from "@/data/types";
export interface Props {
  query: DataQuery;
}
const props = defineProps<Props>();

 // const toNamedValue = (obj: object) => {
 //   const NamedValue = Object.entries(obj);
 //   return { name: NamedModel[0], value: NamedModel[1] };
 // };

// Converts any object { objName: objValue } into
// the 'named' object { name: objName, value: objValue }.
const extractParameters = (queryParams: Record<string, number>) => {
  return Object.entries(queryParams).map((p) => {
    const [name, value] = p;
    return { name, value };
  });
};

const modelParameters = computed(() => {
  return extractParameters(props.query.modelParameters);
});
const policyParameters = computed(() => {
  return extractParameters(props.query.policyParameters);
});
const optionsParameters = computed(() => {
  return extractParameters(props.query.options);
});
</script>

<template>
  <v-card variant="outlined">
    <v-list>
      <v-list-subheader title="Model"> </v-list-subheader>
      <v-item-group>
        <v-card>
          <v-list-item
            v-for="param in modelParameters"
            :title="param.name"
            :subtitle="param.value"
            :value="param.value"
          >
          </v-list-item>
        </v-card>
      </v-item-group>
      <v-list-subheader title="Policy"></v-list-subheader>
      <v-item-group>
        <v-card>
          <v-list-item
            v-for="param in policyParameters"
            :key="param.name"
            :title="param.name"
            :subtitle="param.value"
            :value="param.value"
          >
          </v-list-item>
        </v-card>
      </v-item-group>
      <v-list-subheader title="Options"></v-list-subheader>
      <v-item-group>
        <v-card>
          <v-list-item
            v-for="param in optionsParameters"
            :key="param.name"
            :title="param.name"
            :subtitle="param.value"
            :value="param.value"
          >
          </v-list-item>
        </v-card>
      </v-item-group>
    </v-list>
  </v-card>
</template>
