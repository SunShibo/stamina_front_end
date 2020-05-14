<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades">字典配置</i>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div>
        <el-select class="handle-box" @change="change" v-model="select" placeholder="课程属性" >
          <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.key"
                  :value="item.id"
            >
          </el-option>
        </el-select>
        <el-button type="primary" icon="add" @click="add">新增</el-button>
      </div>
      <el-table
              :data="tableData"
              border
              class="table"
              ref="multipleTable"
              v-loading="$store.state.requestLoading"
      >
        <el-table-column prop="value" label="值" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
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
    <el-dialog title="新增/编辑" :visible.sync="editVisible" width="40%" :close-on-click-modal="closeOnClickModal">
      <el-form ref="userform" :model="form" :rules="rules" label-width="50px">
        <el-form-item label-width="100px" label="类型" prop="kId"  placeholder="请选择" >
        <el-select  v-model="form.kId">
          <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.key"
                  :value="item.id"
          >
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label-width="100px" label="值" prop="value" >
          <el-input v-model="form.value"></el-input>
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
    name: 'user',
    data() {

      return {
        // 总数据
        tableData:[],
        editVisible:false,
        options: [],
        select: '',
        form: {
          value:'',
          Kid:'',
        },
        count: 0,
        value: "male",
        rules: {
          value: [
            { required: true, message: "请输入", trigger: "blur" }
          ],
          kId: [
            { required: true, message: "请选择", trigger: "blur" }
          ],
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
      add(){
        this.form= {
          kId:'',
          value:'',
        },
        this.editVisible=true;
      },
      formStatus(row) {
        return row.status == 'yes' ? '开放' : '禁用';
      },
      getData() {
        this.$axios.post("/diction/queryKey").then(res => {
          this.options = res.data;
        });
        this.$axios.post(" /diction/queryValue",{
          kId:1
        }).then(res => {
          this.tableData = res.data;
        });

      },
      handleEdit(idex,row) {
        this.form=row;
        this.editVisible=true;
      },
      change(){
        this.$axios.post(" /diction/queryValue",{
          kId:this.select
        }).then(res => {
          this.tableData = res.data;
        });
      },
      saveEdit(formName) {
        this.$refs.userform.validate(valid => {
          if (valid) {
            delete this.form.createTime;
            delete this.form.updateTime;
              let fd = JSON.parse(JSON.stringify(this.form));
              delete fd.id;
              this.$axios.post("/diction/addValue", fd).then(res => {
                if (!res.success) {
                  this.$message.success(res.errMsg);
                  return;
                }
                this.$message.success(`操作成功`);
                this.getData();
                this.editVisible = false;
              });
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
          this.$axios({
            url: '/diction/delValue',
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

  .handle-box {
    width: 120px;
    margin-right: 20px;
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
