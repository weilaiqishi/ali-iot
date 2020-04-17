<template>
  <div style="position: relative;">
    <div :id="id" style="width: 310px;height: 250px;"></div>
    <p class="x" @click="$store.commit('shouldShowDelete', id)"></p>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      myChart: {},
      option: Object.freeze({
        title: {
          text: this.id,
          textStyle: {
            align: "center",
            color: "black",
            fontSize: 20,
          },
          top: "2%",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(0, 255, 233,0)",
                  },
                  {
                    offset: 0.5,
                    color: "rgba(255, 255, 255,1)",
                  },
                  {
                    offset: 1,
                    color: "rgba(0, 255, 233,0)",
                  },
                ],
                global: false,
              },
            },
          },
        },
        grid: {
          top: "30%",
          left: "8%",
          right: "8%",
          bottom: "15%",
          // containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              show: true,
            },
            splitArea: {
              // show: true,
              color: "#f00",
              lineStyle: {
                color: "#f00",
              },
            },
            axisLabel: {
              color: "black",
              interval: 0,
            },
            splitLine: {
              show: false,
            },
            boundaryGap: false,
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            // max: 140,
            splitNumber: 4,
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(255,255,255,0.1)",
              },
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
              margin: 20,
              textStyle: {
                color: "#d1e6eb",
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "注册总量",
            type: "line",
            // smooth: true, //是否平滑
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbol: "circle",
            symbolSize: 25,
            lineStyle: {
              normal: {
                color: "#409EFF",
                shadowColor: "rgba(0, 0, 0, .3)",
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#409EFF",
              },
            },
            itemStyle: {
              color: "#409EFF",
              borderColor: "#fff",
              borderWidth: 3,
              shadowColor: "rgba(0, 0, 0, .3)",
              shadowBlur: 0,
              shadowOffsetY: 2,
              shadowOffsetX: 2,
            },
            tooltip: {
              show: false,
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(64,158,255,0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(64,158,255,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(64,158,255, 0.9)",
                shadowBlur: 20,
              },
            },
            data: [],
          },
        ],
      }),
    };
  },
  props: {
    id: String,
  },
  watch: {
    "$store.state.record": {
      handler(newVal) {
        if (!newVal[this.id]) return;
        let twoArr = newVal[this.id].items.reduce(
          (acc, cur) => {
            acc.temperature.push(cur.temperature);
            acc.time.push(cur.time.slice(-9));
            return acc;
          },
          {
            temperature: [],
            time: [],
          }
        );
        this.option.xAxis[0].data = twoArr.time;
        this.option.series[0].data = twoArr.temperature;
        this.myChart.setOption(this.option);
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById(this.id));
    this.myChart.setOption(this.option);
  },
};
</script>

<style scoped>
.x {
  position: absolute;
  left: 10px;
  width: 15px;
  height: 15px;
  display: inline-block;
  cursor: pointer;
}
.x::before {
  content: "";
  width: inherit;
  border-top: 3px solid #000;
  position: absolute;
  left: 50%;
  top: -200px;
  transform: translate(-50%, -50%) rotate(45deg);
}
.x::after {
  content: "";
  width: inherit;
  border-top: 3px solid #000;
  position: absolute;
  left: 50%;
  top: -200px;
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>
