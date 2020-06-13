<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">订单列表</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="orderNumberTitle" placeholder="订单号码" class="handle-input mr10"></el-input>
				<template>
					<el-select v-model="classOrderStatus" placeholder="请选择">
						<el-option v-for="item in classOrderOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</template>
				<el-date-picker :editable="false" v-model="selectTimeData" type="datetimerange" range-separator="至"
				 start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="primary" icon="search" @click="reset">重置</el-button>
				<a :href="Rurl">
					<el-button type="primary" icon="search" @click="outputExamine">导出报表</el-button>
				</a>
			</div>
			<!-- 信息展示 -->
			<el-table :data="tableData" style="width: 100%" :row-key="getRowKeys" :expand-row-keys="expands" @expand-change="exChange">
				<el-table-column type="expand">
					<template slot-scope="props">
						<el-table :data="childrenTableData">
							<el-table-column prop="classNumberName" label="课时名称"></el-table-column>
							<el-table-column :formatter="formatAllData" prop="coachId" label="任课教练"></el-table-column>
							<el-table-column prop="attendTime" label="上课时间" :formatter="formatChildrenAttendTimeDate"></el-table-column>
							<el-table-column prop="finishTime" label="下课时间" :formatter="formatChildrenFinishTimeDate"></el-table-column>
							<el-table-column prop="price" label="价格"></el-table-column>
							<el-table-column :formatter="formatAllData" prop="attendStatus" label="上课状态"></el-table-column>
							<el-table-column prop="signStatus" label="签到状态" :formatter="formatSignStatusDate"></el-table-column>
							<el-table-column :formatter="formatAllData" prop="isCoachSettlement" label="是否需要给教练结算"></el-table-column>
							<el-table-column prop="remark" label="备注"></el-table-column>
							<el-table-column prop="scoreTime" label="评分时间" :formatter="formatChildrenScoreTimeDate"></el-table-column>
							<el-table-column prop="scoreNumber" label="评分分数"></el-table-column>
							<el-table-column fixed="right" header-align="center" align="center" width="160" label="操作">
								<template slot-scope="scp">
									<el-button type="text" icon="el-icon-s-order" @click="handleEvaluation(scp.$index, scp.row)">查看评价</el-button>
									<el-button type="text" icon="el-icon-s-order" @click="handleRemark(scp.$index, scp.row)">修改备注</el-button>
									<el-button type="text" icon="el-icon-s-order" @click="handleCoach(scp.$index, scp.row)">分配教练</el-button>
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
				<el-table-column :show-overflow-tooltip="true" width="100" prop="studentName" label="用户名称"></el-table-column>
				<el-table-column width="120" height="60" prop="headPic" label="课程缩略图">
					<template slot-scope="scope">
						<img :src="scope.row.thumbnailPic" width="50" height="50" />
					</template>
				</el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="280" prop="detailedAddress" label="详细地址"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="venueAddress" label="上课地点名"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="150" prop="addressRemark" label="地址备注"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="campName" label="营名称"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="120" prop="schedulingName" label="排课规律名"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="attendTime" label="上课时间" :formatter="formatAttendTimeDate"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="finishTime" label="下课时间" :formatter="formatFinishTimeDate"></el-table-column>

				<el-table-column :show-overflow-tooltip="true" width="100" prop="isOpen" label="是否开课" :formatter="formatAllData"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="orderStatus" label="订单状态" :formatter="formatOrderStatusDate"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="130" prop="teamName" label="团队名称"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="120" prop="closeTime" label="拼单结束日期" :formatter="formatCloseTimeDate"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="130" prop="createTime" label="下单时间" :formatter="formatCreateTimeDate"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
			</div>
		</div>
		<!--  @focus="getStaffInfo" -->
		<!-- 分配教练 -->
		<el-dialog title="分配 / 修改教练" :visible.sync="CoachVisible" width="60%" :close-on-click-modal="closeOnClickModal">
			<el-form ref="coachform" :model="form" label-width="50px">
				<el-form-item label-width="100px" label="分数" prop="scoreNumber">
					<el-select @focus="getAllCoachInfo" filterable v-model="form.coachId" placeholder="请选择教练">
						<el-option v-for="item in coachList" :key="item.id" :label="item.coachName+''+item.phone" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="changeCoach()">确 定</el-button>
				<el-button @click="CoachVisible = false">取 消</el-button>
			</span>
		</el-dialog>

		<!-- 评价信息 -->
		<el-dialog title="评价信息" :visible.sync="evaluationVisible" width="60%" :close-on-click-modal="closeOnClickModal">
			<el-table :data="evaluationData" border class="table" ref="multipleTable" v-loading="$store.state.requestLoading">
				<template slot-scope="scope">
					<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="180" prop="courseStar" label="课程星数"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="180" prop="coachStar" label="教练星数"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="180" prop="appraiseContent" label="评价内容"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="180" prop="appraiseTime" label="评价时间" :formatter="formatAllData"></el-table-column>
				</template>
			</el-table>

			<span slot="footer" class="dialog-footer">
				<el-button @click="evaluationVisible = false">关 闭</el-button>
			</span>
		</el-dialog>

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
					<el-form-item label-width="100px" label="选择时间" prop="attendTime">
						<span class="demonstration">请选择推迟后的上课时间及下课时间(上课时间不可晚于下课时间)</span>
						<br />
						<el-date-picker :editable="false" v-model="changeTimeData" type="datetimerange" range-separator="至"
						 start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="changeTime()">确 定</el-button>
				<el-button @click="TimeVisible = false">取 消</el-button>
			</span>
		</el-dialog>

		<!-- 修改子订单备注弹出框 -->
		<el-dialog title="修改备注" :visible.sync="RemarkVisible" width="60%" :close-on-click-modal="closeOnClickModal">
			<el-form ref="remarkform" :model="form" label-width="50px" :rules="rules">
				<div class="block" align="center">
					<el-form-item label-width="100px" label="输入备注" prop="remark">
						<el-input v-model="form.remark"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="changeRemark()">确 定</el-button>
				<el-button @click="RemarkVisible = false">取 消</el-button>
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

				orderNumberTitle: "",
				
				putCoachId:"",

				RemarkVisible: false,

				CoachVisible: false,

				evaluationData: [],

				evaluationVisible: false,

				classOrderStatus: "全部",
				classOrderOptions: [{
					value: '',
					label: '全部'
				}, {
					value: 'notpay',
					label: '未付款'
				}, {
					value: 'spell',
					label: '拼单中'
				}, {
					value: 'attend',
					label: '上课中'
				}, {
					value: 'complete',
					label: '已完成'
				}, {
					value: 'cancel',
					label: '已取消'
				}],

				selectTimeData: [],
				Rurl: "#",

				coachList: [],

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
						trigger: 'change'
					}],
				},

				expands: [],
				getRowKeys: (row) => {
					return row.id;
				},

			};
		},
		watch: {
			selectTimeData(newName, oldName) {
				var sTime = this.selectTimeData[0];
				var eTime = this.selectTimeData[1];
				var strOrder = "";
				var strSTime = "";
				var strETime = "";
				this.classOrderStatus == "全部" ? strOrder = "" : strOrder = this.classOrderStatus

				if (this.selectTimeData == 0 || this.selectTimeData == null || this.selectTimeData == "") {
					strSTime = "";
					strETime = "";
				} else {
					strSTime = sTime.getFullYear() + '/' + (sTime.getMonth() + 1) + '/' + sTime.getDate() + " " +
						sTime.getHours() +
						":" + sTime
						.getMinutes() + ":" + sTime.getSeconds();

					strETime = eTime.getFullYear() + '/' + (eTime.getMonth() + 1) + '/' + eTime.getDate() + " " +
						eTime.getHours() +
						":" + eTime
						.getMinutes() + ":" + eTime.getSeconds();

					this.Rurl = "/api/export/order?startDate=" + strSTime + "&endDate=" + strETime + "&strOrder=" + strOrder;
				}
			}
		},

		created() {
			this.getData();
			this.getAllCoachInfo();
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
			getAllCoachInfo() {
				this.$axios
					.post('/coach/query', {
						pageNo: 1,
						pageSize: 1000000,
						coachName: ""
					})
					.then(res => {
						if (!res.success) {
							this.$message.error("获取教练信息错误");
						}
						this.coachList = res.data.records;
					});
			},
			formatAllData(row, column) {
				var returnData;
				switch (column.property) {
					case "isCoachSettlement":
						if (row.isCoachSettlement == null) {
							returnData = "未绑定教练";
						}
						break;
					case "attendStatus":
						if (row.attendStatus == "yes") {
							returnData = "已上课";
						} else {
							returnData = "未上课";
						}
						break;
					case "coachId":
						if (row.coachId == "" || row.coachId == null) {
							returnData = "暂未分配教练";
						} else {
							this.coachList.forEach((item, index, value) => {
								var coachid = item.id;
								if (row.coachId == coachid) {
									returnData = item.coachName;
								}
							});
						}
						break;
					case "isOpen":
						if (row.isOpen == "yes") {
							returnData = "已经开课";
						} else {
							returnData = "暂未开课";
						}
						break;
					case "appraiseTime":
						returnData = new Date(row.appraiseTime).format("yyyy-MM-dd hh:mm:ss");
						break;
				}
				return returnData;
			},

			outputExamine() {
				if (this.selectTimeData == 0 || this.selectTimeData == null || this.selectTimeData == "") {
					this.$message.error("请选择时间");
				}
			},

			changeRemark() {
				var remarkForm = this.form;
				this.form = {
					id: remarkForm.id,
					orderId: remarkForm.orderId,
					remark: remarkForm.remark
				};
				this.loading = true;
				this.$axios.post('/order/updateOrderChild', this.form).then(res => {
					if (!res.success) {
						this.$message.success(res.errMsg);
						return;
					}
					this.$message.success(`修改成功`);
					this.getChildenData(this.form.orderId);
					this.form = {};
					this.RemarkVisible = false;
				});
				this.loading = false;
			},

			exChange(row, childrenTableData) {
				this.loading = true

				var that = this
				if (childrenTableData.length) { // 只展开一行//说明展开了
					that.expands = []
					if (row) {
						that.expands.push(row.id) // 只展开当前行id
					}
					this.getChildenData(row.id);
					this.loading = false;
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
			formatCreateTimeDate(row) {
				let time = new Date(row.createTime);
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
				if (time.getFullYear() <= 2000) {
					return "暂未评分";
				} else {
					return time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + " " + time.getHours() + ":" +
						time
						.getMinutes() + ":" + time.getSeconds();
				}
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
				this.loading = true;
				/* this.$axios
					.post('/order/getOrderList', {
						rfd
					}).then(res => {
						this.tableData = res.data.records;
						this.totalCount = res.data.total;
						this.loading = false; 
						30178
						*/
				var sTime = this.selectTimeData[0];
				var eTime = this.selectTimeData[1];
				var strOrder = "";
				var strSTime = "";
				var strETime = "";
				this.classOrderStatus == "全部" ? strOrder = "" : strOrder = this.classOrderStatus

				if (this.selectTimeData == 0 || this.selectTimeData == null || this.selectTimeData == "") {
					strSTime = "";
					strETime = "";
				} else {
					strSTime = sTime.getFullYear() + '/' + (sTime.getMonth() + 1) + '/' + sTime.getDate() + " " +
						sTime.getHours() +
						":" + sTime
						.getMinutes() + ":" + sTime.getSeconds();

					strETime = eTime.getFullYear() + '/' + (eTime.getMonth() + 1) + '/' + eTime.getDate() + " " +
						eTime.getHours() +
						":" + eTime
						.getMinutes() + ":" + eTime.getSeconds();
				}
				this.$axios({
					url: '/order/getOrderList',
					method: 'post',
					data: {
						pageNo: this.currentPage,
						pageSize: this.PageSize,
						orderNumber: this.orderNumberTitle,
						orderStatus: strOrder,
						startTime: strSTime,
						endTime: strETime
					}
				}).then(res => {
					this.tableData = res.data.records;
					this.totalCount = res.data.total;
					this.loading = false;
				});
				this.loading = false;

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
				this.loading = false;
			},

			getEvaluationData(orderId) {
				this.loading = true;
				this.$axios({
					url: '/orderChildAppraise/queryByOrderChildId',
					method: 'post',
					data: {
						orderChildId: orderId
					}
				}).then(res => {
					this.evaluationData = res.data;
					this.loading = false;
				});
				this.loading = false;
			},

			search() {
				this.getData();
			},

			reset() {
				this.orderNumberTitle = "";
				this.classOrderStatus = "";
				this.selectTimeData = [];
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
			formatSignStatusDate(row) {
				switch (row.signStatus) {
					case "no":
						return "未签到";
					case "over":
						return "已签到";
				}
			},
			
			
			changeCoach() {
				var remarkForm = this.form;
				this.form = {
					id: remarkForm.id,
					orderId: remarkForm.orderId,
					coachId: remarkForm.coachId
				};
				this.loading = true;
				this.$axios.post('/order/updateOrderChild', this.form).then(res => {
					if (!res.success) {
						this.$message.success(res.errMsg);
						return;
					}
					this.$message.success(`修改成功`);
					this.getChildenData(this.form.orderId);
					this.form = {};
					this.CoachVisible = false;
				});
				this.loading = false;
			},

			handleScore(index, row) {
				this.form = row;
				this.idx = index;
				this.ScoreVisible = true;
			},

			handleCoach(index, row) {
				this.form = {};
				this.form = row;
				this.CoachVisible = true;
			},

			handleEvaluation(index, row) {
				this.getEvaluationData(row.id);
				this.evaluationVisible = true;
			},

			handleRemark(index, row) {
				this.form = row;
				this.idx = index;
				this.RemarkVisible = true;
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
				if (this.changeTimeData == 0 || this.changeTimeData == null || this.changeTimeData == "") {
					this.$message("日期时间不允许为空");
					return;
				}
				var attendTime = this.changeTimeData[0];
				var finishTime = this.changeTimeData[1];

				var strAttendTime = attendTime.getFullYear() + '/' + (attendTime.getMonth() + 1) + '/' + attendTime.getDate() + " " +
					attendTime.getHours() +
					":" + attendTime
					.getMinutes() + ":" + attendTime.getSeconds();
				var strFinishTime = finishTime.getFullYear() + '/' + (finishTime.getMonth() + 1) + '/' + finishTime.getDate() + " " +
					finishTime.getHours() +
					":" + finishTime
					.getMinutes() + ":" + finishTime.getSeconds();

				var cTimeData = {
					id: this.form.id,
					attendTime: strAttendTime,
					finishTime: strFinishTime
				}
				this.loading = true;
				this.$axios.post('/order/updateOrderChild', cTimeData).then(res => {
					if (!res.success) {
						this.$message.success(res.errMsg);
						return;
					}
					this.$message.success(`修改成功`);
					this.getChildenData(this.form.orderId);
					this.form = {};
					this.TimeVisible = false;
				});
				this.loading = false;

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
						this.loading = true;
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
						this.loading = false;
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
