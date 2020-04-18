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
</style>
