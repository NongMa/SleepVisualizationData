<template>
  <div class="home">
    <div class="flex" :style="{background: 'url('+bgImg+')'}">
      <div class="chart" id="homeChartBar"></div>
      <div class="chart" id="homeChartPie"></div>
    </div>
    <h3 class="percent">{{selectDataLength}}/{{allData.length}} nights</h3>
    <div class="more-icon">
      <template v-for="(item,index) in itemsData">
        <div
          :key="item.id"
          @click="changeSelect(index)"
          :class="['icon-detail', item.active ? 'icon-detail-active':'']"
        >
          <h3>
            <i :class="item.iconClass"></i>
          </h3>
          <p>{{item.title}}</p>
        </div>
      </template>
    </div>
    <div class="flex flex-center tip">
      All data is displayed by default. Please select the above conditions for filtering statistics
    </div>
  </div>
</template>

<script>
const echarts = require("echarts");
import allData from "@/mock/index.js";
import bg from "@/assets/bg.jpg";
export default {
  name: "insights",
  data() {
    return {
      bgImg: bg,
      allData: JSON.parse(JSON.stringify(allData)),
      newData: JSON.parse(JSON.stringify(allData)),
      selectData: [],
      itemsData: [
        {
          active: false,
          iconClass: "el-icon-aliyundong-",
          title: "Worked out",
          text: "Workout"
        },
        {
          active: false,
          iconClass: "el-icon-alichengshijianshe",
          title: "Stressful day",
          text: "StressfulDay"
        },
        {
          active: false,
          iconClass: "el-icon-alichuang",
          title: "Not my bed",
          text: "NotMyBed"
        },
        {
          active: false,
          iconClass: "el-icon-alishiwu",
          title: "Ate late",
          text: "EatLate"
        },
        {
          active: false,
          iconClass: "el-icon-aliicon-test",
          title: "Caffeine",
          text: "Caffeine"
        }
      ],
      avgLengthQuality: {
        avgLength: "",
        avgQuality: ""
      },
      selectLengthQuality: {
        length: "",
        quality: ""
      },
      color: ["rgb(24, 147, 220)", "rgb(254, 79, 79)", "rgb(100, 199, 88)"],
      pieColor: ["rgb(24, 147, 220)", "rgba(254, 79, 79, 0)"]
    };
  },
  computed: {
    selectDataLength() {
      return this.newData.length;
    },
    // 格式化数据
    selectLength() {
      let arr = [];
      let avgData = this.formatSleepLength(this.avgLengthQuality.avgLength);
      let nowData = this.formatSleepLength(this.selectLengthQuality.length);
      let avgPercent = this.avgLengthQuality.avgQuality.split("%")[0];
      let nowPercent = this.selectLengthQuality.quality.split("%")[0];
      let minLength = avgData - nowData;
      let minPercent = avgPercent - nowPercent;
      let changeLength = "";
      let changeQuality = "";
      if (minLength >= 0) {
        changeLength = "-" + this.backSleeplength(minLength);
        this.color = ["rgb(24, 147, 220)", "rgb(254, 79, 79)"];
      } else {
        changeLength = this.backSleeplength(minLength);
        this.color = ["rgb(24, 147, 220)", "rgb(100, 199, 88)"];
      }
      if (minPercent >= 0) {
        changeQuality = "-" + minPercent + "%";
        this.pieColor = ["rgb(254, 79, 79)", "rgba(254, 79, 79, 0)"];
      } else {
        changeQuality = Math.abs(minPercent) + "%";
        this.pieColor = ["rgb(100, 199, 88)", "rgba(100, 199, 88, 0)"];
      }

      arr.push((avgData / 60).toFixed(2));
      arr.push((nowData / 60).toFixed(2));
      arr.push(changeLength);
      arr.push(changeQuality);
      return arr;
    }
  },
  methods: {
    // 格式化时间成数值
    formatSleepLength(value) {
      return parseInt(value.split(":")[0] * 60) + parseInt(value.split(":")[1]);
    },
    // 格式化时间为特定的字符串
    backSleeplength(value) {
      return (
        parseInt(Math.abs(value) / 60) + "h " + (Math.abs(value) % 60) + "min"
      );
    },
    // 选中对应条件改变数据
    changeSelect(index) {
      this.newData = this.allData;
      var xuhao = this.selectData.indexOf(this.itemsData[index].text);
      if (this.itemsData[index].active) {
        if (xuhao > -1) {
          this.selectData.splice(xuhao, 1);
        }
      } else {
        this.selectData.push(this.itemsData[index].text);
      }
      this.selectData.map(value1 => {
        this.newData = this.newData.filter(value => {
          return value[value1] != "";
        });
      });
      if (this.newData.length > 0) {
        let length = 0;
        let percent = 0;
        this.newData.map(value => {
          length += this.formatSleepLength(value.SleepingLength);
          percent += +value.SleepingQuality.split("%")[0];
        });
        this.selectLengthQuality.length =
          parseInt(length / this.newData.length / 60) +
          ":" +
          parseInt((length / this.newData.length) % 60);
        this.selectLengthQuality.quality =
          parseInt(percent / this.newData.length) + "%";
        this.itemsData[index].active = !this.itemsData[index].active;
      } else {  
        this.selectData.splice(xuhao, 1);
        this.newData = this.allData;
        this.selectData.map(value1 => {     
        this.newData = this.newData.filter(value => {
            return value[value1] != "";
          });
        });   
        this.$message({
          message: 'No statistics are available for the currently selected portfolio',
          type: 'warning',
          center: true
        });
      }
      this.initChart();
    },
    // 图表
    initChart() {
      const that = this;
      let myChartBar = echarts.init(document.getElementById("homeChartBar"));
      let myChartPie = echarts.init(document.getElementById("homeChartPie"));
      // 基于准备好的dom，初始化echarts实例
      myChartBar.setOption({
        title: {
          text: that.selectLengthQuality.length.replace(":", "h ") + "min",
          textStyle: { color: "#fff", fontWeight: "normal", fontSize: 18 },
          textAlign: "center",
          padding: [0, 10],
          left: "50%",
          subtext: that.selectLength[2],
          subtextStyle: {
            color: that.color[1]
          }
        },
        textStyle: {
          color: "#fff"
        },
        color: that.color,
        tooltip: {},
        dataset: {
          source: [
            ["product", "Average duration", "Current Statistical Average Time"],
            ["1", that.selectLength[0], that.selectLength[1]]
          ]
        },
        grid: {
          left: "6%",
          right: "6%",
          bottom: 40,
          containLabel: true
        },
        graphic: {
          type: "text",
          style: {
            text: [
              "         avg.",
              that.avgLengthQuality.avgLength.replace(":", "h ") + "min"
            ].join("\n\n"),
            fill: that.color[0],
            x: 170,
            y: 180
          }
        },
        xAxis: [
          {
            show: false,
            type: "category",
            name: "DATE",
            data: [""]
          }
        ],

        yAxis: [
          {
            show: false,
            type: "value",
            name: "PERCENT",
            axisLabel: {
              formatter: "{value}h"
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: 30
          },
          {
            type: "bar",
            barWidth: 30
          }
        ]
      });
      myChartPie.setOption({
        title: {
          text: that.selectLengthQuality.quality,
          textStyle: { color: "#fff", fontWeight: "normal", fontSize: 18 },
          textAlign: "center",
          padding: [0, 10],
          left: "50%",
          subtext: that.selectLength[3],
          subtextStyle: {
            color: that.pieColor[0]
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: ({c}%)"
        },
        color: that.pieColor,
        grid: {
          left: "6%",
          right: "6%",
          bottom: 20,
          containLabel: true
        },
        series: [
          {
            name: 'sleep quality',
            type: "pie",
            radius: ["40%", "60%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: false,
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: that.selectLengthQuality.quality.replace("%", ""),
                name: "Statistical Average Sleep Quality"
              },
              {
                value: Math.abs(that.selectLength[3].replace("%", "")),
                name: ""
              }
            ]
          }
        ],
        graphic: {
          type: "text",
          style: {
            text: [
              "         avg.",
              "        " + that.avgLengthQuality.avgQuality
            ].join("\n\n"),
            fill: that.color[0],
            x: 140,
            y: 180
          }
        }
      });
    }
  },

  mounted() {
    let avgLength = 0;
    let avgPercent = 0;
    this.allData.map(value => {
      avgLength += this.formatSleepLength(value.SleepingLength);
      avgPercent += +value.SleepingQuality.split("%")[0];
    });
    this.avgLengthQuality.avgLength = this.selectLengthQuality.length =
      parseInt(avgLength / this.allData.length / 60) +
      ":" +
      parseInt((avgLength / this.allData.length) % 60);
    this.avgLengthQuality.avgQuality = this.selectLengthQuality.quality =
      parseInt(avgPercent / this.allData.length) + "%";
    this.initChart();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#homeChartBar,
#homeChartPie {
  width: 50%;
  height: 300px;
  padding-bottom: 20px;
  padding-top: 20px;
}
.more-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 1px solid #f2f2f2;
  .icon-detail {
    cursor: pointer;
    &.icon-detail-active {
      background-color: rgb(220, 219, 224);
      color: rgb(24, 147, 220);
    }
    &:last-child {
      border-right: none;
    }
    border-right: 1px solid #f2f2f2;
    width: 33.33%;
    padding: 10px;
    h3 {
      font-size: 18px;
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
    }
  }
}
.condition {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 1px solid #f2f2f2;
  border-bottom: none;
  .condition-list {
    &:last-child {
      border-right: none;
    }
    border-right: 1px solid #f2f2f2;
    width: 50%;
    padding: 10px;
    h3 {
      font-size: 18px;
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
    }
  }
}
.percent {
  padding: 20px 0;
}
.tip {
  height: 110px;
  color: #888;
}
</style>
