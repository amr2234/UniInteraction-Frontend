
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
        'figma:asset/feafe15647caf57cbb0488bb53100be4d28ef084.png': path.resolve(__dirname, './src/assets/feafe15647caf57cbb0488bb53100be4d28ef084.png'),
        'figma:asset/802db0b48560c5badd46cac8a1c7bd47bcf8760d.png': path.resolve(__dirname, './src/assets/802db0b48560c5badd46cac8a1c7bd47bcf8760d.png'),
        'figma:asset/3ed7ad000b3c6c19b182fbe3a9d4158789dc4548.png': path.resolve(__dirname, './src/assets/3ed7ad000b3c6c19b182fbe3a9d4158789dc4548.png'),
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
      // Enable minification and compression
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.logs in production
          drop_debugger: true,
          passes: 1, // Single pass to avoid over-optimization
        },
        mangle: {
          safari10: true, // Fix Safari 10+ issues
        },
        format: {
          comments: false, // Remove comments
        },
      },
      rollupOptions: {
        output: {
          // Optimize chunk splitting for better caching
          manualChunks: (id) => {
            // Core React libraries
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('react-router')) {
                return 'router-vendor';
              }
              // UI components library - split by radix-ui
              if (id.includes('@radix-ui')) {
                return 'ui-vendor';
              }
              // Form and validation libraries
              if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
                return 'form-vendor';
              }
              // Data fetching and state management
              if (id.includes('@tanstack/react-query')) {
                return 'query-vendor';
              }
              // Charts and visualization
              if (id.includes('recharts')) {
                return 'chart-vendor';
              }
              // Date utilities
              if (id.includes('date-fns')) {
                return 'date-vendor';
              }
              // SignalR for real-time
              if (id.includes('@microsoft/signalr')) {
                return 'signalr-vendor';
              }
              // Lucide icons
              if (id.includes('lucide-react')) {
                return 'icons-vendor';
              }
              // Other utilities (clsx, tailwind-merge)
              if (id.includes('clsx') || id.includes('tailwind-merge')) {
                return 'utils-vendor';
              }
              // Don't create catch-all vendor chunk - let Vite handle remaining deps
            }
              
            // Split large feature modules
            if (id.includes('src/features/requests')) {
              return 'requests-feature';
            }
            if (id.includes('src/features/admin')) {
              return 'admin-feature';
            }
            if (id.includes('src/features/dashboard')) {
              return 'dashboard-feature';
            }
          },
          // Optimize chunk file names
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 1000,
      // Enable source maps for production debugging (optional, disable for smaller build)
      sourcemap: false,
    },
    server: {
      port: 3000,
      open: true,
      // Enable compression for faster dev server
      middlewareMode: false,
      // Optimize dependencies pre-bundling
      hmr: {
        overlay: true,
      },
    },
    // Optimize dependency pre-bundling
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
      ],
      exclude: [],
    },
  });