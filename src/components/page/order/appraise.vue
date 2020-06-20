<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">订单列表</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>


		<div class="container">

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
			getData() {
				this.loading = true;
				this.$axios
					.post('/orderChildAppraise/queryAppraise', {
						pageNo: this.currentPage,
						pageSize: this.PageSize,
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
</style>
