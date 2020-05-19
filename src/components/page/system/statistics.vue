<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">实时概况</i></el-breadcrumb-item>
				<el-breadcrumb-item><i class="el-icon-lx-cascades">更新时间:{{nowDate}}</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<!-- <div class="handle-box">
				<el-date-picker :editable="false" v-model="selectTimeData" type="datetimerange" range-separator="至"
				 start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="primary" icon="search" @click="reset">重置</el-button>
			</div> -->
			<!-- 信息展示 -->
			<el-row :gutter="20">
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<span style="font-size: 12px;">支付订单数</span>
						<br />
						<span v-show="tableData.payOrderNumber != null" style="font-size: 20px;">{{tableData.payOrderNumber}}单</span>
						<span v-show="tableData.payOrderNumber == null" style="font-size: 20px;">数据暂无</span>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<span style="font-size: 12px;">支付金额</span>
						<br />
						<span v-show="tableData.paymentAmount != null" style="font-size: 20px;">{{tableData.paymentAmount}}元</span>
						<span v-show="tableData.paymentAmount == null" style="font-size: 20px;">数据暂无</span>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<span style="font-size: 12px;">客户数</span>
						<br />
						<span v-show="tableData.userNumber != null" style="font-size: 20px;">{{tableData.userNumber}}位</span>
						<span v-show="tableData.userNumber == null" style="font-size: 20px;">数据暂无</span>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<span style="font-size: 12px;">付费客户数</span>
						<br />
						<span v-show="tableData.payUserNumber != null" style="font-size: 20px;">{{tableData.payUserNumber}}位</span>
						<span v-show="tableData.payUserNumber == null" style="font-size: 20px;">数据暂无</span>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<span style="font-size: 12px;">拼单中的客户数</span>
						<br />
						<span v-show="tableData.joinOrderUserNumber != null" style="font-size: 20px;">{{tableData.joinOrderUserNumber}}位</span>
						<span v-show="tableData.joinOrderUserNumber == null" style="font-size: 20px;">数据暂无</span>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<span style="font-size: 12px;">拼单中的订单数</span>
						<br />
						<span v-show="tableData.joinOrderNumber != null" style="font-size: 20px;">{{tableData.joinOrderNumber}}单</span>
						<span v-show="tableData.joinOrderNumber == null" style="font-size: 20px;">数据暂无</span>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<span style="font-size: 12px;">待匹配教练的订单数</span>
						<br />
						<span v-show="tableData.matchCoachOrderNumber != null" style="font-size: 20px;">{{tableData.matchCoachOrderNumber}}单</span>
						<span v-show="tableData.matchCoachOrderNumber == null" style="font-size: 20px;">数据暂无</span>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<span style="font-size: 12px;">上课中的学生数</span>
						<br />
						<span v-show="tableData.attendStudentNumber != null" style="font-size: 20px;">{{tableData.attendStudentNumber}}人</span>
						<span v-show="tableData.attendStudentNumber == null" style="font-size: 20px;">数据暂无</span>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<span style="font-size: 12px;">插班的学生人数</span>
						<br />
						<span v-show="tableData.placementStudentNumber != null" style="font-size: 20px;">{{tableData.placementStudentNumber}}人</span>
						<span v-show="tableData.placementStudentNumber == null" style="font-size: 20px;">数据暂无</span>
					</div>
				</el-col>

				<el-col :span="6">
					<div class="grid-content bg-purple">
						<span style="font-size: 12px;">拼单成功率</span>
						<br />
						<span v-show="tableData.joinOrderSucceed != null" style="font-size: 20px;">{{tableData.joinOrderSucceed}}%</span>
						<span v-show="tableData.joinOrderSucceed == null" style="font-size: 20px;">数据暂无</span>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<span style="font-size: 12px;">单位订单拼单时长（分钟）</span>
						<br />
						<span v-show="tableData.junitOrderTime != null" style="font-size: 20px;">{{tableData.junitOrderTime}}分钟</span>
						<span v-show="tableData.junitOrderTime == null" style="font-size: 20px;">数据暂无</span>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<span style="font-size: 12px;">拼单平均时长（分钟）</span>
						<br />
						<span v-show="tableData.joinOrderAverageTime != null" style="font-size: 20px;">{{tableData.joinOrderAverageTime}}分钟</span>
						<span v-show="tableData.joinOrderAverageTime == null" style="font-size: 20px;">数据暂无</span>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<span style="font-size: 12px;">滞销课数量</span>
						<br />
						<span v-show="tableData.unsoldCourseNumber != null" style="font-size: 20px;">{{tableData.unsoldCourseNumber}}门</span>
						<span v-show="tableData.unsoldCourseNumber == null" style="font-size: 20px;">数据暂无</span>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content bg-purple">
						<span style="font-size: 12px;">教练人数</span>
						<br />
						<span v-show="tableData.coachNumber != null" style="font-size: 20px;">{{tableData.coachNumber}}位</span>
						<span v-show="tableData.coachNumber == null" style="font-size: 20px;">数据暂无</span>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>
<script>
	import menu from '../../common/menu';

	export default {
		name: 'course',
		data() {
			return {
				// 总数据
				tableData: [],

				yesterdayTableData: [],
				// 默认显示第几页
				currentPage: 1,
				// 总条数，根据接口获取数据长度(注意：这里不能为空)
				totalCount: 0,
				// 个数选择器（可修改）
				pageSizes: [10, 20, 50, 100],
				// 默认每页显示的条数（可修改）
				PageSize: 10,
				//辅助元素定位
				idx: -1,
				show: '',
				//提交表单
				form: {},
				count: 0,
				nowDate: "",
				selectTimeData: [],

			};
		},
		created() {
			this.getData();
			this.getNowTime();
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
			getData() {
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				this.$axios
					.post('/order/orderReport', {

					})
					.then(res => {
						this.tableData = res.data;
						this.totalCount = res.data.total;
					});
			},

			getyesterdayData() {
				this.$axios
					.post('/order/orderReport', {

					})
					.then(res => {
						this.tableData = res.data;
						this.totalCount = res.data.total;
					});
			},

			reset() {
				this.selectTimeData = [];
			},

			getNowTime() {
				Date.prototype.format = function(fmt) {

					var o = {

						"M+": this.getMonth() + 1, //月份 

						"d+": this.getDate(), //日 

						"h+": this.getHours(), //小时 

						"m+": this.getMinutes(), //分 

						"s+": this.getSeconds(), //秒 

						"q+": Math.floor((this.getMonth() + 3) / 3), //季度 

						"S": this.getMilliseconds() //毫秒 

					};

					if (/(y+)/.test(fmt)) {

						fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

					}

					for (var k in o) {

						if (new RegExp("(" + k + ")").test(fmt)) {

							fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

						}

					}

					return fmt;

				}
				var nowTimeDate = new Date().format("yyyy-MM-dd hh:mm:ss");
				this.nowDate = nowTimeDate;
			},

			//数据处理
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			search() {
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
		}
	};
</script>

<style scoped>
	.el-col-6 {
		padding-top: 50px;
	}

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
