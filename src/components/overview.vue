<template>
  <div class="home">
    <div class="box">
      <div class="wrapper flex">
        <div class="left">
          <div class="left-wrapper">
            <div class="list condition">
              <h4 class="list-title">Days of occurrence of each condition</h4>
              <div class="chart" id="homeChart"></div>
            </div>
            <div class="list maxMin">
              <h4 class="list-title">Maximum & Minimum</h4>
              <div class="progress-wrap">
                <h5>Maximum Sleep Quality</h5>
                <p>{{maxDate}}</p>
                <el-progress
                  :text-inside="true"
                  :stroke-width="14"
                  :percentage="+maxQuality"
                  color="rgba(142, 113, 199, 0.7)"
                ></el-progress>
              </div>
              <div class="progress-wrap">
                <h5>Minimum Sleep Quality</h5>
                <p>{{minDate}}</p>
                <el-progress
                  :text-inside="true"
                  :stroke-width="14"
                  :percentage="+minQuality"
                  status="exception"
                ></el-progress>
              </div>
            </div>
          </div>
        </div>
        <div class="center">
          <div>
            <h3 class="title">Overview of Sophie's Sleeping Data</h3>
            <div class="chart" id="mainChart"></div>
          </div>
        </div>
        <div class="right">
          <div class="right-wrapper">
            <div class="list averageQuality">
              <h4 class="list-title">Average Sleep Quality</h4>
              <div class="chart" id="nightSta"></div>
            </div>
            <div class="list sleepTime">
              <h4 class="list-title">Maximum & Minimum</h4>
              <div class="progress-wrap">
                <h5>Maximum Sleep Time</h5>
                <p>{{maxLengthDate}}</p>
                <div>{{parseInt(maxLength/60)+'h '+(maxLength%60)+'min'}}</div>
              </div>
              <div class="progress-wrap">
                <h5>Minimum Sleep Time</h5>
                <p>{{minLengthDate}}</p>
                <div>{{parseInt(minLength/60)+'h '+(maxLength%60)+'min'}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const echarts = require("echarts");
import allData from "@/mock/index.js";
import bg from "@/assets/bg1.jpg";
export default {
  name: "overview",
  data() {
    return {
      bgImg: bg,
      allData: JSON.parse(JSON.stringify(allData)),
      normalData: [],
      goodData: [],
      badData: [],
      maxQuality: 0,
      maxDate: "",
      minQuality: 100,
      minDate: "",
      maxLength: 0,
      maxLengthDate: "",
      minLength: 1440,
      minLengthDate: "",
      avgSleepQuality: 0,
      reasonNum: []
    };
  },
  mounted() {
    let totalQuality = 0;
    let goodData = this.allData.filter(value => {
      return value.Condition == "good";
    });
    let normalData = this.allData.filter(value => {
      return value.Condition == "normal";
    });
    let badData = this.allData.filter(value => {
      return value.Condition == "bad";
    });
    goodData.map(value => {
      this.goodData.push([
        Number(value.SleepingLength.split(":")[0]) +
          Number((value.SleepingLength.split(":")[1] / 60).toFixed(3)),
        value.SleepingQuality.split("%")[0]
      ]);
    });
    normalData.map(value => {
      this.normalData.push([
        Number(value.SleepingLength.split(":")[0]) +
          Number((value.SleepingLength.split(":")[1] / 60).toFixed(3)),
        value.SleepingQuality.split("%")[0]
      ]);
    });
    badData.map(value => {
      this.badData.push([
        Number(value.SleepingLength.split(":")[0]) +
          Number((value.SleepingLength.split(":")[1] / 60).toFixed(3)),
        value.SleepingQuality.split("%")[0]
      ]);
    });

    this.allData.map((value, index) => {
      if (this.maxQuality < value.SleepingQuality.split("%")[0]) {
        this.maxQuality = value.SleepingQuality.split("%")[0];
        this.maxDate = this.allData[index].Date;
      }
      if (this.minQuality > value.SleepingQuality.split("%")[0]) {
        this.minQuality = value.SleepingQuality.split("%")[0];
        this.minDate = this.allData[index].Date;
      }
      if (
        this.maxLength <
        parseInt(value.SleepingLength.split(":")[0] * 60) +
          parseInt(value.SleepingLength.split(":")[1])
      ) {
        this.maxLength =
          parseInt(value.SleepingLength.split(":")[0] * 60) +
          parseInt(value.SleepingLength.split(":")[1]);
        this.maxLengthDate = this.allData[index].Date;
      }
      if (
        this.minLength >
        parseInt(value.SleepingLength.split(":")[0] * 60) +
          parseInt(value.SleepingLength.split(":")[1])
      ) {
        this.minLength =
          parseInt(value.SleepingLength.split(":")[0] * 60) +
          parseInt(value.SleepingLength.split(":")[1]);
        this.minLengthDate = this.allData[index].Date;
      }
      totalQuality += +value.SleepingQuality.split("%")[0];
    });
    this.avgSleepQuality = Math.ceil(totalQuality / this.allData.length);
    ["Workout", "StressfulDay", "NotMyBed", "EatLate", "Caffeine"].map(
      value => {
        let a = this.allData.filter(value1 => {
          return value1[value] != "";
        }).length;
        this.reasonNum.push(a);
      }
    );
    // 基于准备好的dom，初始化echarts实例
    this.drawReasonImg();
    this.drawNightStaImg();
    this.drawMainImg();
  },
  methods: {
    drawReasonImg() {
      let homeChart = echarts.init(document.getElementById("homeChart"));
      homeChart.setOption({
        title: {
          textStyle: { color: "#f2f2f2", fontWeight: "normal", fontSize: 14 }
        },
        textStyle: { color: "#f2f2f2", fontWeight: "normal", fontSize: 12 },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        color: "rgb(78, 67, 141)",
        grid: {
          left: "2%",
          right: "8%",
          bottom: "8%",
          top: "1%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "category",
          data: ["Workout", "StressfulDay", "NotMyBed", "EatLate", "Caffeine"],
          splitLine: {
            show: false
          }
        },
        series: [
          {
            type: "bar",
            barWidth: 10,
            barGap: 1,
            data: this.reasonNum
          }
        ]
      });
    },
    drawNightStaImg() {
      let nightSta = echarts.init(document.getElementById("nightSta"));
      nightSta.setOption({
        title: {
          textStyle: { color: "#f2f2f2", fontWeight: "normal", fontSize: 10 }
        },
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
          {
            name: "Average Sleep Quality",
            title: {
              color: "#f2f2f2",
              fontSize: 8
            },
            pointer: {
              width: 2
            },
            axisLine: {
              // 仪表盘轴线(轮廓线)相关配置。
              show: true, // 是否显示仪表盘轴线(轮廓线),默认 true。
              lineStyle: {
                // 仪表盘轴线样式。
                color: [[0.2, "#c23531"], [0.8, "#63869e"], [1, "#91c7ae"]], //仪表盘的轴线可以被分成不同颜色的多段。每段的  结束位置(范围是[0,1]) 和  颜色  可以通过一个数组来表示。默认取值：[[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']]
                opacity: 1, //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                width: 10 //轴线宽度,默认 30。
              }
            },
            splitLine: {
              // 分隔线样式。
              show: true, // 是否显示分隔线,默认 true。
              length: 10, // 分隔线线长。支持相对半径的百分比,默认 30。
              lineStyle: {
                // 分隔线样式。
                opacity: 1, //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                width: 2,
                //线度,默认 2。
                type: "solid", //线的类型,默认 solid。 此外还有 dashed,dotted
                shadowColor: "#fff" //阴影颜色。支持的格式同color。
              }
            },
            axisLabel: {
              // 刻度标签。
              show: true, // 是否显示标签,默认 true。
              distance: 5, // 标签与刻度线的距离,默认 5。
              color: "#fff", // 文字的颜色,默认 #fff。
              fontSize: 8, // 文字的字体大小,默认 5。
              formatter: "{value}" // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
            },
            type: "gauge",
            radius: "90%",
            detail: { formatter: "{value}%", fontSize: 10 },
            data: [{ value: this.avgSleepQuality }]
          }
        ]
      });
    },
    drawMainImg() {
      let mainChart = echarts.init(document.getElementById("mainChart"));
      var option = {
        title: {
          text: "Sleep duration and quality under different Conditions",
          left: 20,
          top: 20,
          textStyle: {
            color: "#f2f2f2",
            fontSize: 12
          }
        },
        textStyle: {
          color: "#f2f2f2"
        },
        grid: {
          left: "5%",
          right: "5%",
          top: "30%",
          containLabel: true
        },
        tooltip: {
          // trigger: 'axis',
          showDelay: 0,
          formatter: function(params) {
            if (params.value.length > 1) {
              return (
                params.seriesName +
                " :<br/>" +
                parseInt(params.value[0]) +
                "h " +
                parseInt((params.value[0] - parseInt(params.value[0])) * 60) +
                "min " +
                params.value[1] +
                "% "
              );
            } else {
              return (
                params.seriesName +
                " :<br/>" +
                params.name +
                " : " +
                params.value +
                "% "
              );
            }
          },
          axisPointer: {
            show: true,
            type: "cross",
            lineStyle: {
              type: "dashed",
              width: 1
            }
          }
        },

        legend: {
          data: ["bad", "good", "normal"],
          left: "right",
          textStyle: {
            color: "#f2f2f2"
          }
        },
        xAxis: [
          {
            type: "value",
            scale: true,
            axisLabel: {
              formatter: "{value} h"
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            axisLabel: {
              formatter: "{value} %"
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "bad",
            type: "scatter",
            data: this.badData,
            markArea: {
              silent: true,
              itemStyle: {
                normal: {
                  color: "transparent",
                  borderWidth: 1,
                  borderType: "dashed"
                }
              }
            },
            markPoint: {
              data: [{ type: "max", name: "max" }, { type: "min", name: "min" }]
            },
            markLine: {
              lineStyle: {
                normal: {
                  type: "solid"
                }
              },
              name: "bad",
              data: [{ type: "average", name: "average value" }]
            }
          },
          {
            name: "good",
            type: "scatter",
            data: this.goodData,
            markArea: {
              silent: true,
              itemStyle: {
                normal: {
                  color: "transparent",
                  borderWidth: 1,
                  borderType: "dashed"
                }
              }
            },
            markPoint: {
              data: [{ type: "max", name: "max" }, { type: "min", name: "min" }]
            },
            markLine: {
              lineStyle: {
                normal: {
                  type: "solid"
                }
              },
              name: "good",
              data: [{ type: "average", name: "average value" }]
            }
          },
          {
            name: "normal",
            type: "scatter",
            data: this.normalData,
            markArea: {
              silent: true,
              itemStyle: {
                normal: {
                  color: "transparent",
                  borderWidth: 1,
                  borderType: "dashed"
                }
              }
            },
            markPoint: {
              data: [{ type: "max", name: "max" }, { type: "min", name: "min" }]
            },
            markLine: {
              lineStyle: {
                normal: {
                  type: "solid"
                }
              },
              name: "normal",
              data: [{ type: "average", name: "average value" }]
            }
          }
        ]
      };

      mainChart.setOption(option);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.home {
  width: 100%;
  background-color: rgb(22, 37, 60);
  background: -webkit-linear-gradient(rgb(8, 22, 27), rgb(31, 44, 76));
  background: -o-linear-gradient(rgb(8, 22, 27), rgb(31, 44, 76));
  background: -moz-linear-gradient(rgb(8, 22, 27), rgb(31, 44, 76));
  background: linear-gradient(rgb(8, 22, 27), rgb(31, 44, 76));
}
#homeChart {
  width: 100%;
  height: 200px;
  padding-bottom: 20px;
  padding-top: 20px;
}
#nightSta {
  width: 100%;
  height: 100%;
}
#mainChart {
  width: 100%;
  height: 75vh;
  padding: 40px 20px 0;
}
.title {
  font-size: 18px;
  color: #fff;
  text-align: center;
  padding: 20px;
}
.wrapper {
  padding: 0 20px;
  color: #fff;
  .left {
    width: 230px;
    padding-top: 20px; 
  }
  .center {
    flex: 1;
  }
  .right {
    padding-top: 20px; 
    width: 230px;
  }
  .list {
    border: 1px solid #333;
    border-radius: 6px;
    padding: 10px;
  }
  .condition {
    height: 240px;
  }
  .list-title {
    font-size: 14px;
    font-weight: normal;
    padding-top: 5px;
    padding-bottom: 10px;
  }
  .maxMin {
    margin-top: 10px;
    height: 250px;
  }
  .averageQuality {
    height: 240px;
  }
  .sleepTime {
    margin-top: 10px;
    height: 250px;
  }
  .progress-wrap {
    margin: 10px 0;
    h5 {
      font-size: 10px;
      font-weight: normal;
      text-align: left;
      margin-bottom: 10px;
    }
    p {
      padding: 5px 0;
      text-align: left;
      font-size: 10px;
      color: darkturquoise;
    }
  }
}
</style>
