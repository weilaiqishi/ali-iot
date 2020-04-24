<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
.one {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.wB {
  position: relative;
  box-sizing: border-box;
  width: 100%;
}
.hB {
  position: relative;
  box-sizing: border-box;
  height: 100%;
}
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.centerX {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.textCenterX {
  text-align: center;
}

::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; 
  height: 8px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #99a9bf;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(184, 184, 184, 0.2);
  border-radius: 10px;
  background: #ffffff;
}
</style>
