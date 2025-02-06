<script setup lang="ts">
import * as THREE from "three";
import draggable from "vuedraggable";

type List = { no: number; name: string; categoryNo: string };

const _camera = ref(new THREE.PerspectiveCamera());

const width = 960;
const height = 540;
const putElement = ref();
// const renderer = ref(new THREE.WebGLRenderer({
//     canvas: putElement.value
//   }))
onMounted(() => {
	const container = putElement.value;
	init();
});

function init() {
	const renderer = new THREE.WebGLRenderer({
		canvas: putElement.value,
	});
	renderer.setSize(width, height);
	const scene = new THREE.Scene();

	_camera.value = new THREE.PerspectiveCamera(45, width / height);
	_camera.value.position.set(0, 40, +1000);

	const group = new THREE.Group();
	scene.add(group);

	for (let index = 0; index < 100; index++) {
		const geo = new THREE.BoxGeometry(10, 10, 100);
		const mater = new THREE.MeshNormalMaterial();
		const mesh = new THREE.Mesh(geo, mater);
		const radian = (index / 10) * Math.PI * 2;
		mesh.position.set(200 * Math.cos(radian), 30, 200 * Math.sin(radian));
		group.add(mesh);
	}

	// const geo = new THREE.BoxGeometry(100,100,100)
	// const mater = new THREE.MeshNormalMaterial()

	// const box = new THREE.Mesh(geo, mater)
	// scene.add(box)
	// box.position.x = 100
	// box.position.y = 100
	// scene.add(box)

	tick();
	function tick() {
		//   box.rotation.y += 0.01
		//   box.rotation.x += 0.01

		//   box.position.x += 0.1
		//   box.position.y += 0.01
		// group.rotation.y += 0.01;
		// group.rotation.x += 0.01;
		renderer.render(scene, _camera.value);
		requestAnimationFrame(tick);
	}
}

function moveCamera() {
	_camera.value.position.set(0, 250, +600);
	_camera.value.rotation.x = -0.4;
}

const list = ref([
	{ no: 1, name: "キャベツ", categoryNo: "1" },
	{ no: 2, name: "ステーキ", categoryNo: "2" },
	{ no: 3, name: "リンゴ01", categoryNo: "3" },
	{ no: 4, name: "リンゴ02", categoryNo: "4" },
	{ no: 5, name: "リンゴ03", categoryNo: "5" },
]);

const onEnd = (info: { newIndex: number }) => {
	let setItem: { no: number; name: string; categoryNo: string } = {
		no: 1,
		name: "",
		categoryNo: "",
	};
	const reList = list.value.filter((item: List, index: number) => {
		if (index === info.newIndex) {
			setItem = item;
		}
		return index !== info.newIndex;
	});
	reList.splice(info.newIndex, 0, setItem);
	list.value = reList; //.splice(0,0,setItem);
};
</script>

<template>
  <div>
    content Content3d
    <canvas class="put-element" ref="putElement"></canvas>
    <div class="control-box">
      <button @click="moveCamera">camera</button>
    </div>
    <draggable v-model="list" item-key="no" tag="ul" @end="onEnd">
      <template #item="{element, index}"  >
        <li>{{ element.name }}</li>
      </template>
    </draggable>

  </div>
</template>

<style scoped>
li {
  cursor: pointer;
  padding: 10px;
  border: solid #ddd 1px;
}
</style>
