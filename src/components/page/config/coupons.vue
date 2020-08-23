<template>
  <div class="table" v-loading="loading">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades">优惠券配置</i>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="add" @click="add">新增</el-button>
      </div>
      <el-table
              :data="tableData"
              border
              class="table"
              ref="multipleTable"
              v-loading="$store.state.requestLoading"
      >
        <el-table-column prop="cname"  label="名称" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="reachprice" label="到达使用金额" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="amountreduction" label="优惠金额" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="validitydata" label="到期时间" :formatter="dateFormatCreate" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="usingastate" label="使用状态" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="rules" label="规则说明" align="center"  :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="userName" label="用户名" align="center" :show-overflow-tooltip="true" ></el-table-column>
        <el-table-column prop="userPhone" label="用户手机号" align="center" :show-overflow-tooltip="true" ></el-table-column>
      </el-table>
	  <div class="pagination">
	  	<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
	  	 :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
	  </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="新增/编辑" :visible.sync="editVisible" width="50%" :close-on-click-modal="closeOnClickModal">
      <el-form ref="siteform" :model="form" :rules="rules" label-width="50px">
        <el-form-item label-width="100px" label="名称" prop="cname" >
          <el-input v-model="form.cname"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="到达使用金额" prop="reachprice" >
          <el-input type="number" v-model="form.reachprice"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="优惠金额" prop="amountreduction">
         <el-input type="number" v-model="form.amountreduction"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="到期时间" prop="validitydata">
         <el-date-picker
               v-model="form.validitydata"
               type="date"
               placeholder="选择日期时间">
             </el-date-picker>
        </el-form-item>
       <el-form-item label-width="100px" label="规则" prop="rules">
          <el-input   v-model="form.rules"></el-input>
       </el-form-item>
	   
	   <el-form-item label-width="100px" label="最早注册时间" prop="minData">
	    <el-date-picker
	          v-model="form.minData"
	          type="date"
	          placeholder="选择日期时间">
	        </el-date-picker>
	   </el-form-item>
	   <el-form-item label-width="100px" label="最晚注册时间" prop="maxData">
	    <el-date-picker
	          v-model="form.maxData"
	          type="date"
	          placeholder="选择日期时间">
	        </el-date-picker>
	   </el-form-item>
	   <el-form-item label-width="100px" label="用户类型" prop="maxData">
		<el-select v-model="form.userType" placeholder="请选择">
	      <el-option
	        v-for="item in options"
	        :key="item.value"
	        :label="item.label"
	        :value="item.value">
	      </el-option>
	    </el-select>
	   </el-form-item>
	   
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary"  :loading="$store.state.requestLoading"  @click="saveEdit('form')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import menu from '../../common/menu'
  export default {
    name: 'site',
    data() {

      return {
		 loading: true,
		 tableData: [],
		 // 默认显示第几页
		 currentPage: 1,
		 // 总条数，根据接口获取数据长度(注意：这里不能为空)
		 totalCount: 0,
		 // 个数选择器（可修改）
		 pageSizes: [10, 20, 50, 100],
		 // 默认每页显示的条数（可修改）
		 PageSize: 10,
        // 总数据
        tableData:[],
		options:[{
          value: 'yes',
          label: '新用户'
        }, {
          value: 'no',
          label: '老用户'
        }, {
          value: 'all',
          label: '所有用户'
        }],
        editVisible:false,
        form: {
          id:'',
          cname:'',
          reachprice:'',
          amountreduction:'',
          validitydata:'',
          rules:'',
          minData:'',
          maxData:'',
          userType:'',
        },
        count: 0,
        value: "male",
        rules: {
          cname: [
            { required: true, message: "请输入", trigger: "blur" }
          ],
          reachprice: [
            { required: true, message: "请输入", trigger: "blur" }
          ],
          amountreduction: [
            { required: true, message: "请输入", trigger: "blur" }
          ],
          validitydata: [
            { required: true, message: "请输入", trigger: "blur" }
          ],
          rules: [
            { required: true, message: "请输入", trigger: "blur" }
          ],
          minData: [
            { required: true, message: "请输入", trigger: "blur" }
          ],
		  maxData: [
		    { required: true, message: "请输入", trigger: "blur" }
		  ],
		  userType: [
		    { required: true, message: "请输入", trigger: "blur" }
		  ]
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      add(){
        this.from = {
          id:'',
          cname:'',
          reachprice:'',
          amountreduction:'',
          validitydata:'',
          rules:'',
          minData:'',
          maxData:'',
          userType:'',
        } 
        this.editVisible=true;
      },
      formStatus(row) {
        return row.status == 'yes' ? '开放' : '禁用';
      },
      getData() {
        // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
		this.loading = true;
        this.$axios.post("/coupons/getCoupons", {
				pageNo: this.currentPage,
				pageSize: this.PageSize
		}).then(res => {
		this.totalCount = res.data.total;
          this.tableData = res.data.records;
        });
		this.loading = false;
      },
      handleEdit(idex,row) {
        this.form=row;
        this.editVisible=true;
      },
	  // 每页显示的条数
	  handleSizeChange(val) {
	  	// 改变每页显示的条数
	  	this.PageSize = val;
	  	// 点击每页显示的条数时，显示第一页
	  	this.getData(val, 1);
	  	// 注意：在改变每页显示的条数时，要将页码显示到第一页
	  	this.currentPage = 1;
	  },
	  // 显示第几页
	  handleCurrentChange(val) {
	  	// 改变默认的页数
	  	this.currentPage = val;
	  	// 切换页码时，要获取每页显示的条数
	  	this.getData();
	  },
	  
	  
      saveEdit(formName) {
        this.$refs.siteform.validate(valid => {
          if (valid) {
              let fd = JSON.parse(JSON.stringify(this.form));
              delete fd.id;
			  this.loading = true;
              this.$axios.post("/coupons/createCoupons", fd).then(res => {
                if (!res.success) {
                  this.$message.success(res.errMsg);
                  return;
                }
                this.$message.success(`操作成功`);
                this.getData();
                this.editVisible = false;
              });
			  this.loading = false;
            
          } else {
            console.error("error submit!!");
            return false;
          }
        });
      },
      handleDelete(row) {
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
			this.loading = true;
          this.$axios({
            url: '/distance/delDistance',
            method: 'POST',
            data: {
              id:row.id
            },
          }).then(res => {
            if (res) {
              this.$message.success("成功");
              this.getData();
            }
          });
		  this.loading = false;
        })
      },
      dateFormatCreate(row) {
        if (row.validitydata != null) {
          let date1 = new Date(row.validitydata);
          return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getMilliseconds();
        } else {
          return '';
        }
      },
      dateFormatUpdate(time) {
      if (time.updateTime != null) {
        let date1 = new Date(time.updateTime);
        return date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate()+" " + date1.getHours()+":"+date1.getMinutes()+":"+date1.getMilliseconds();
      } else {
        return '';
      }
    }
    }
  }
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 100px;
    display: inline-block;
  }
  .del-dialog-cnt {
    font-size: 16px;
    text-align: center;
  }
  .table {
    width: 100%;
    font-size: 14px;
  }
  .red {
    color: #ff0000;
  }
  .mr10 {
    margin-right: 10px;
  }
</style>
