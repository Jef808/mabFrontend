<script setup lang="ts">
 import * as d3 from 'd3';
 import { withDefaults, ref, computed, type Proptype } from "vue";

 export interface Margin {
     top: number;
     right: number;
     bottom: number;
     left: number
 }

 export interface SeriesProps {
     title: string;
     values: Record<string, number>[];
 }

 export interface Props {
     data: SeriesProps | SeriesProps[]
     width?: number;
     height?: number;
     margin?: Margin
 }

 const props = withDefaults(defineProps<Props>(), {
     width: 500,
     height: 270,
     margin: {
         top: 20,
         right: 30,
         bottom: 30,
         left: 40
     } as PropType<Margin>
 });

const dataTitles = computed(() => {
     return props.data.map(({title}) => title);
});

const padding = ref(60);
const xPadding = computed(() => props.margin.left + props.margin.right);

const xRange = computed(() => {
     return [0, props.width - xPadding.value];
});
const yRange = computed(() => {
     return [props.height - props.margin.bottom, props.margin.top];
});

const X = computed(() => {
     return d3.scaleLinear()
       .domain([0, d3.max(props.data, (d, i) => i)])
       .rangeRound(xRange.value);
 });

 const Y = computed(() => {
     return d3.scaleLinear()
             .domain(d3.extent(props.data, d => d.y)).nice()
             .range(yRange.value);
 });

 const path = computed(() => {
     return d3.line()
              .x(d => X.value(d.x))
              .y(d => Y.value(d.y));
 });
 const line = computed(() => {
     return path.value(props.data);
 });
 const viewBox = computed(() => {
     return `0 0 ${props.width} ${props.height}`;
 });

function onDebug() {
     console.log(d3.axisLeft().scale(X.value).toString());
 }

 // function updateAxis() {
 //     xAxisContainer.value = d3.select<SVGGElement, any>("g[id=xAxisContainer]");
 //     xAxisContainer.value.selectChildren("g").remove();
 //     xAxisContainer.value.call(d3.axisBottom(xScale.value));
 //
 //     yAxisContainer.value = d3.select<SVGGElement, any>("g[id=yAxisContainer]");
 //     yAxisContainer.value.selectChildren("g").remove();
 //     yAxisContainer.value.call(d3.axisLeft(yScale.value));
 // }

const chartViewType = ref("Raw Data");

</script>

<template>
    <div>
        <v-btn @click="onDebug">
            Debug
        </v-btn>
    </div>
    <div>
        <v-select
            :items="['Raw Data', 'Rolling Average']"
            v-model="chartViewType"
        >
        </v-select>
    </div>
    <svg
        class="line-chart"
        :width="props.width"
        :height="props.height"
        :viewBox="viewBox"
    >
        <g transform="translate(0, 10)">
            <path
                class="line-chart__line"
                :d="line"
            >
            </path>
        </g>
    </svg>
</template>

<style>
 .line-chart {
     margin: 25px;
 }
 .line-chart__line {
     fill: none;
     stroke: #76BF8A;
     stroke-width: 3px;
 }
</style>
