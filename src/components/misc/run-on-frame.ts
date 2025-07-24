import { onMounted, onUnmounted } from "vue";

export function runOnFrame(action: () => void | boolean) {
    let quit = false;

    onMounted(() => {
        function run() {
            if (quit) return;
            let result = action();
            if (!result) requestAnimationFrame(run);
        }

        run();
    });

    onUnmounted(() => { quit = true; });
}