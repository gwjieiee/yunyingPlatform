<template>
  <div class="main">
    <el-row :gutter="20">
      <el-col :md="6" :sm="12">
        <div class="card flex">
          <div class="card-left">
            <div class="title">成品</div>
            <div class="card-data color1">1233</div>
          </div>
          <div class="card-right">
            <el-icon :size="60" color="rgba(22,159,227,.5)">
              <FolderChecked />
            </el-icon>
          </div>
        </div>
      </el-col>
      <el-col :md="6" :sm="12">
        <div class="card flex">
          <div class="card-left">
            <div class="title">修缮品</div>
            <div class="card-data color2">1233</div>
          </div>
          <div class="card-right">
            <el-icon :size="60" color="rgba(227,118,22,.5)">
              <SetUp />
            </el-icon>
          </div>
        </div>
      </el-col>
      <el-col :md="6" :sm="12">
        <div class="card flex">
          <div class="card-left">
            <div class="title">样品</div>
            <div class="card-data color3">1233</div>
          </div>
          <div class="card-right">
            <el-icon :size="60" color="rgba(22,93,227,.5)">
              <ScaleToOriginal />
            </el-icon>
          </div>
        </div>
      </el-col>
      <el-col :md="6" :sm="12">
        <div class="card flex">
          <div class="card-left">
            <div class="title">借货</div>
            <div class="card-data color4">1233</div>
          </div>
          <div class="card-right">
            <el-icon :size="60" color="rgba(140, 22, 227,.5)">
              <FolderRemove />
            </el-icon>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="gap"></div>
    <el-row :gutter="20">
      <el-col :md="12" :sm="24">
        <bar-chart data="123" @update="do_update" @change="do_change"></bar-chart>
      </el-col>
      <el-col :md="12" :sm="24">
        <pieChart @choose="do_choose"></pieChart>
      </el-col>
    </el-row>
    <!-- <el-button v-debounce="debounce_btn">debounce</el-button> -->
  </div>
</template>

<script setup>
import { FolderChecked, FolderRemove, ScaleToOriginal, SetUp } from '@element-plus/icons'
import barChart from './components/barChart.vue'
import pieChart from './components/pieChart.vue'
import vDebounce from '@/directive/debounce';
import { useRouter } from 'vue-router'

const do_change = (val) => {
  console.log('do-change', val)
}

const do_update = (val) => {
  console.log('do-update', val)
}

const debounce_btn = () => {
  console.log('debounce')
}

const router = useRouter()

const do_choose = (val) => {
  // console.log('choose11111',val)
  router.push({ path: 'inventory', query: val })
}

</script>
<style lang="scss" scoped>
.main {
  padding: 0 15px 20px 15px;
}

.card {
  width: 100%;
  height: 130px;
  box-shadow: 5px 5px 15px #ddd;
  border-radius: 5px;
  background: #fff;
  margin: 10px auto;

  div {
    width: 100%;
    height: 65px;
    line-height: 70px;
    text-align: center;
  }

  .title {
    color: #666;
    font-size: 16px;
  }

  .card-left,
  .card-right {
    width: 50%;
    height: 100%;
  }

  .card-right {
    line-height: 175px;
  }

  .card-data {
    font-size: 30px;
    line-height: 35px;
  }

  .color1 {
    color: rgba(22, 159, 227, .8);
  }

  .color2 {
    color: rgba(227, 118, 22, .8);
  }

  .color3 {
    color: rgba(22, 93, 227, .8);
  }

  .color4 {
    color: rgba(140, 22, 227, .8);
  }
}

.gap {
  width: 100%;
  height: 10px;
}
</style>