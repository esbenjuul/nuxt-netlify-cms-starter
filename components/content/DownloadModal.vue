<template>
	<div class="download-modal">
		<span class="icon">
			<img src="/img/smiley-bw.png" />
		</span>
		<div>
			<p>
				Collect your digital goodiebag!
			</p>
			<a :href="path" download>Download</a>
		</div>
	</div>
</template>

<script>
export default {
	name: 'download-modal',
	data: () => ({ path: '/files/GANNI_digital_goodiebag.zip' })
}
</script>