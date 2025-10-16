import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return defineConfig({
        plugins: [react()],
        server: {
            host: true,
            port: 5173,
            watch: {
                usePolling: true,
            },
        },
        define: {
            'import.meta.env': env,
        },
    })
}

