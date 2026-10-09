# Static export served by a dependency-free Node server on port 3000.
# Works on Coolify or any container host.
#   docker build -t sterling-demo .
#   docker run -p 3000:3000 sterling-demo
# Set the public URL: --build-arg NEXT_PUBLIC_SITE_URL=https://demo.example.com
# For a sub-path deploy: --build-arg NEXT_PUBLIC_BASE_PATH=/hai-demo-sterling-steak-park-city

FROM node:22-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_BASE_PATH=""
ARG NEXT_PUBLIC_SITE_URL=""
ARG NEXT_PUBLIC_SITE_ORIGIN="https://haiconsulting.github.io"
ARG NEXT_PUBLIC_DEMO_MODE="true"
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_SITE_ORIGIN=$NEXT_PUBLIC_SITE_ORIGIN \
    NEXT_PUBLIC_DEMO_MODE=$NEXT_PUBLIC_DEMO_MODE \
    NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ARG NEXT_PUBLIC_BASE_PATH=""
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH
COPY --from=build /app/out ./out
COPY --from=build /app/scripts/serve-pages.mjs ./scripts/serve-pages.mjs
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- "http://127.0.0.1:3000${NEXT_PUBLIC_BASE_PATH}/" >/dev/null || exit 1
CMD ["node", "scripts/serve-pages.mjs"]
