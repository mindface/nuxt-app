<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { socket } from "../utils/socket";

const isConnected = ref(false);
const transport = ref("N/A");

if (socket.connected) {
	onConnect();
}

function onConnect() {
	isConnected.value = true;
	transport.value = socket.io.engine.transport.name;
	socket.io.engine.on("upgrade", (rawTransport) => {
		transport.value = rawTransport.name;
	});
}

function onDisconnect() {
	isConnected.value = false;
	transport.value = "N/A";
}

socket.on("connect", onConnect);
socket.on("sampleUpdate", (data: { id: string; lastUpdate: number }) => {
	// コンポーネント側の処理
});

socket.on("deviceDisconnected", (deviceId: string) => {
	// 接続が切断された時の処理
});
socket.on("disconnect", onDisconnect);

onBeforeUnmount(() => {
	socket.off("connect", onConnect);
	socket.off("disconnect", onDisconnect);
});
</script>

<template>
  <div>
    <p>Status: {{ isConnected ? "connected" : "disconnected" }}</p>
    <p>Transport: {{ transport }}</p>
  </div>
</template>