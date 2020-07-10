<template>
  <div class="table" v-loading="loading">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades">地点配置</i>
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
        <el-table-column prop="id"  label="序号" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="name" label="地点" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="latitude" label="纬度" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="longitude" label="经度" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="radiusOf" label="半径(米)" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" :formatter="formStatus" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" :show-overflow-tooltip="true" :formatter="dateFormatCreate"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" align="center" :show-overflow-tooltip="true" :formatter="dateFormatUpdate"></el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
                    type="text"
                    icon="el-icon-delete"
                    class="red"
                    @click="handleDelete(scope.row)"
            >删除</el-button>

          </template>


        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="新增/编辑" :visible.sync="editVisible" width="50%" :close-on-click-modal="closeOnClickModal">
      <el-form ref="siteform" :model="form" :rules="rules" label-width="50px">
        <el-form-item label-width="100px" label="地点" prop="name" >
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="纬度" prop="latitude" >
          <el-input type="number" v-model="form.latitude"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="经度" prop="longitude">
          <el-input  type="number"  v-model="form.longitude"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="半径(米)" prop="radiusOf">
          <el-input type="number"  v-model="form.radiusOf"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="状态" prop="status">
          <template>
            <el-radio v-model="form.status" label="yes">开放</el-radio>
            <el-radio v-model="form.status" label="no">禁用</el-radio>
          </template>
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
        // 总数据
        tableData:[],
        editVisible:false,
        form: {
          id:'',
          name:'',
          latitude:'',
          longitude:'',
          radiusOf:'',
          status:'yes',
        },
        count: 0,
        value: "male",
        rules: {
          name: [
            { required: true, message: "请输入地点", trigger: "blur" }
          ],
          latitude: [
            { required: true, message: "请输入纬度", trigger: "blur" }
          ],
          longitude: [
            { required: true, message: "请输入经度", trigger: "blur" }
          ],
          radiusOf: [
            { required: true, message: "请输入半径", trigger: "blur" }
          ],
          status: [
            { required: true, message: "请输状态", trigger: "blur" }
          ]

        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      add(){
        this.form= {
           id:'',
           name:'',
           latitude:'',
           longitude:'',
           radiusOf:'',
           status:'yes',
        },
        this.editVisible=true;
      },
      formStatus(row) {
        return row.status == 'yes' ? '开放' : '禁用';
      },
      getData() {
        // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
		this.loading = true;
        this.$axios.post("/distance/queryDistance", {}).then(res => {
          this.tableData = res.data;
        });
		this.loading = false;
      },
      handleEdit(idex,row) {
        this.form=row;
        this.editVisible=true;
      },
      saveEdit(formName) {
        this.$refs.siteform.validate(valid => {
          if (valid) {
            delete this.form.createTime;
            delete this.form.updateTime;
            if (this.form.id == "") {
              let fd = JSON.parse(JSON.stringify(this.form));
              delete fd.id;
			  this.loading = true;
              this.$axios.post("/distance/addDistance", fd).then(res => {
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
			this.loading = true;
              this.$axios.post("/distance/updDistance", this.form).then(res => {
                if (!res.success) {
                  this.$message.success(res.errMsg);
                  return;
                }
                this.$message.success(`操作成功`);
                this.getData();
                this.editVisible = false;
              });
			  this.loading = false;
            }
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
      dateFormatCreate(time) {
        if (time.createTime != null) {
          let date1 = new Date(time.createTime);
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
