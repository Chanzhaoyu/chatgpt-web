import type { App } from 'vue'
import { useUserStore } from '@/store'
import doreamon from '@zodash/doreamon'

export async function setupDoreamon(app: App) {
  // setup user
  const userStore = useUserStore();
  await userStore.setupUserInfo();

  // setup on page show => user login
  doreamon.dom.page.onPageShow(async () => {
    const response = await fetch('/api/user');
    if (response.status === 401) {
      const rootSelector = document.querySelector('#app');

      rootSelector!.innerHTML = `
<style>
.loading-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.balls {
  width: 4em;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
}

.balls div {
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  background-color: #4b9e5f;
}

.balls div:nth-of-type(1) {
  transform: translateX(-100%);
  animation: left-swing 0.5s ease-in alternate infinite;
}

.balls div:nth-of-type(3) {
  transform: translateX(-95%);
  animation: right-swing 0.5s ease-out alternate infinite;
}

@keyframes left-swing {

  50%,
  100% {
    transform: translateX(95%);
  }
}

@keyframes right-swing {
  50% {
    transform: translateX(-95%);
  }

  100% {
    transform: translateX(100%);
  }
}

@media (prefers-color-scheme: dark) {
  body {
    background: #121212;
  }
}
</style>
<div class="loading-wrap">
<div class="balls">
  <div></div>
  <div></div>
  <div></div>
</div>
</div>`;

      await doreamon.delay(300);

      window.location.reload();
    }
  })
}
