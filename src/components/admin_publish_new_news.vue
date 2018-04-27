<template>
	<div class="publish-new-news">
		<form class="form-horizontal">
			<div class="form-group">
				<label for="title" class="control-label col-md-2">文章标题</label>
				<div class="col-md-6">
					<input type="text" class="form-control" id="news_title" placeholder="文章标题">
				</div>
			</div>
			<div class="form-group">
				<label for="content" class="control-label col-md-2">文章类别</label>
				<div class="col-md-6">
					新闻&nbsp;&nbsp;<input type="radio" name="category" value="news" checked>
					热门资讯&nbsp;&nbsp;<input type="radio" name="category" value="hotNews">
				</div>
			</div>
			<div class="form-group">
				<label for="content" class="control-label col-md-2">内容</label>
				<div class="col-md-6">
					<textarea class="form-control" id="news_content"></textarea>
				</div>
			</div>
			<div class="form-group">
				<div class="col-md-offset-7">
					<input type="reset" class="btn reset" value="清空">
					<button class="btn btn-primary" @click="publish">提交</button>
				</div>
			</div>
		</form>
	</div>
</template>
<script>
	export default {
		methods: {
			publish() {
				let result = confirm('确认发表？');
				if (result) {
					let title = $("#news_title").val().trim();
					let category = $("[name='category']:checked").val();
					let content = $("#news_content").val().trim();

					if (title == '' || content == '') {
						alert('请输入标题或内容')
						return
					} else {
						$.post('http://localhost:3001/apis/admin/publishNews', {
							news_title: title,
							news_category: category,
							news_text: content
						}).then(data => {
							if (data.status == 'success') {
								alert("发表成功！");
								this.$emit('publish');
							}
						})
					}
				}
			},
		}
	}
</script>
<style scoped>
	textarea {
		height: 478px;
		resize: vertical;
	}
</style>