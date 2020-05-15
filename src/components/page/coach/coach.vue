<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">教练列表</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="coachNameTitle" placeholder="教练姓名" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="primary" icon="add" @click="addCoach">新增</el-button>
			</div>
			<!-- 信息展示 -->
			<el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange"
			 v-loading="$store.state.requestLoading">
				<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="coachName" label="教练名称"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="130" prop="headPic" label="教练头像">
					<template scope="scope">
						<img :src="scope.row.headPic" width="100" height="100" />
					</template>
				</el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="introduce" label="教练简介"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="number" label="身份证号"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="phone" label="手机号"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="wechat" label="微信号"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="wechatId" label="微信id"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="level" label="等级"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="teachingTypes" label="可授课种类"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="130" prop="idCardPicPositive" label="身份证正面">
					<template scope="scope">
						<img :src="scope.row.idCardPicPositive" width="100" height="100" />
					</template>
				</el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="130" prop="idCardPicReverse" label="身份证反面">
					<template scope="scope">
						<img :src="scope.row.idCardPicReverse" width="100" height="100" />
					</template>
				</el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="createTime" label="创建时间" :formatter="formatDate"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="updateTime" label="修改时间" :formatter="formatupDate"></el-table-column>
				<el-table-column fixed="right" label="操作" width="150" align="center">
					<template slot-scope="scope">
						<!-- <el-button type="text" icon="el-icon-s-claim" @click="handleHour(scope.$index, scope.row)">查询课时</el-button> -->
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
			</div>
		</div>
		<!-- 课时弹出框 -->
		<el-dialog title="课时" :visible.sync="hourVisible" width="75%" :close-on-click-modal="closeOnClickModal">
			<div class="handle-box">
				<template>
					<el-select v-model="hourStatus" placeholder="请选择">
						<el-option v-for="item in hourOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
				<template>
						<span class="demonstration">默认</span>
						<el-date-picker v-model="dateData" type="datetimerange" range-separator="至" start-placeholder="开始日期"
						 end-placeholder="结束日期">
						</el-date-picker>
					
				</template>

				<el-button type="primary" icon="search" @click="searchHour">搜索</el-button>
			</div>



			<el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange"
			 v-loading="$store.state.requestLoading">
				<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="coachName" label="教练名称"></el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hourVisible = false">关 闭</el-button>
			</span>
		</el-dialog>

		<!-- 删除价格弹出框 -->
		<el-dialog title="删除" :visible.sync="delVisible" width="25%" :close-on-click-modal="closeOnClickModal">
			<span>确定删除此教练吗?</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="deleteRow()">确 定</el-button>
				<el-button @click="delVisible = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 编辑课时弹出框 -->
		<el-dialog title="新增/编辑教练" :visible.sync="editCoachVisible" width="75%" height="700px" :close-on-click-modal="closeOnClickModal">
			<el-form ref="coachform" :model="form" :rules="coachRules" label-width="50px">
				<el-form-item label-width="100px" label="教练姓名" prop="coachName" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
					<el-input v-model="form.coachName"></el-input>
				</el-form-item>
				<div class="grid-content bg-purple">
					<el-form-item label-width="100px" label="头像" prop="headPic" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
						<upload class="upload" drag="true" idName="dateId" :onUpLoadSuccess="imgsuccess1" :onUpLoadRemove="imgRemove1"
						 :onUpLoadError="onUpLoadError" :multiple="true" :drag="true" :show-file-list="true" accept="image/*" :fileList="datelist"
						 :filesNumber="1">
						</upload>
					</el-form-item>
				</div>
				<el-form-item label-width="100px" label="简介" prop="introduce" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
					<el-input v-model="form.introduce"></el-input>
				</el-form-item>
				<el-form-item label-width="100px" label="手机号" prop="phone">
					<el-input v-model="form.phone"></el-input>
				</el-form-item>
				<el-form-item label-width="100px" label="微信号" prop="wechat" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
					<el-input v-model="form.wechat"></el-input>
				</el-form-item>
				<el-form-item label-width="100px" label="可授课种类" prop="teachingTypes" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
					<el-input v-model="form.teachingTypes"></el-input>
				</el-form-item>


				<div class="grid-content bg-purple">
					<el-form-item label-width="100px" label="身份证正面" prop="idCardPicPositive" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
						<upload class="upload" drag="true" idName="dateId" :onUpLoadSuccess="imgsuccess2" :onUpLoadRemove="imgRemove2"
						 :onUpLoadError="onUpLoadError" :multiple="true" :drag="true" :show-file-list="true" accept="image/*" :fileList="datelist"
						 :filesNumber="1">
						</upload>
					</el-form-item>
				</div>
				<div class="grid-content bg-purple-light">
					<el-form-item label-width="100px" label="身份证反面" prop="idCardPicReverse" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
						<upload class="upload" drag="true" idName="dateId" :onUpLoadSuccess="imgsuccess3" :onUpLoadRemove="imgRemove3"
						 :onUpLoadError="onUpLoadError" :multiple="true" :drag="true" :show-file-list="true" accept="image/*" :fileList="datelist"
						 :filesNumber="1">
						</upload>
					</el-form-item>
				</div>

				<el-form-item label-width="100px" label="身份证号" prop="number" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
					<el-input v-model="form.number"></el-input>
				</el-form-item>
				<el-form-item label-width="100px" label="级别" prop="level" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
					<el-input v-model="form.level"></el-input>
				</el-form-item>

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="saveCoachEdit('form')">确
					定</el-button>
				<el-button @click="editCoachVisible = false">取 消</el-button>
			</span>
		</el-dialog>

	</div>
