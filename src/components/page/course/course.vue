<template>
	<div class="table" v-loading="loading">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-cascades">课程列表</i></el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="courseNameTitle" placeholder="课程名" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="search" @click="search">搜索</el-button>
				<el-button type="primary" icon="add" @click="add">新增</el-button>
			</div>
			<!-- 信息展示 -->
			<el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange"
			 v-loading="$store.state.requestLoading">
				<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="courseName" label="课程名称"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="140" prop="describe" label="课程描述"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="siteType" label="训练场地类型"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="130" prop="thumbnailPic" label = "缩略图">
					<template slot-scope="scope">
						<img :src="scope.row.thumbnailPic" width="50" height="50" />
					</template>
				</el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="130" prop="introducePic" label = "介绍图">
					<template slot-scope="scope">
						<img :src="scope.row.introducePic" width="50" height="50" />
					</template>
				</el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="studentsSex" label="适合学员年龄"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="frequency" label="训练频次"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="130" prop="introduce" label="课程介绍">
					<template slot-scope="scope">
						<img :src="scope.row.introduce" width="50" height="50" />
					</template>
				</el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="130" prop="ruleIntroduction" label="规则介绍">
					<template slot-scope="scope">
						<img :src="scope.row.ruleIntroduction" width="50" height="50" />
					</template>
				</el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="50" prop="classNumber" label="课时数"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="280" prop="label" label="标签"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="100" prop="type" label="类型"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="150" prop="createTime" label="创建时间" :formatter="formatDate"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" width="150" prop="updateTime" label="修改时间" :formatter="formatupDate"></el-table-column>

				<el-table-column fixed="right" label="操作" width="150" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-s-order" @click="handleHour(scope.$index, scope.row)">课时</el-button>
						<el-button type="text" icon="el-icon-s-finance" @click="handlePrice(scope.$index, scope.row)">价格</el-button>
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
		<!-- 价格弹出框 -->
		<el-dialog title="价格" :visible.sync="priceVisible" width="75%" :close-on-click-modal="closeOnClickModal">
			<el-button type="primary" icon="add" @click="addPrice">添加营</el-button>
			<el-table :data="priceTableData" border class="table" ref="hourTable" @selection-change="handleSelectionChange"
			 v-loading="$store.state.requestLoading">
				<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="coursePriceName" label="营名称"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="openNumber" label="开班人数"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="fullNumber" label="满员人数"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="classNumberPrice" label="每课时价格"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="personNumber" label="每人价格"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建时间" :formatter="formaPriceDate"></el-table-column>
				<el-table-column fixed="right" label="操作" width="100" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="handleEditPrice(scope.$index, scope.row)">编辑</el-button>
						<el-button type="text" icon="el-icon-delete" class="red" @click="handlePriceDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="priceVisible = false">关 闭</el-button>
			</span>
		</el-dialog>


		<!-- 课时弹出框 -->
		<el-dialog title="课时" :visible.sync="hourVisible" width="75%" :close-on-click-modal="closeOnClickModal">
			<el-button type="primary" icon="add" @click="addHour" :disabled="disabled">添加课时</el-button>
			<el-table :data="hourTableData" border class="table" ref="hourTable" @selection-change="handleSelectionChange"
			 v-loading="$store.state.requestLoading">
				<el-table-column :show-overflow-tooltip="true" type="index" label="序号" align="center" sortable width="50"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="className" label="课时名称"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="sort" label="排序级别"></el-table-column>
				<el-table-column fixed="right" label="操作" width="100" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="handleEditHour(scope.$index, scope.row)">编辑</el-button>
						<el-button type="text" icon="el-icon-delete" class="red" @click="handleHourDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hourVisible = false">关 闭</el-button>
			</span>
		</el-dialog>

		<!-- 删除价格弹出框 -->
		<el-dialog title="删除" :visible.sync="delPriceVisible" width="25%" :close-on-click-modal="closeOnClickModal">
			<span>确定删除营吗?</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="deletePrice()">确 定</el-button>
				<el-button @click="delPriceVisible = false">取 消</el-button>
			</span>
		</el-dialog>

		<!-- 删除课时弹出框 -->
		<el-dialog title="删除" :visible.sync="delHourVisible" width="25%" :close-on-click-modal="closeOnClickModal">
			<span>确定删除课时吗?</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="deleteHour()">确 定</el-button>
				<el-button @click="delHourVisible = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 删除弹出框 -->
		<el-dialog title="删除" :visible.sync="delVisible" width="25%" :close-on-click-modal="closeOnClickModal">
			<span>确定删除吗?</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="deleteRow()">确 定</el-button>
				<el-button @click="delVisible = false">取 消</el-button>
			</span>
		</el-dialog>

		<!-- 编辑课时弹出框 -->
		<el-dialog title="新增/编辑课时" :visible.sync="editHourVisible" width="75%" height="700px" :close-on-click-modal="closeOnClickModal">
			<el-form ref="courseform" :model="form" :rules="hourRules" label-width="50px">
				<el-form-item label-width="100px" label="课时名称" prop="className" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
					<el-input v-model="form.className"></el-input>
				</el-form-item>
				<el-form-item label-width="100px" label="排序" prop="sort" :rules="[{ required: true, message: '序号不能为空'},{type: 'number', message: '序号必须为数字值'}]">
					<el-input v-model.number="form.sort"></el-input>
				</el-form-item>

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="saveHourEdit('form')">确
					定</el-button>
				<el-button @click="editHourVisible = false">取 消</el-button>
			</span>
		</el-dialog>


		<!-- 编辑价格弹出框 -->
		<el-dialog title="新增/编辑价格" :visible.sync="editPriceVisible" width="75%" height="700px" :close-on-click-modal="closeOnClickModal">
			<el-form ref="courseform" :model="form" :rules="priceRules" label-width="50px">
				<el-form-item label-width="100px" label="营名称" prop="coursePriceName" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
					<el-input v-model="form.coursePriceName"></el-input>
				</el-form-item>
				<el-form-item label-width="120px" label="开班每课时价格" prop="classNumberPrice" :rules="[{ required: true, message: '开班每课时价格不能为空'}]">
					<el-input v-model="form.classNumberPrice"></el-input>
				</el-form-item>
				<el-form-item label-width="100px" label="每人价格" prop="personNumber" :rules="[{ required: true, message: '每人价格不能为空'}]">
					<el-input v-model="form.personNumber"></el-input>
				</el-form-item>
				<el-form-item label-width="100px" label="开班人数" prop="openNumber" :rules="[{ required: true, message: '开班人数不能为空'},{type: 'number', message: '开班人数必须为数字值'}]">
					<el-input v-model.number="form.openNumber"></el-input>
				</el-form-item>
				<el-form-item label-width="100px" label="满员人数" prop="fullNumber" :rules="[{ required: true, message: '满员人数不能为空'},{type: 'number', message: '满员人数必须为数字值'}]">
					<el-input v-model.number="form.fullNumber"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="$store.state.requestLoading" @click="savePriceEdit('form')">确
					定</el-button>
				<el-button @click="editPriceVisible = false">取 消</el-button>
			</span>
		</el-dialog>


		<!-- 编辑弹出框 -->
		<el-dialog title="新增/编辑" :visible.sync="editVisible" width="75%" height="700px" :close-on-click-modal="closeOnClickModal">
			<el-form ref="courseform" :model="form" :rules="rules" label-width="50px">
				<!-- 基础信息类 -->
				<el-row v-show="active === 0">
					<div>
						<el-form-item label-width="100px" label="课程名称" prop="courseName" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
							<el-input v-model="form.courseName"></el-input>
						</el-form-item>
						<el-form-item label-width="100px" label="描述" prop="describe" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
							<el-input v-model="form.describe"></el-input>
						</el-form-item>
						<el-form-item label-width="100px" label="适合年龄" prop="studentsSex" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
							<el-input v-model="form.studentsSex"></el-input>
						</el-form-item>
						<el-form-item label-width="100px" label="课时数" prop="classNumber" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' },{type: 'number', message: '课时必须为数字值'}]">
							<el-input v-model.number="form.classNumber"></el-input>
						</el-form-item>
						<el-form-item label-width="100px" label="训练频次" prop="frequency" :rules="[{ required: true, message: '该项不能为空', trigger: 'change' }]">
							<el-input v-model="form.frequency"></el-input>
						</el-form-item>
					</div>
				</el-row>
				<!-- 基础图片类 -->
				<el-row v-show="active === 1">
					<el-row>
						<el-col :span="12">
							<div class="grid-content bg-purple">
								<el-form-item label-width="100px" label="缩略图" prop="thumbnailPic" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
									<upload class="upload" drag="true" idName="dateId" :onUpLoadSuccess="imgsuccess1" :onUpLoadRemove="imgRemove1"
									 :onUpLoadError="onUpLoadError" :multiple="true" :drag="true" :show-file-list="true" accept="image/*"
									 :fileList="thumbnailPicdatelist" :filesNumber="1">
									</upload>
								</el-form-item>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="grid-content bg-purple-light">
								<el-form-item label-width="100px" label="介绍图" prop="introducePic" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
									<upload class="upload" drag="true" idName="dateId" :onUpLoadSuccess="imgsuccess2" :onUpLoadRemove="imgRemove2"
									 :onUpLoadError="onUpLoadError" :multiple="true" :drag="true" :show-file-list="true" accept="image/*"
									 :fileList="introducePicdatelist" :filesNumber="1">
									</upload>
								</el-form-item>
							</div>
						</el-col>
					</el-row>



					<!-- 介绍图片类 -->
				</el-row>
				<el-row v-show="active === 2">
					<el-row>
						<el-col :span="12">
							<div class="grid-content bg-purple">
								<el-form-item label-width="100px" label="课程介绍" prop="introduce" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
									<upload class="upload" drag="true" idName="dateId" :onUpLoadSuccess="imgsuccess3" :onUpLoadRemove="imgRemove3"
									 :onUpLoadError="onUpLoadError" :multiple="true" :drag="true" :show-file-list="true" accept="image/*"
									 :fileList="introducedatelist" :filesNumber="1">
									</upload>
								</el-form-item>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="grid-content bg-purple-light">
								<el-form-item label-width="100px" label="规则介绍" prop="ruleIntroduction" :rules="[{ required: true, message: '该项不能为空', trigger: 'blur' }]">
									<upload class="upload" drag="true" idName="dateId" :onUpLoadSuccess="imgsuccess4" :onUpLoadRemove="imgRemove4"
									 :onUpLoadError="onUpLoadError" :multiple="true" :drag="true" :show-file-list="true" accept="image/*"
									 :fileList="ruleIntroductiondatelist" :filesNumber="1">
									</upload>
								</el-form-item>
							</div>
						</el-col>
					</el-row>
				</el-row>
				<!-- 选择类 -->
				<el-row v-show="active === 3">
					<div>

						<el-row>
							<el-col :span="12">
								<div class="grid-content bg-purple">
									<el-form-item label-width="100px" label="地点类型" prop="siteType" :rules="[{ required: true, message: '该项不能为空', trigger: 'change' }]">
										<el-select v-model="form.siteType" clearable placeholder="请选择" style="width:260px">
											<el-option v-for="item in siteTypeOptions"  :key="item.id" :label="item.value" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
								</div>
							</el-col>
							<el-col :span="12">
								<div class="grid-content bg-purple-light">
									<el-form-item label-width="100px" label="类型" prop="type" :rules="[{ required: true, message: '该项不能为空', trigger: 'change' }]">
										<el-select v-model="form.type" clearable placeholder="请选择" style="width:260px">
											<el-option v-for="item in typeOptions" :key="item.id" :label="item.value" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
								</div>
							</el-col>
						</el-row>



					</div>
				</el-row>
				<!-- 标签类 -->
				<el-row v-show="active === 4">
					<div>
						已选择的标签
						<el-tag v-for="tag in tags" :key="tag.id" closable :disable-transitions="false" @close="tagClose(tag)">
							{{tag}}
						</el-tag>
						<el-row>
							<div></div>
						</el-row>
						<br />
						全部标签
						<el-tag v-for="tag in dynamicTags" :key="tag.id" :disable-transitions="false" @close="handleClose(tag)" @click="addtag(tag.value)">
							{{tag.value}}
						</el-tag>
					</div>
				</el-row>

				<el-steps :active="active" align-center finish-status="success">
					<el-step title="步骤1" description="文字描述"></el-step>
					<el-step title="步骤2" description="基础图片"></el-step>
					<el-step title="步骤3" description="介绍图片"></el-step>
					<el-step title="步骤4" description="选择类型"></el-step>
					<el-step title="步骤5" description="标签选择"></el-step>
				</el-steps>

				<el-button @click="bac()">上一步</el-button>
				<el-button v-show="this.active<=3" @click="nex()">{{nextTitle}}</el-button>
				<el-button v-show="this.active==4" type="primary" :loading="$store.state.requestLoading" @click="saveEdit('form')">确
					定</el-button>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
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
			return {
				loading: true,
				
				editPriceVisible: false,
				delPriceVisible:false,
				thumbnailPicdatelist:[],
				introducePicdatelist:[],
				introducedatelist:[],
				ruleIntroductiondatelist:[],
				
				disabled: false,

				active: 0,
				dynamicTags: [],
				inputVisible: false,
				inputValue: '',

				tags: [],
				// 总数据
				tableData: [],
				//课时数据
				hourTableData: [],
				//价格数据
				priceTableData: [],
				// 默认显示第几页
				currentPage: 1,
				// 总条数，根据接口获取数据长度(注意：这里不能为空)
				totalCount: 0,
				// 个数选择器（可修改）
				pageSizes: [10, 20, 50, 100],
				// 默认每页显示的条数（可修改）
				PageSize: 10,
				//修改框体默认状态
				editVisible: false,
				//删除框体默认状态
				delVisible: false,
				//删除课时框体状态
				delHourVisible: false,
				//新增\修改课时窗体状态
				editHourVisible: false,
				//步骤名
				nextTitle: "下一步",

				courseNameTitle: '',
				//地理位置集合
				siteTypeOptions: [],
				//辅助元素定位
				idx: -1,
				//标签集合
				tagOptions: [],
				//类型集合
				typeOptions: [],
				//课时框的默认状态
				hourVisible: false,
				//价格框的默认状态
				priceVisible: false,
				show: '',
				//提交表单
				form: {},
				hourForm: {},
				priceForm: [],
				count: 0,
				//课时检测规则
				hourRules: {
					className: [{
						required: true,
						message: '请输入课时名称',
						trigger: 'blur'
					}],
				},

				priceRules: {
					coursePriceName: [{
						required: true,
						message: '请输入营名称',
						trigger: 'blur'
					}],
					classNumberPrice: [{
						required: true,
						message: '开班每课时价格',
						trigger: 'blur'
					}],
					personNumber: [{
						required: true,
						message: '请输入每人价格',
						trigger: 'blur'
					}],
					openNumber: [{
						required: true,
						message: '请输入开班人数',
						trigger: 'blur'
					}],
					fullNumber: [{
						required: true,
						message: '请输入满员人数',
						trigger: 'blur'
					}],
				},

				hourCount: 0,

				//检测规则
				rules: {
					courseName: [{
						required: true,
						message: '请输入课程名称',
						trigger: 'blur'
					}],
					describe: [{
						required: true,
						message: '请输入描述',
						trigger: 'blur'
					}],
					siteType: [{
						required: true,
						message: '请选择一个地点类型',
						trigger: 'change'
					}],
					thumbnailPic: [{
						required: true,
						message: '请选择缩略图',
						trigger: 'blur'
					}],
					introducePic: [{
						required: true,
						message: '请选择介绍图',
						trigger: 'blur'
					}],
					studentsSex: [{
						required: true,
						message: '请输入适合年龄',
						trigger: 'blur'
					}],
					frequency: [{
						required: true,
						message: '请输入训练频次',
						trigger: 'blur'
					}],
					introduce: [{
						required: true,
						message: '请选择课程介绍图片',
						trigger: 'blur'
					}],
					classNumber: [{
						required: true,
						message: '请输入课时数',
						trigger: 'blur'
					}],
					label: [{
						required: true,
						message: '请输入标签',
						trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '请输入类型',
						trigger: 'change'
					}],
					ruleIntroduction: [{
						required: true,
						message: '请选择规则介绍图片',
						trigger: 'blur'
					}]
				}
			};
		},
		created() {
			this.getData();
			this.getOptions(2);
			this.getOptions(3);
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

			/* 图片上传 */
			onUpLoadError() {
				this.$message('出现错误，请重新尝试');
			},
			imgsuccess1(url) {
				this.$message('上传成功');
				this.form.thumbnailPic = url;
			},
			imgsuccess2(url) {
				this.$message('上传成功');
				this.form.introducePic = url;
			},
			imgsuccess3(url) {
				this.$message('上传成功');
				this.form.introduce = url;
			},
			imgsuccess4(url) {
				this.$message('上传成功');
				this.form.ruleIntroduction = url;
			},
			imgRemove1() {
				this.$message('删除成功');
			},
			imgRemove2() {
				this.$message('删除成功');
			},
			imgRemove3() {
				this.$message('删除成功');
			},
			imgRemove4() {
				this.$message('删除成功');
			},

			formatupDate(row) {
				let time = new Date(row.updateTime);
				if(time.getFullYear()<2020){
					time = new Date(row.createTime);
				}
				
				return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},

			formatDate(row) {
				let time = new Date(row.createTime);
				return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},

			formaPriceDate(row) {
				let time = new Date(row.createTime);
				return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + " " + time.getHours() + ":" + time
					.getMinutes() + ":" + time.getSeconds();
			},

			//上一步命名冲突
			bac() {
				if (this.active-- <= 0) this.active = 0;
			},

			//下一步命名冲突
			nex() {
				this.active++;
				if (this.tagOptions == "" || this.tagOptions == null) {
					this.getOptions(1);
				}
				if (this.siteTypeOptions == "" || this.siteTypeOptions == null) {
					this.getOptions(2);
				}
				if (this.typeOptions == "" || this.typeOptions == null) {
					this.getOptions(3);
				}
			},
			//追加tag
			addtag(tag) {
				if (this.tags.indexOf(tag) < 0) {
					this.tags.splice(0, 0, tag);
				}
			},
			//清除单个tag
			tagClose(tag) {
				this.tags.splice(this.tags.indexOf(tag), 1);
			},

			handleClose(tag) {
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
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

			// 获取 easy-mock 的模拟数据
			getData() {
				// 开发环境使用 easy-mock 数据，正式环境使用 json 文件
				this.loading = true;
				this.$axios
					.post('/course/queryCourse', {
						pageNo: this.currentPage,
						pageSize: this.PageSize,
						courseName: this.courseNameTitle
					})
					.then(res => {
						this.tableData = res.data.records;
						this.totalCount = res.data.total;
						this.loading = false;
					});
			},
			//获取字典数据
			getOptions(kid) {
				switch (kid) {
					case 1:
						this.$axios.post('/diction/queryValue', {
							kId: kid
						}).then(res => {
							this.dynamicTags = res.data;
						});
						break;
					case 2:
						this.$axios.post('/diction/queryValue', {
							kId: kid
						}).then(res => {
							this.siteTypeOptions = res.data;
						});
						break;
					case 3:
						this.$axios.post('/diction/queryValue', {
							kId: kid
						}).then(res => {
							this.typeOptions = res.data;
						});
						break;
				}
			},
			search() {
				this.getData();
			},
			//点击添加框
			add() {
				//清空数据
				this.thumbnailPicdatelist = [];
				this.introducePicdatelist = [];
				this.introducedatelist = [];
				this.ruleIntroductiondatelist = [];
				this.form = {};
				this.active = 0;
				this.tags = [];
				this.editVisible = true;
			},
			addHour() {
				this.form = {};
				this.editHourVisible = true;
			},

			addPrice() {
				this.form = {};
				this.editPriceVisible = true;
			},
			//新增\更新价格信息
			savePriceEdit() {
				this.$refs.courseform.validate(valid => {
					if (valid) {
						/* 添加 */
						const priceitem = this.form;
						if (this.form.id == '' || this.form.id == null) {
							this.form = {
								courseId: this.priceForm,
								coursePriceName: priceitem.coursePriceName,
								classNumberPrice: priceitem.classNumberPrice,
								personNumber: priceitem.personNumber,
								openNumber: priceitem.openNumber,
								fullNumber: priceitem.fullNumber
							};
							let fd = JSON.parse(JSON.stringify(this.form));
							delete fd.id;
							this.loading = true;
							this.$axios.post('/price/add', fd).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									this.loading = false;
									return;
								}
								this.$message.success(`操作成功`);
								this.getPriceData(this.form.courseId);
								this.form = {};
								this.editPriceVisible = false;
							});
							this.loading = false;
						} else {
							/* 更新 */
							this.form = {
								id: priceitem.id,
								courseId: this.priceForm,
								coursePriceName: priceitem.coursePriceName,
								classNumberPrice: priceitem.classNumberPrice,
								personNumber: priceitem.personNumber,
								openNumber: priceitem.openNumber,
								fullNumber: priceitem.fullNumber
							};
							this.loading = true;
							this.$axios.post('/price/update', this.form).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									this.loading = false;
									return;
								}
								this.$message.success(`操作成功`);
								this.form = {};
								this.getPriceData(this.priceTableData[0].courseId);
								this.editPriceVisible = false;
							});
							this.loading = false;
						}
						this.active = 0;
					} else {
						console.error('error submit!!');
						return false;
					}
				});
			},

			saveHourEdit() {
				this.$refs.courseform.validate(valid => {
					if (valid) {
						/* 添加 */
						const houritem = this.form;
						if (this.form.id == '' || this.form.id == null) {
							this.form = {
								courseId: this.hourForm,
								className: houritem.className,
								sort: houritem.sort
							};
							let fd = JSON.parse(JSON.stringify(this.form));
							delete fd.id;
							this.loading = true;
							this.$axios.post('/classNumber/add', fd).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									this.loading = false;
									return;
								}
								
								this.$message.success(`操作成功`);
								this.getHoursData(this.form.courseId);
								this.form = {};
								this.editHourVisible = false;
								this.loading = false;
							});
						} else {
							/* 更新 */
							this.form = {
								id: houritem.id,
								className: houritem.className,
								sort: houritem.sort
							};
							this.loading = true;
							this.$axios.post('/classNumber/update', this.form).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									this.loading = false;
									return;
								}
								this.$message.success(`操作成功`);
								this.form = {};
								this.getHoursData(this.hourTableData[0].courseId);
								this.editHourVisible = false;
								this.loading = false;
							});
						}
						this.active = 0;
					} else {
						console.error('error submit!!');
						return false;
					}
				});
			},
			//弹出删除框
			del() {
				this.delVisible = true;
			},
			getPriceData(cid) {
				this.loading = true;
				this.$axios
					.post('/price/query', {
						courseId: cid
					})
					.then(res => {
						this.priceTableData = res.data.records;
						this.loading = false;
					});
					this.loading = false;
			},

			getHoursData(cid) {
				this.loading = true;
				this.$axios
					.post('/classNumber/query', {
						courseId: cid
					})
					.then(res => {
						this.hourTableData = res.data.records;
						this.Count = res.data.total;
						this.Count >= this.hourCount ? this.disabled = true : this.disabled = false;
					});
					this.loading = false;
			},


			//定位修改价格的元素
			handlePrice(index, row) {
				this.priceForm = row.id;
				this.getPriceData(row.id);
				this.priceVisible = true;

			},


			//定位修改课时的元素
			handleHour(index, row) {
				this.hourCount = row.classNumber;
				this.hourForm = row.id;
				this.getHoursData(row.id);
				this.hourVisible = true;
			},
			
			handleHourDelete(index, row) {
				this.form = row;
				this.idx = index;
				this.delHourVisible = true;
			},
			//控制开启修改课时
			handleEditHour(index, row) {
				this.form = row;
				this.idx = index;
				this.editHourVisible = true;
			},
			//控制开启修改价格
			handleEditPrice(index,row){
				this.form = row;
				this.idx = index;
				this.editPriceVisible = true;
			},
			handlePriceDelete(index,row){
				this.form = row;
				this.idx = index;
				this.delPriceVisible = true;
			},
			
			//定位修改的元素
			handleEdit(index, row) {
				this.form = {};
				this.thumbnailPicdatelist = [];
				this.thumbnailPicdatelist.push({name:row.thumbnailPic,url:row.thumbnailPic});
				this.introducePicdatelist = [];
				this.introducePicdatelist.push({name:row.introducePic,url:row.introducePic});
				this.introducedatelist = [];
				this.introducedatelist.push({name:row.introduce,url:row.introduce});
				this.ruleIntroductiondatelist = [];
				this.ruleIntroductiondatelist.push({name:row.ruleIntroduction,url:row.ruleIntroduction});
				this.active = 0;
				this.tags = [];
				this.show = false;
				this.idx = index;
				const item = this.tableData[index];

				this.form = {
					id: row.id,
					courseName: item.courseName,
					describe: item.describe,
					siteType: item.siteType,
					thumbnailPic: item.thumbnailPic,
					introducePic: item.introducePic,
					studentsSex: item.studentsSex,
					frequency: item.frequency,
					introduce: item.introduce,
					classNumber: item.classNumber,
					label: item.label,
					type: item.type,
					ruleIntroduction: item.ruleIntroduction
				};
				var labelStr = this.form.label;
				//字符串截取为数组
				this.tags = labelStr.split(",");
				
				this.editVisible = true;
			},
			/* 定位删除的元素 */
			handleDelete(index, row) {
				this.form = row;
				this.idx = index;
				this.delVisible = true;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			saveEdit(formName) {
				this.form.label = this.tags.toString();
				/* 添加校验 */
				this.$refs.courseform.validate(valid => {
					if (valid) {
						/* 添加 */
						if (this.form.id == '' || this.form.id == null) {
							let fd = JSON.parse(JSON.stringify(this.form));
							delete fd.id;
							this.loading = true;
							this.$axios.post('/course/addCourse', fd).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									this.loading = false;
									return;
								}
								this.$message.success(`操作成功`);
								this.tags = [];
								this.active = 0;
								this.form = {};
								this.getData();
								this.editVisible = false;
							});
							this.loading = false;
						} else {
							/* 更新 */
							this.loading = true;
							this.$axios.post('/course/updCourse', this.form).then(res => {
								if (!res.success) {
									this.$message.success(res.errMsg);
									this.loading = false;
									return;
								}
								this.$message.success(`操作成功`);
								this.tags = [];
								this.active = 0;
								this.form = {};
								this.getData();
								this.editVisible = false;
							});
							this.loading = false;
						}
						this.active = 0;
					} else {
						console.error('error submit!!');
						return false;
					}
				});
			},

			// 确定删除课程
			deleteRow() {
				var id = this.form.id;
				this.loading = true;
				this.$axios.post('/course/delCourse', {
					id: id
				}).then(res => {
					if (!res.success) {
						this.$message.success(res.errMsg);
						this.loading = false;
						return;
					}
					this.tableData.splice(this.idx, 1);
					this.$message.success('删除成功');
					this.delVisible = false;
				});
				this.loading = false;
			},
			//确定删除课时
			deleteHour() {
				var id = this.form.id;
				this.loading = true;
				this.$axios.post('/classNumber/delete', {
					id: id
				}).then(res => {
					if (!res.success) {
						this.$message.success(res.errMsg);
						this.loading = false;
						return;
					}
					this.hourTableData.splice(this.idx, 1);
					this.$message.success('删除成功');
					this.form = {};
					this.idx = "";
					this.delHourVisible = false;
				});
				this.loading = false;
			},
			//确定删除价格
			deletePrice() {
				var id = this.form.id;
				this.loading = true;
				this.$axios.post('/price/delete', {
					id: id
				}).then(res => {
					if (!res.success) {
						this.$message.success(res.errMsg);
						return;
					}
					this.priceTableData.splice(this.idx, 1);
					this.$message.success('删除成功');
					this.form = {};
					this.idx = "";
					this.delPriceVisible = false;
				});
				this.loading = false;
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
