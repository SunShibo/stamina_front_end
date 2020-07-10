<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">评价浏览</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		
		<div class="container">
			<div class="handle-box">
				<el-input v-model="orderNumberTitle" placeholder="订单号码" class="handle-input mr10"></el-input>
				<el-input v-model="userContactNameTitle" placeholder="联系人姓名" class="handle-input mr10"></el-input>
				<el-input v-model="userContactPhoneTitle" placeholder="联系人电话" class="handle-input mr10"></el-input>
				<el-input v-model="studentNameTitle" placeholder="学生姓名" class="handle-input mr10"></el-input>
				<el-input v-model="coachNameTitle" placeholder="教练名字" class="handle-input mr10"></el-input>
				<el-input v-model="coachPhoneTitle" placeholder="教练电话" class="handle-input mr10"></el-input>
				
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="success" icon="search" @click="reset">重置</el-button>
			</div>
			<el-table :data="tableData" border class="table" tooltip-effect="dark" ref="multipleTable">
				<template slot-scope="scope">
					<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="orderNumber" align="center" label="订单号"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="userContactName" align="center" label="联系人姓名"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="userContactPhone" align="center" label="联系人电话"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="appraiseContent" align="center" label="内容"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" width="50" prop="courseStar" align="center" label="评价星级"></el-table-column>
					<el-table-column :formatter="formatAllData" :show-overflow-tooltip="true" align="center" prop="attendTime" label="时间"></el-table-column>
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
				orderNumberTitle:"",
				userContactNameTitle:"",
				userContactPhoneTitle:"",
				studentNameTitle:"",
				coachNameTitle:"",
				coachPhoneTitle:"",
				
				
				loading: true,
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
				idx: -1,
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
			search(){
				this.currentPage = 1;
				this.getData();
			},
			
			reset(){
				this.orderNumberTitle = "";
				this.userContactNameTitle = "";
				this.userContactPhoneTitle = "";
				this.studentNameTitle = "";
				this.coachNameTitle = "";
				this.coachPhoneTitle = "";
				
				this.getData();
			},
			
			getData() {
				this.loading = true;
				this.$axios
					.post('/orderChildAppraise/queryAppraise', {
						pageNo: this.currentPage,
						pageSize: this.PageSize,
						
						orderNumber:this.orderNumberTitle,
						userContactName:this.userContactNameTitle,
						userContactPhone:this.userContactPhoneTitle,
						studentName:this.studentNameTitle,
						coachName:this.coachNameTitle,
						coachPhone:this.coachPhoneTitle
					})
					.then(res => {
						if (!res.success) {
							this.$message.error("获取数据失败,请稍后再试");
							this.loading = false;
							return;
						}
						this.tableData = res.data.records;
						this.totalCount = res.data.total;
					});
				this.loading = false;
			},
			
			formatAllData(row, column) {
				var returnData;
				switch (column.property) {
					case "attendTime":
						returnData = new Date(row.attendTime).format("hh:mm:ss") + " - " + new Date(row.finishTime).format("hh:mm:ss");
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
		},
	}
</script>

<style>
	.handle-box {
		margin-bottom: 20px;
	}
	
	.handle-select {
		width: 120px;
	}
	
	.handle-input {
		width: 150px;
		display: inline-block;
	}
</style>