</template>
<script>
	import menu from '../../common/menu';
	import upload from '../../common/Upload.vue';

	export default {
		name: 'course',
		components: {
			upload
		},
		data() {
			var checkPhone = (rule, value, callback) => {
				const phoneReg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
				if (!value) {
					return callback(new Error('电话号码不能为空'))
				}
				setTimeout(() => {

					if (!Number.isInteger(+value)) {
						callback(new Error('请输入数字值'))
					} else {
						if (phoneReg.test(value)) {
							callback()
						} else {
							callback(new Error('电话号码格式不正确'))
						}
					}
				}, 100)
			};


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
				delVisible: false,
				datelist: [],
				//删除课时框体状态
				delHourVisible: false,
				//新增\修改课时窗体状态
				editCoachVisible: false,
				//辅助输入框模糊查询
				coachNameTitle: '',
				//辅助元素定位
				idx: -1,
				show: '',
				//提交表单
				form: {},
				count: 0,
				
				
				//课时状态
				/* hourStatus: "",
				hourOptions: [{
					value: '未开始',
					label: '未开始'
				}, {
					value: '进行中',
					label: '进行中'
				}, {
					value: '已完成',
					label: '已完成'
				}],*/
				hourVisible: false,


				//检测规则
				coachRules: {
					courseName: [{
						required: true,
						message: '请输入课程名称',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						validator: checkPhone,
						trigger: 'blur'
					}],
				},
				dateData: [],
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
			// 获取 easy-mock 的模拟数据
			getData() {
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				this.$axios
					.post('/coach/query', {
						pageNo: this.currentPage,
						pageSize: this.PageSize,
						coachName: this.coachNameTitle
					})
					.then(res => {
						this.tableData = res.data.records;
						this.totalCount = res.data.total;
					});
			},
			/* getHourData() {
				this.$axios
					.post('//', {
						pageNo: this.currentPage,
						pageSize: this.PageSize,
						 hourName: this.hourNameTitle 
					})
					.then(res => {
						this.tableData = res.data.records;
						this.totalCount = res.data.total;
					});
			}, */

			//控制打开添加框
			addCoach() {
				this.form = {};
				this.editCoachVisible = true;
			},
			//添加或删除方法
			saveCoachEdit() {
				this.$refs.coachform.validate(valid => {
					if (valid) {
						/* 添加 */
						if (this.form.id == '' || this.form.id == null) {
							let fd = JSON.parse(JSON.stringify(this.form));
							delete fd.id;
							this.$axios.post('/coach/add', fd).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									return;
								}
								this.$message.success(`操作成功`);
								this.getData();
								this.form = {};
								this.editCoachVisible = false;
							});
						} else {
							/* 更新 */
							let coachForm = this.form;
							this.form = {
								id: coachForm.id,
								wechat: coachForm.wechat,
								level: coachForm.level,
								coachName: coachForm.coachName,
								headPic: coachForm.headPic,
								introduce: coachForm.introduce,
								number: coachForm.number,
								phone: coachForm.phone,
								wechatId: coachForm.wechatId,
								teachingTypes: coachForm.teachingTypes,
								idCardPicPositive: coachForm.idCardPicPositive,
								idCardPicReverse: coachForm.idCardPicReverse
							};

							this.$axios.post('/coach/update', this.form).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									return;
								}
								this.$message.success(`操作成功`);
								this.form = {};
								this.getData();
								this.editCoachVisible = false;
							});
						}
						this.active = 0;
					} else {
						console.error('error submit!!');
						return false;
					}
				});
			},
			//控制定位修改框
			handleEdit(index, row) {
				this.form = row;
				this.idx = index;
				this.editCoachVisible = true;
			},

			//控制定位删除框
			handlePriceDelete(index, row) {
				this.form = row;
				this.idx = index;
				this.delPriceVisible = true;
			},
			/* 定位删除的元素 */
			handleDelete(index, row) {
				this.form = row;
				this.idx = index;
				this.delVisible = true;
			},
			// 确定删除课程
			deleteRow() {
				var id = this.form.id;
				this.$axios.post('/coach/delete', {
					id: id
				}).then(res => {
					if (!res.success) {
						this.$message.success(res.errMsg);
						return;
					}
					this.tableData.splice(this.idx, 1);
					this.$message.success('删除成功');
					this.idx = "";
					this.form = {};
					this.delVisible = false;
				});
			},

			//控制开启课时
			/* handleHour(index, row) {
				this.form = row;
				this.idx = index;
				this.hourVisible = true;
			}, */

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
			formatupDate(row) {
				let time = new Date(row.updateTime);
				return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},

			formatDate(row) {
				let time = new Date(row.createTime);
				return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},
			/* 图片上传 */
			onUpLoadError() {
				this.$message('出现错误，请重新尝试');
			},
			imgsuccess1(url) {
				this.$message('头像上传成功');
				this.form.headPic = url;
			},
			imgRemove1() {
				this.$message('头像删除成功');
			},
			imgsuccess2(url) {
				this.$message('身份证正面上传成功');
				this.form.idCardPicPositive = url;
			},
			imgRemove2() {
				this.$message('身份证正面删除成功');
			},
			imgsuccess3(url) {
				this.$message('身份证反面上传成功');
				this.form.idCardPicReverse = url;
			},
			imgRemove3() {
				this.$message('身份证反面删除成功');
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
