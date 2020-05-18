<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">订单列表</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
			</div>
			<!-- 信息展示 -->


			<el-table :data="tableData" style="width: 100%" :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="exChange">
				<el-table-column type="expand">
					<template slot-scope="props">
						<el-table :data="childrenTableData">
							<el-table-column prop="classNumberName" label="课时名称"></el-table-column>
							<el-table-column prop="attendTime" label="上课时间" :formatter="formatChildrenAttendTimeDate"></el-table-column>
							<el-table-column prop="finishTime" label="下课时间" :formatter="formatChildrenFinishTimeDate"></el-table-column>
							<el-table-column prop="price" label="价格"></el-table-column>
							<el-table-column prop="attendStatus" label="上课状态"></el-table-column>
							<el-table-column prop="signStatus" label="签到状态"></el-table-column>
							<el-table-column prop="isCoachSettlement" label="是否需要给教练结算"></el-table-column>
							<el-table-column prop="remark" label="备注"></el-table-column>
							<el-table-column prop="scoreTime" label="评分时间" :formatter="formatChildrenScoreTimeDate"></el-table-column>
							<el-table-column prop="scoreNumber" label="评分分数"></el-table-column>
							<el-table-column prop="createTime" label="创建时间" :formatter="formatChildrenCreateTimeDate"></el-table-column>
							<el-table-column fixed="right" header-align="center" align="center" width="160" label="操作">
								<template slot-scope="scp">
									<el-button type="text" icon="el-icon-s-order" @click="handleScore(scp.$index, scp.row)">评分</el-button>
									<el-button type="text" icon="el-icon-s-order" @click="handleTime(scp.$index, scp.row)">修改上课时间</el-button>
								</template>
							</el-table-column>
						</el-table>
					</template>
				</el-table-column>


				<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" width="50"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="200" prop="orderNumber" label="订单号"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="courseName" label="课程名称"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="name" label="用户名称"></el-table-column>
				<el-table-column width="120" height="100" prop="headPic" label="用户头像(发起人)">
					<template scope="scope">
						<img :src="scope.row.headPic" width="100" height="100" />
					</template>
				</el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="280" prop="detailedAddress" label="详细地址"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="venueAddress" label="上课地点名"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="150" prop="addressRemark" label="地址备注"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="campName" label="营名称"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="120" prop="schedulingName" label="排课规律名"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="attendTime" label="上课时间" :formatter="formatAttendTimeDate"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="finishTime" label="下课时间" :formatter="formatFinishTimeDate"></el-table-column>

				<el-table-column :show-overflow-tooltip="true" width="100" prop="isOpen" label="是否开课"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="orderStatus" label="订单状态" :formatter="formatOrderStatusDate"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="130" prop="teamName" label="团队名称"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="120" prop="closeTime" label="拼单结束日期" :formatter="formatCloseTimeDate"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
			</div>
		</div>
		<!-- 评/修改 分弹出框 -->
		<el-dialog title="评/修改 分" :visible.sync="ScoreVisible" width="60%" :close-on-click-modal="closeOnClickModal">
			<el-form ref="scoreform" :model="form" label-width="50px" :rules="rules">
				<el-form-item label-width="100px" label="分数" prop="scoreNumber">
					<el-input v-model.number="form.scoreNumber"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="changeScore()">确 定</el-button>
				<el-button @click="ScoreVisible = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 修改上课时间弹出框 -->
		<el-dialog title="修改上课时间" :visible.sync="TimeVisible" width="60%" :close-on-click-modal="closeOnClickModal">
			<el-form ref="timeform" :model="form" label-width="50px" :rules="rules">
				<div class="block" align="center">
					<span class="demonstration">请选择推迟后的上课时间及下课时间(上课时间不可晚于下课时间)</span>
					<br />
					<el-date-picker :editable="false" v-model="changeTimeData" type="datetimerange" range-separator="至"
					 start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="changeTime()">确 定</el-button>
				<el-button @click="TimeVisible = false">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>


