import { defineStore, storeToRefs } from "pinia";
import { computed, readonly, ref, shallowReactive } from "vue";
import type { QueryResult } from "@/data/types"
import { useQueryStore } from "@/store/query.store";

const useChartStore = defineStore("chartStore", () => {

  const queryStore = useQueryStore();
  const { queryHistory, resultHistory, wsStatus } = storeToRefs(queryStore);



  /**
   * Return the 'rewards' part of the 'datasets' result.
   */
  const getRewards = computed(() => {

  });

})
