<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">上课时间</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-button type="primary" icon="el-icon-circle-plus-outline" @click="add">新增</el-button>
			</div>
			<!-- 信息展示 -->
			<el-table :data="tableData" border class="table" ref="timeTable">
				<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="model" label="训练模式"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="type" label="类型"></el-table-column>
				<el-table-column :formatter="formatAllData" :show-overflow-tooltip="true" prop="openTime" label="上课时间"></el-table-column>
				<el-table-column :formatter="formatAllData" :show-overflow-tooltip="true" prop="schedulingName" label="排课规律"></el-table-column>
				<el-table-column fixed="right" label="操作" width="150" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
						
						
						<el-popconfirm title="确认删除此项目吗？" @onConfirm="handleDelete(scope.$index, scope.row)">
							<el-button slot="reference" type="text" icon="el-icon-delete" style="color: #ff4d51!important">删除
							</el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
			</div>
		</div>

		<!-- 修改框 -->
		<el-dialog title="新增/编辑时间" :visible.sync="editVisible" width="40%" height="700px" :close-on-click-modal="closeOnClickModal">
			<el-form ref="courseTimeform" :model="form" label-width="50px">
				<el-form-item label-width="120px" label="训练模式" prop="model" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur'},{ required: true, message: '该项不能为空', trigger: 'change' }]">
					<template>
						<el-select v-model="form.model" placeholder="请选择状态">
							<el-option v-for="item in modeleOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
						</el-select>
					</template>
				</el-form-item>

				<el-form-item label-width="120px" label="类型" prop="type" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur'},{ required: true, message: '该项不能为空', trigger: 'change' }]">
					<template>
						<el-select v-model="form.type" placeholder="请选择状态">
							<el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
						</el-select>
					</template>
				</el-form-item>

				<el-form-item label-width="120px" label="排课规律" prop="scheduling" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur'},{ required: true, message: '该项不能为空', trigger: 'change' }]">
					<template>
						<el-select v-model="form.scheduling" multiple placeholder="请选择" >
							<el-option v-for="item in allWeekOptions" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</template>
				</el-form-item>
				<template>
					<el-form-item label-width="120px" label="开课时间" prop="openTime" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur'},{ required: true, message: '该项不能为空', trigger: 'change' }]">
						<el-time-select placeholder="起始时间" v-model="form.openTime" :picker-options="{
						      start: '06:00',
						      step: '00:30',
						      end: '24:00'
						    }">
						</el-time-select>
					</el-form-item>
					
					<el-form-item label-width="120px" label="结束时间" prop="closeTime" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur'},{ required: true, message: '该项不能为空', trigger: 'change' }]">
						<el-time-select placeholder="结束时间" v-model="form.closeTime" :picker-options="{
						      start: '06:00',
						      step: '00:30',
						      end: '24:00',
						      minTime: form.openTime
						    }">
						</el-time-select>
					</el-form-item>
					
					<el-form-item label-width="100px" label="权重" prop="sortNum" :rules="[{type: 'number', message: '课时必须为数字值'}]">
						<el-input v-model.number="form.sortNum"></el-input>
					</el-form-item>
				</template>


			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="saveTimeEdit('form')">确
					定</el-button>
				<el-button @click="editVisible = false">取 消</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	import menu from '../../common/menu';
	import upload from '../../common/Upload.vue';


	export default {
		name: 'courseTime',
		data() {
			return {
				loading: true,

				allWeekOptions: [{
					id: 1,
					name: "星期一"
				}, {
					id: 2,
					name: "星期二"
				}, {
					id: 3,
					name: "星期三"
				}, {
					id: 4,
					name: "星期四"
				}, {
					id: 5,
					name: "星期五"
				}, {
					id: 6,
					name: "星期六"
				}, {
					id: 7,
					name: "星期日"
				}],
				modeleOptions: [{
						id: 0,
						name: "每周2课时",
					},
					{
						id: 1,
						name: "每周3课时",
					}
				],

				typeOptions: [{
						id: 0,
						name: "周末班",
					},
					{
						id: 1,
						name: "平日班",
					}
				],


				editVisible: false,
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

				//辅助元素定位
				show: '',

				//提交表单
				form: {},
				count: 0,
			};
		},

		created() {
			this.getData();
		},
		methods: {
			add() {
				this.form = {};
				this.editVisible = true;
			},
			
			handleDelete(index,row){
				this.$axios.post(
					'/Scheduling/deleteScheduling', {
						id: row.id
					}
				).then(res => {
					if (res.success) {
						this.$message.success('删除成功');
						this.getData();
					}
				})
			},
			
			handleEdit(row){
				this.form = {};
				this.form = JSON.parse(JSON.stringify(row));
				var schedulingStr = this.form.scheduling.toString().split(",");
				var schedulingList = [];
				schedulingStr.forEach((item, index, value) =>{
					schedulingList.push(parseInt(item));
				});
				this.form.openTime = new Date(this.form.openTime).format("hh:mm");
				this.form.closeTime = new Date(this.form.closeTime).format("hh:mm");
				this.form.scheduling = schedulingList;
				this.editVisible = true;
			},

			saveTimeEdit(upform) {
				this.loading = true;
				this.$refs.courseTimeform.validate(valid => {
					if (valid) {
						/* 添加 */
						var schedulingNameStr = "";
						var schedulingList = this.form.scheduling;
						
						schedulingList.forEach((item, index, value) => {
							switch (item) {
								case 1:
									schedulingNameStr += "一,"
									break;
								case 2:
									schedulingNameStr += "二,"
									break;
								case 3:
									schedulingNameStr += "三,"
									break;
								case 4:
									schedulingNameStr += "四,"
									break;
								case 5:
									schedulingNameStr += "五,"
									break;
								case 6:
									schedulingNameStr += "六,"
									break;
								case 7:
									schedulingNameStr += "日,"
									break;
							}
						});
						schedulingNameStr = schedulingNameStr.substr(0, schedulingNameStr.length - 1);
						
						var upForm = this.form;
						
						upForm = {
							type: this.form.type,
							model: this.form.model,
							sortNum: this.form.sortNum,
							openTime:this.form.openTime + ":00",
							closeTime:this.form.closeTime + ":00",
							schedulingName: schedulingNameStr,
							scheduling: this.form.scheduling.toString()
						};
						
						if (this.form.id == '' || this.form.id == null) {
							let fd = JSON.parse(JSON.stringify(upForm));
							delete fd.id;
							this.$axios.post('/Scheduling/addScheduling', fd).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									this.loading = false;
									return;
								}

								this.$message.success(`操作成功`);
								this.getData();
								this.form = {};
								this.editVisible = false;
								this.loading = false;
							});
						} else {
							/* 更新 */
							upForm["id"] = this.form.id;
							this.$axios.post('/Scheduling/updateScheduling', upForm).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									this.loading = false;
									return;
								}
								this.$message.success(`操作成功`);
								this.form = {};
								this.getData();
								this.editVisible = false;
								this.loading = false;
							});
						}
						this.loading = false;
					} else {
						console.error('error submit!!');
						return false;
						this.loading = false;
					}
					this.loading = false;
				});
			},

			getData() {
				this.loading = true;
				this.$axios
					.post('/Scheduling/queryScheduling', {
						pageNo: this.currentPage,
						pageSize: this.PageSize
					})
					.then(res => {
						if (!res.success) {
							this.$message.error("获取数据错误,请稍后再试");
						}
						this.tableData = res.data.records;
						this.totalCount = res.data.total;
						this.loading = false;
					});
			},

			formatAllData(row, column) {
				var returnData;
				switch (column.property) {
					case "openTime":
						returnData = new Date(row.openTime).format("hh:mm:ss").toString() + " - " + new Date(row.closeTime).format("hh:mm:ss").toString();
						break;
					case "schedulingName":
						var strSchedulingName = row.schedulingName;
						strSchedulingName = strSchedulingName.split(",");
						returnData = "";
						strSchedulingName.forEach((item, index, value) => {
							var name = item;
							returnData += "星期" + item + ",";
						});
						returnData = returnData.substr(0, returnData.length - 1);
						break;
				}
				return returnData;
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
		}
	};
</script>

<style>
</style>