<script>
	import menu from '../../common/menu';

	export default {
		name: 'course',
		data() {
			return {
				loading: true,

				// 总数据
				tableData: [],
				childrenTableData: [],
				// 默认显示第几页
				currentPage: 1,
				// 总条数，根据接口获取数据长度(注意：这里不能为空)
				totalCount: 0,
				// 个数选择器（可修改）
				pageSizes: [10, 20, 50, 100],
				// 默认每页显示的条数（可修改）
				PageSize: 10,

				changeTimeData: "",

				ScoreVisible: false,
				TimeVisible: false,
				//辅助元素定位
				idx: -1,
				show: '',
				//提交表单
				form: {},
				count: 0,

				rules: {
					scoreNumber: [{
						required: true,
						message: '该项不能为空',
						trigger: 'blur'
					}, {
						type: 'number',
						message: '分数必须为数字值'
					}, {
						validator: function(rule, value, callback) {
							if (value > 100 || value < 0) {
								callback(new Error("分数范围是0-100的整数"));
							} else {
								callback();
							}
						},
						trigger: 'blur'
					}],
					attendTime: [{
						required: true,
						message: '该项不能为空',
						trigger: 'blur'
					}],
				},

				expands: [],
				getRowKeys: (row) => {
					return row.id;
				},

			};
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
			exChange(row, childrenTableData) {
				this.loading = true

				var that = this
				if (childrenTableData.length) { // 只展开一行//说明展开了
					that.expands = []
					if (row) {
						that.expands.push(row.id) // 只展开当前行id
					}
					this.getChildenData(row.id);
					//  this.tablaData(row.eqId)  这里可以调用接口数据渲染
				} else { // 说明收起了
					that.expands = [];
					this.loading = false;
				}
			},

			formatAttendTimeDate(row) {
				let time = new Date(row.attendTime);
				return time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},
			formatFinishTimeDate(row) {
				let time = new Date(row.finishTime);
				return time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},
			formatCloseTimeDate(row) {
				let time = new Date(row.closeTime);
				return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},


			formatChildrenAttendTimeDate(row) {
				let time = new Date(row.attendTime);
				return time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},
			formatChildrenFinishTimeDate(row) {
				let time = new Date(row.finishTime);
				return time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},

			formatChildrenScoreTimeDate(row) {
				let time = new Date(row.scoreTime);
				return time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},
			formatChildrenCreateTimeDate(row) {
				let time = new Date(row.createTime);
				return time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
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

			// 获取 easy-mock 的模拟数据
			getData() {
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				/* var fd = {
					pageNo: this.currentPage,
					pageSize: this.PageSize
				} */
				this.loading = true;
				/* this.$axios
					.post('/order/getOrderList', {
						rfd
					}).then(res => {
						this.tableData = res.data.records;
						this.totalCount = res.data.total;
						this.loading = false; */

				this.$axios({
					url: '/order/getOrderList',
					method: 'post',
					data: {
						pageNo: this.currentPage,
						pageSize: this.PageSize
					}
					/* ,
										headers: {
											'Content-Type': 'application/json;charset=UTF-8'
										} */
				}).then(res => {
					this.tableData = res.data.records;
					this.totalCount = res.data.total;
					this.loading = false;
				});

			},
			getChildenData(orderId) {
				this.loading = true;
				this.$axios({
					url: '/order/getOrderInfoById',
					method: 'post',
					data: {
						orderId: orderId
					}
				}).then(res => {
					this.childrenTableData = res.data.ordersChildBOS;
					this.loading = false;
				});
			},
			search() {
				this.getData();
			},

			formatOrderStatusDate(row) {
				switch (row.orderStatus) {
					case "notpay":
						return "未付款";
					case "spell":
						return "拼单中";
					case "attend":
						return "上课中";
					case "complete":
						return "已完成";
					case "cancel":
						return "已取消";
				}
			},

			handleScore(index, row) {
				this.form = row;
				this.idx = index;
				this.ScoreVisible = true;
			},
			handleTime(index, row) {
				this.form = row;
				this.idx = index;
				// let attendTime = new Date(row.attendTime);
				/* this.changeTimeData = [new Date(attendTime.getFullYear(), (attendTime.getMonth() + 1), attendTime.getDate(),
					attendTime.getHours(), attendTime.getMinutes(), attendTime.getSeconds()), new Date()];*/
				this.changeTimeData = [new Date(row.attendTime), new Date(row.finishTime)];
				this.TimeVisible = true;
			},

			changeTime() {
				var attendTime = this.changeTimeData[0];
				var finishTime = this.changeTimeData[1];

				/* time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds() */
				/* var timeData = {
					id : this.form.id;
					attendTime :
				} */
			},

			//确定修改分数
			changeScore() {
				this.$refs.scoreform.validate(valid => {
					if (valid) {
						/* 更新 */
						var scoreData = {
							orderId: this.form.orderId,
							id: this.form.id,
							scoreNumber: this.form.scoreNumber
						}
						this.$axios.post('/orderChild/updateGradeStudent', scoreData).then(res => {
							if (!res.success) {
								this.$message.success(res.errMsg);
								return;
							}
							this.$message.success(`评分成功`);
							this.getChildenData(this.form.orderId);
							this.form = {};
							this.ScoreVisible = false;
						});
					} else {
						console.error('error submit!!');
						return false;
					}
				});
			},


			handleSelectionChange(val) {
				this.multipleSelection = val;
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
