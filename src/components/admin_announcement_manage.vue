<template>
	<div class="admin-announcement-manage">
		<template v-if="index == 0">
			<table class="table" >
				<thead>
					<tr>
						<th>#</th>
						<th>标题</th>
						<th>发布时间</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in announcements">
						<td>{{ index + 1 }}</td>
						<td>{{ item.announcement_title }}</td>
						<td>{{ item.announcement_date | getDate }}</td>
						<td  :id="item._id">
							<button class="btn btn-info" data-toggle="modal" data-target="#announcementDetail" @click="transferAnnouncement($event)">查看</button>
							<button class="btn btn-danger" @click="deleteOne">删除</button>
						</td>
					</tr>
				</tbody>
			</table>			
		</template>
		
		<publish-new-announcement v-else-if="index == 1" v-on:publish="reInit"></publish-new-announcement>
		<check-announcement-modal></check-announcement-modal>
		
	</div>
</template>
<script>
	import checkAnnouncementModal from './admin_check_Announcement_modal.vue'
	import publishNewAnnouncement from './admin_publish_announcement.vue'
	import bus from '../bus.js'

	export default {
		data () {
			return {
				announcements: [],
				index: 0,
				page: 1,
			}
		},
		mounted() {
			this.init();
			bus.$on('switchIndex', val => {
				this.index = val;
				console.log(val)
			})
		},
		methods: {
			init() {
				let that = this;
				$.get('http://localhost:3001/apis/getAnnouncements', {
					count: 5,
					page: that.page
				}).then(data => {
					console.log(data)
					that.announcements = data
				})
			},	// init end

			// 确认删除
			deleteOne(event) {
				let result = confirm('确认删除？');
				if (result) {
					let that = this;
					$.post('http://localhost:3001/apis/admin/delAnnouncement', {
						id: $(event.target).parent().prop('id')
					}).then(data => {
						if (data.status == 'success') {
							alert('删除成功');
							that.init();
						}
					})
				}
			},	// deleteOne end

			// 传送 公告 id
			transferAnnouncement(ev) {
				bus.$emit('transferAnnouncementId', $(ev.target).parent().prop('id'))
			},

			// 重新初始化
			reInit() {
				this.index = 0;
				this.init();
			}
		},
		destroyed() {
			bus.$off('switchIndex');
		},
		components: {
			checkAnnouncementModal,
			publishNewAnnouncement
		}
	}
</script>