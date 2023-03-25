#! /bin/sh

set -e

# Clean up the previous build.
rm -rf .vercel

# Copy static files.
npm run build
mkdir -p .vercel/output
cp -r dist .vercel/output/static

# Generate the config file.
cat > .vercel/output/config.json <<EOF
{
  "version": 3
}
EOF

# Copy serverless functions.
cd service && pnpm install && npm run build && cd ..
functions_path=".vercel/output/functions/api"
mkdir -p $functions_path
cp -r service/build "$functions_path/chat-process.func"
cat > "$functions_path/chat-process.func/.vc-config.json" <<EOF
{
  "runtime": "nodejs18.x",
  "handler": "index.mjs",
  "launcherType": "Nodejs",
  "shouldAddHelpers": true
}
EOF

# Now, use $functions_path as working directory.
cd $functions_path

# Install extra dependencies.
# This is a workaround for the issue that rollup build cannot resolve the
# WASM module and browser crypto library.
cat > chat-process.func/package.json <<EOF
{
  "private": true,
  "dependencies": {
    "@dqbd/tiktoken": "^1.0.2",
    "uuid": "^9.0.0"
  }
}
EOF
cd chat-process.func && pnpm install && cd ..

# Other serverless functions are the alias of the chat-process function.
ln -s chat-process.func config.func
ln -s chat-process.func session.func
ln -s chat-process.func verify.func
