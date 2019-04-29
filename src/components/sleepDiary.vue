<template>
  <div class="home">
    <div class="box">
      <div class="chart" id="homeChart"></div>
      <h4 class="date">DATE：{{showNowOneData.Date}}</h4>
      <div class="condition">
        <div class="condition-list">
          <h3>Condition</h3>
          <p>{{showNowOneData.Condition}}</p>
        </div>
        <div class="condition-list">
          <h3>Dream</h3>
          <p>
            <i :class="showNowOneData.Dream == 'yes'?'el-icon-alixiaolian':'el-icon-alikulian'"></i>
          </p>
        </div>
      </div>

      <div class="more-icon">
        <div :class="['icon-detail', showNowOneData.Workout =='' ? '':'icon-detail-active']">
          <h3>
            <i class="el-icon-aliyundong-"></i>
          </h3>
          <p>Worked out</p>
        </div>
        <div :class="['icon-detail', showNowOneData.StressfulDay =='' ? '':'icon-detail-active']">
          <h3>
            <i class="el-icon-alichengshijianshe"></i>
          </h3>
          <p>Stressful day</p>
        </div>
        <div :class="['icon-detail', showNowOneData.NotMyBed =='' ? '':'icon-detail-active']">
          <h3>
            <i class="el-icon-alichuang"></i>
          </h3>
          <p>Not my bed</p>
        </div>
        <div :class="['icon-detail', showNowOneData.AteLate =='' ? '':'icon-detail-active']">
          <h3>
            <i class="el-icon-alishiwu"></i>
          </h3>
          <p>Ate late</p>
        </div>
        <div :class="['icon-detail', showNowOneData.Caffeine =='' ? '':'icon-detail-active']">
          <h3>
            <i class="el-icon-aliicon-test"></i>
          </h3>
          <p>Caffeine</p>
        </div>
      </div>
      <div class="more-data">
        <div class="data-detail">
          <h3>Sleeping length</h3>
          <p>{{showNowOneData.SleepingLength.replace(':','h ')+'min'}}</p>
        </div>
        <div class="data-detail">
          <h3>Start time</h3>
          <p>{{showNowOneData.Starttime}}</p>
        </div>
        <div class="data-detail">
          <h3>Awake</h3>
          <p>{{showNowOneData.Awake}}</p>
        </div>
        <div class="data-detail">
          <h3>Light sleep</h3>
          <p>{{showNowOneData.LightSleep}}</p>
        </div>
        <div class="data-detail">
          <h3>Deep sleep</h3>
          <p>{{showNowOneData.DeepSleep}}</p>
        </div>
        <div class="data-detail">
          <h3>Sleeping quality</h3>
          <p>{{showNowOneData.SleepingQuality}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const echarts = require("echarts");
import allData from "@/mock/index.js";
export default {
  name: "sleepDiary",
  data() {
    return {
      allData: JSON.parse(JSON.stringify(allData)),
      showNowOneData: JSON.parse(JSON.stringify(allData))[0]
    };
  },
  mounted() {
    let myChart = echarts.init(document.getElementById("homeChart"));
    let xdata = [];
    let seriesData1 = [];
    let seriesData2 = [];
    let seriesData3 = [];
    this.allData.map(value => {
      xdata.push(value.Date);
      seriesData1.push(value.Awake);
      seriesData2.push(parseInt(value.LightSleep.replace("%", "")));
      seriesData3.push(parseInt(value.DeepSleep.replace("%", "")));
    });
    // 基于准备好的dom，初始化echarts实例
    myChart.setOption({
      title: {
        text: "Sophie's Sleeping Diary",
        textStyle: { color: "#fff" },
        padding: [0, 10],
        right: 20
      },
      textStyle: {
        color: "#fff"
      },
      color: ["rgb(84,74,136)", "rgb(183,175,222)", "rgb(183,175,122)"],
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["Deep Sleep", "Light Sleep"],
        textStyle: {
          color: "#fff"
        }
      },
      grid: {
        left: "6%",
        right: "6%",
        bottom: 40,
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          name: "DATE",
          data: xdata
        }
      ],
      dataZoom: [
        {
          type: "slider",
          textStyle: {
            color: "fff"
          },
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 30,
          zoomLock: true
        }
      ],
      yAxis: [
        {
          type: "value",
          name: "PERCENT",
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: "Deep Sleep",
          type: "bar",
          stack: "sleep",
          data: seriesData3
        },
        {
          name: "Light Sleep",
          type: "bar",
          barWidth: 20,
          stack: "sleep",
          data: seriesData2
        }
      ]
    });
    const that = this;
    myChart.on("mouseover", function(params) {
      that.showNowOneData = that.allData[params.dataIndex];
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.home {
  padding: 0 15px;
  background-color: rgb(78, 67, 141);
  background: -webkit-linear-gradient(rgb(94, 81, 171), rgb(124, 105, 195));
  background: -o-linear-gradient(rgb(94, 81, 171), rgb(124, 105, 195));
  background: -moz-linear-gradient(rgb(94, 81, 171), rgb(124, 105, 195));
  background: linear-gradient(rgb(94, 81, 171), rgb(124, 105, 195));
}
#homeChart {
  width: 100%;
  height: 300px;
  padding-bottom: 20px;
  padding-top: 20px;
  color: #f2f2f2;
}
.more-data {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 1px solid #f2f2f2;
  .data-detail {
    &:last-child {
      border-right: none;
    }
    border-right: 1px solid #f2f2f2;
    width: 33.33%;
    padding: 8px;
    h3 {
      font-weight: normal;
      font-size: 16px;
      margin-bottom: 10px;
      color: #f2f2f2;
    }
    p {
      font-size: 12px;
      color: #f2f2f2;
    }
  }
}
.more-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 1px solid #f2f2f2;
  border-bottom: none;
  .icon-detail {
    &.icon-detail-active {
      background-color: rgb(220, 219, 224);
      h3 {
        color: rgb(24, 147, 220);
      }
      p {
        color: rgb(24, 147, 220);
      }
    }
    &:last-child {
      border-right: none;
    }
    border-right: 1px solid #f2f2f2;
    width: 20%;
    padding: 8px;
    h3 {
      font-size: 16px;
      margin-bottom: 10px;
      color: #f2f2f2;
    }
    p {
      font-size: 12px;
      color: #f2f2f2;
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
    padding: 8px;
    h3 {
      font-size: 16px;
      margin-bottom: 10px;
      color: #f2f2f2;
    }
    p {
      font-size: 12px;
      color: #f2f2f2;
    }
  }
}
.date {
  color: #f2f2f2;
  padding: 15px 0;
}
</style>
