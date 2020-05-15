<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">意见反馈</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<template>
					<el-select v-model="feedbackStatus" placeholder="请选择">
						<el-option v-for="item in feedbackOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
			</div>
			<!-- 信息展示 -->
			<el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange"
			 v-loading="$store.state.requestLoading">
				<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="80" prop="coachName" label="是否已读"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="coachName" label="反馈内容"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="createTime" label="反馈时间" :formatter="formatDate"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="80" prop="coachName" label="用户姓名" :formatter="formatInfo"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="150" prop="phone" label="手机号" :formatter="formatInfo"></el-table-column>
				<el-table-column fixed="right" label="操作" width="150" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="handleReadEdit(scope.$index, scope.row)">查看反馈内容</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
			</div>
		</div>

		<!-- 删除价格弹出框 -->
		<el-dialog title="查看反馈信息" :visible.sync="readVisible" width="75%" :close-on-click-modal="closeOnClickModal">
			<span>反馈用户</span>
			
			<span>
				
			</span>
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="readVisible = false">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import menu from '../../common/menu';
	import upload from '../../common/Upload.vue';

	export default {
		name: 'course',
		data() {
			return {
				// 总数据
				tableData: [],
				// 默认显示第几页
				currentPage: 1,
				// 总条数，根据接口获取数据长度(注意：这里不能为空)
				totalCount: 0,
				// 个数选择器（可修改）
				pageSizes: [10, 20, 50, 100],
				// 默认每页显示的条数（可修改）
				PageSize: 10,
				
				readVisible: false,
				
				datelist: [],
				//辅助元素定位
				idx: -1,
				show: '',
				//提交表单
				form: {},
				count: 0,
				//课时状态
				feedbackStatus: "全部",
				feedbackOptions: [{
					value: '',
					label: '全部'
				}, {
					value: 'yes',
					label: '已读'
				}, {
					value: 'no',
					label: '未读'
				}],
			};
		},

		watch: {
			feedbackStatus(val, oldVal) {
				console.log("inputVal = " + val + " , oldValue = " + oldVal);
				this.getData(val);
			}
		},
		created() {
			this.getData();
		},
		computed: {
			data() {
				return this.tableData;
			},
			total() {
				return this.count;
			}
		},
		methods: {
			// 获取 easy-mock 的模拟数据
			getData(status) {
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				this.$axios
					.post('/feedback/query', {
						pageNo: this.currentPage,
						pageSize: this.PageSize,
						isReadStatus: status
					})
					.then(res => {
						this.tableData = res.data.records;
						this.totalCount = res.data.total;
					});
			},
			
			//控制打开详细信息查看框体
			handleReadEdit(index, row) {
				this.form = row;
				this.idx = index;
				this.readVisible = true;
			},
			

			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			search() {
				this.getData();
			},
			searchHour() {

			},


			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue) {
					this.dynamicTags.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
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
				this.getData(this.PageSize, val * this.pageSize);
			},
			
			formatDate(row) {
				let time = new Date(row.createTime);
				return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},
			
			formatInfo(row){
				if(row.status === "no"){
					return "匿名";
				}
			},
		}
	};
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

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409eff;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}

	.el-tag+.el-tag {
		margin-left: 10px;
	}

	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}

	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
</style>
