<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索、添加区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <!-- 搜索按钮 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加商品按钮 -->
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区 -->
      <el-table border stripe :data="goodsList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[25, 50, 75, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'component_name',
  data() {
    return {
      // 查询商品参数
      queryInfo: {
        qurey: '',
        pagenum: 1,
        pagesize: 25
      },
      // 总条数
      total: 0,
      // 商品列表
      goodsList: [],
      // 可控制添加商品对话框
      addGoodsDialogVisible: false
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const res = await this.$http.get(`goods`, { params: this.queryInfo })
      console.log(res)
      if (res.data.meta.status !== 200) {
        return this.$message({
          message: '获取商品信息失败!',
          type: 'error',
          duration: 3000
        })
      }
      this.goodsList = res.data.data.goods
      this.total = res.data.data.total
    },
    // 每页商品条数改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 页数改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 根据商品id 删除商品
    async removeById(goods_id) {
      // console.log(goods_id)
      // 询问用户是否删除
      const res = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        return err
      })
      // 如果用户确认删除  则返回值为字符串 confim
      // 如果用户取消删除  则返回值为字符串 cancel
      // console.log(res)
      if (res !== 'confirm') {
        return this.$message.info('已取消删除!')
      }
      // console.log('确认删除')
      const request = await this.$http.delete(`goods/${goods_id}`)
      console.log(request)
      if (request.data.meta.status !== 200) {
        return this.$message.error(request.data.meta.msg)
      }
      // 刷新数据列表
      this.getGoodsList()
      // 提示修改成功
      this.$message.success('删除商品数据成功!')
    },
    // 点击添加商品按钮跳转页面
    goAddPage(){
        this.$router.push('/goods/add')
    }
  },
  computed: {}
}
</script>
<style lang="less" scoped></style>
