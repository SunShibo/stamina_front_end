<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">结算订单</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="coachNameData" placeholder="教练姓名" class="handle-input mr10"></el-input>
				<el-input v-model="coachPhoneData" placeholder="教练手机号码" width="100" class="handle-input mr10"></el-input>
				<el-date-picker :editable="false" v-model="timeData" type="datetimerange" range-separator="至" start-placeholder="开始日期"
				 end-placeholder="结束日期">
				</el-date-picker>
				<template>
					<span>教练结算状态:</span>
					<el-select v-model="coachSettlementStatusData" placeholder="请选择">
						<el-option v-for="item in coachSettlementStatusOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</template>
				<br />
				<br />
				<template>
					<span>是否需要给教练结算:</span>
					<el-select v-model="isCoachSettlementData" placeholder="请选择">
						<el-option v-for="item in isCoachSettlementOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</template>
				<template>
					<span>订单状态:</span>
					<el-select v-model="orderStatusData" placeholder="请选择">
						<el-option v-for="item in orderStatusOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</template>

				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="success" icon="add" @click="reset">重置</el-button>
				<a :href="Rurl">
					<el-button type="primary" icon="search" @click="outputExamine">导出报表</el-button>
				</a>
				
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				
				<el-button type="text" icon="el-icon-s-order" @click="handleStatus('yes')">一键结算</el-button>
				<el-button type="text" icon="el-icon-s-order" @click="handleStatus('no')">一键未结算</el-button>
				<el-button type="text" icon="el-icon-s-order" @click="handleStatus('dispute')">一键纠纷</el-button>

			</div>
			<!-- 信息展示 -->
			<el-table :data="tableData" border class="table" tooltip-effect="dark" ref="multipleTable" @selection-change="handleSelectionChange">
				<template slot-scope="scope">
					<el-table-column type="selection" width="40">
					</el-table-column>
					
					<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
					<el-table-column :formatter="formatAllData" :show-overflow-tooltip="true" width="100" prop="coachName" label="教练姓名"></el-table-column>
					<el-table-column :formatter="formatAllData" :show-overflow-tooltip="true" width="100" prop="coachSettlementStatus"
					 label="教练结算状态"></el-table-column>
					<el-table-column :formatter="formatAllData" :show-overflow-tooltip="true" width="100" prop="isCoachSettlement"
					 label="是否需要给教练结算"></el-table-column>
					<el-table-column :formatter="formatAllData" :show-overflow-tooltip="true" width="140" prop="phone" label="手机号码"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="140" prop="attendTime" label="上课时间" :formatter="formatAttendTime"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="140" prop="finishTime" label="下课时间" :formatter="formatFinishTime"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="150" prop="courseName" label="课程名称"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="180" prop="orderNumber" label="订单号"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="100" prop="campName" label="营名称"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="100" prop="isOpen" label="是否开课" :formatter="formatIsOpen"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="140" prop="createTime" label="下单时间" :formatter="formatCreateTime"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="100" prop="orderStatus" label="订单状态" :formatter="formatOrderStatus"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="100" prop="realPrice" label="实际支付"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="100" prop="orderRemark" label="订单备注"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="150" prop="userContactPhone" label="用户联系电话"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="100" prop="userContactName" label="用户名称"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="100" prop="studentName" label="学员名称"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="100" prop="detailedAddress" label="地址"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="180" prop="classNumberName" label="课时名称"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="100" prop="price" label="课时价格"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="100" prop="attendStatus" label="上课状态" :formatter="formatAttendStatus"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="180" prop="orderChildRemark" label="子订单备注"></el-table-column>

				</template>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
	import menu from '../../common/menu';

	export default {
		name: 'course',
		data() {
			return {
				loading: true,

				coachSettlementStatusOptions: [{
					value: '',
					label: '全部'
				}, {
					value: 'yes',
					label: '已结算'
				}, {
					value: 'no',
					label: '未结算'
				}, {
					value: 'dispute',
					label: '纠纷'
				}],
				isCoachSettlementOptions: [{
					value: '',
					label: '全部'
				}, {
					value: 'yes',
					label: '需要'
				}, {
					value: 'no',
					label: '不需要'
				}],
				orderStatusOptions: [{
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

				coachPhoneData: '',
				timeData: [],
				isCoachSettlementData: '',
				orderStatusData: '',
				coachNameData: '',
				coachSettlementStatusData: '',

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

				Rurl: "#",


				//辅助元素定位
				idx: -1,
				show: '',
				//提交表单
				form: {},
				count: 0,
				selectionList: [],
			};
		},
		watch: {
			timeData(newName, oldName) {
				var sTime = this.timeData[0];
				var eTime = this.timeData[1];
				var strOrder = "";
				var strisCoachSettlementData = "";
				var strorderStatusData = "";
				
				var strSTime = "";
				var strETime = "";
				this.coachSettlementStatusData == "全部" || this.coachSettlementStatusData == "" ? strOrder = "" : strOrder = this.coachSettlementStatusData
				this.isCoachSettlementData == "全部" || this.isCoachSettlementData == "" ? strisCoachSettlementData = "" : strisCoachSettlementData = this.isCoachSettlementData
				this.orderStatusData == "全部" || this.orderStatusData == "" ? strorderStatusData = "" : strorderStatusData = this.orderStatusData
				
				if (this.timeData == 0 || this.timeData == null || this.timeData == "") {
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

					this.Rurl = "/api/export/settleStatus?attendTime=" + strSTime + "&finishTime=" + strETime + "&isCoachSettlement=" + strisCoachSettlementData + "&orderStatus=" + strorderStatusData + "&coachSettlementStatus=" + strOrder;
				}
			},
			coachSettlementStatusData(newName, oldName) {
				var sTime = this.timeData[0];
				var eTime = this.timeData[1];
				var strOrder = "";
				var strisCoachSettlementData = "";
				var strorderStatusData = "";
				
				var strSTime = "";
				var strETime = "";
				this.coachSettlementStatusData == "全部" || this.coachSettlementStatusData == "" ? strOrder = "" : strOrder = this.coachSettlementStatusData
				this.isCoachSettlementData == "全部" || this.isCoachSettlementData == "" ? strisCoachSettlementData = "" : strisCoachSettlementData = this.isCoachSettlementData
				this.orderStatusData == "全部" || this.orderStatusData == "" ? strorderStatusData = "" : strorderStatusData = this.orderStatusData
				
				
				if (this.timeData == 0 || this.timeData == null || this.timeData == "") {
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
			
					this.Rurl = "/api/export/settleStatus?attendTime=" + strSTime + "&finishTime=" + strETime + "&isCoachSettlement=" + strisCoachSettlementData + "&orderStatus=" + strorderStatusData + "&coachSettlementStatus=" + strOrder;
				}
			},
			isCoachSettlementData(newName, oldName) {
				var sTime = this.timeData[0];
				var eTime = this.timeData[1];
				var strOrder = "";
				var strisCoachSettlementData = "";
				var strorderStatusData = "";
				
				var strSTime = "";
				var strETime = "";
				this.coachSettlementStatusData == "全部" || this.coachSettlementStatusData == "" ? strOrder = "" : strOrder = this.coachSettlementStatusData
				this.isCoachSettlementData == "全部" || this.isCoachSettlementData == "" ? strisCoachSettlementData = "" : strisCoachSettlementData = this.isCoachSettlementData
				this.orderStatusData == "全部" || this.orderStatusData == "" ? strorderStatusData = "" : strorderStatusData = this.orderStatusData
				if (this.timeData == 0 || this.timeData == null || this.timeData == "") {
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
			
					this.Rurl = "/api/export/settleStatus?attendTime=" + strSTime + "&finishTime=" + strETime + "&isCoachSettlement=" + strisCoachSettlementData + "&orderStatus=" + strorderStatusData + "&coachSettlementStatus=" + strOrder;
				}
			},
			orderStatusData(newName, oldName) {
				var sTime = this.timeData[0];
				var eTime = this.timeData[1];
				var strOrder = "";
				var strisCoachSettlementData = "";
				var strorderStatusData = "";
				
				var strSTime = "";
				var strETime = "";
				this.coachSettlementStatusData == "全部" || this.coachSettlementStatusData == "" ? strOrder = "" : strOrder = this.coachSettlementStatusData
				this.isCoachSettlementData == "全部" || this.isCoachSettlementData == "" ? strisCoachSettlementData = "" : strisCoachSettlementData = this.isCoachSettlementData
				this.orderStatusData == "全部" || this.orderStatusData == "" ? strorderStatusData = "" : strorderStatusData = this.orderStatusData
				
				if (this.timeData == 0 || this.timeData == null || this.timeData == "") {
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
			
					this.Rurl = "/api/export/settleStatus?attendTime=" + strSTime + "&finishTime=" + strETime + "&isCoachSettlement=" + strisCoachSettlementData + "&orderStatus=" + strorderStatusData + "&coachSettlementStatus=" + strOrder;
				}
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
			outputExamine() {
				if (this.timeData == 0 || this.timeData == null || this.timeData == "") {
					this.$message.error("请选择时间");
				}
			},
			
			handleStatus(status) {
				this.loading = true;
				if(this.selectionList != null && this.selectionList != "" && this.selectionList != []){
					this.$axios
						.post('/orderChild/updateCoachSettlementStatus', {
							coachSettlementStatus: status,
							orderChildId: this.selectionList.toString()
						})
						.then(res => {
							if (!res.success) {
								this.$message.error("修改错误,请稍后重试");
								this.loading = false;
								return;
							}
							this.getData();
						});
				}else{
					this.$message.error("请选择修改对象");
				}
				this.loading = false;
			},


			handleSelectionChange(val) {
				var closeOrderList = val;
				this.selectionList = [];
				closeOrderList.forEach((item) => {
					this.selectionList.push(item.orderChildId);
				});
			},

			formatAllData(row, column) {
				var returnData;
				switch (column.property) {
					case "coachName":
						if (row.coachName == null || row.coachName == "") {
							returnData = "未绑定教练";
						} else {
							returnData = row.coachName;
						}
						break;
					case "coachSettlementStatus":
						if (row.coachSettlementStatus == "yes") {
							returnData = "已经结算";
						} else if(row.coachSettlementStatus == "dispute"){
							returnData = "纠纷";
						}else{
							returnData = "未结算";
						}
						break;
					case "isCoachSettlement":
						if (row.isCoachSettlement == "yes") {
							returnData = "需要";
						} else {
							returnData = "不需要";
						}
						break;
					case "phone":
						if (row.phone == "" || row.phone == null) {
							returnData = "未绑定教练";
						} else {
							returnData = row.phone;
						}
						break;
				}
				return returnData;
			},

			formatCoachSettlementStatus(row) {
				switch (row.coachSettlementStatus) {
					case "yes":
						return "已结算";
					case "no":
						return "未结算";
				}
			},

			formatCreateTime(row) {
				let time = new Date(row.createTime);
				return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},
			formatAttendStatus(row) {
				switch (row.attendStatus) {
					case "yes":
						return "已上课";
					case "no":
						return "未上课";
				}
			},

			formatOrderStatus(row) {
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

			formatIsOpen(row) {
				switch (row.isOpen) {
					case "yes":
						return "已开课";
					case "no":
						return "尚未开课";
				}
			},

			formatIsCoachSettlement(row) {
				switch (row.isCoachSettlement) {
					case "yes":
						return "需要结算";
					case "no":
						return "不需要结算";
				}
			},
			formatAttendTime(row) {
				let time = new Date(row.attendTime);
				return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},
			formatFinishTime(row) {
				let time = new Date(row.finishTime);
				return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},


			reset() {
				this.coachPhoneData = "";
				this.timeData = [];
				this.isCoachSettlementData = '';
				this.orderStatusData = '';
				this.coachNameData = '';
				this.coachSettlementStatusData = '';
			},
			// 获取 easy-mock 的模拟数据
			getData() {
				var strATime = "";
				var strFTime = "";
				if (this.timeData == null || this.timeData == "" || this.timeData == 0) {

				} else {
					var atime = this.timeData[0];
					var ftime = this.timeData[1];

					strATime = atime.getFullYear() + '-' + (atime.getMonth() + 1) + '-' + atime.getDate() + " " +
						atime.getHours() +
						":" + atime
						.getMinutes() + ":" + atime.getSeconds();

					strFTime = ftime.getFullYear() + '-' + (ftime.getMonth() + 1) + '-' + ftime.getDate() + " " +
						ftime.getHours() +
						":" + ftime
						.getMinutes() + ":" + ftime.getSeconds();
				}
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				this.loading = true;
				this.$axios
					.post('/coach/queryCoachInfo', {
						pageNo: this.currentPage,
						pageSize: this.PageSize,
						//coachId: '',
						phone: this.coachPhoneData,
						attendTime: strATime,
						finishTime: strFTime,
						isCoachSettlement: this.isCoachSettlementData,
						orderStatus: this.orderStatusData,
						coachName: this.coachNameData,
						coachSettlementStatus: this.coachSettlementStatusData,
					})
					.then(res => {
						this.tableData = res.data.records;
						this.totalCount = res.data.total;
					});
				this.loading = false;
			},
			search() {
				this.currentPage = 1;
				this.getData();
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
			formatupDate(row) {
				let time = new Date(row.updateTime);
				return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
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
