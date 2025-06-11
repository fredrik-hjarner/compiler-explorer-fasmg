# Build stage
FROM node:22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    git \
    build-base \
    rsync

# Set NODE_OPTIONS for webpack
ENV NODE_OPTIONS="--max-old-space-size=3000"

# Create working directory
WORKDIR /app

# Clone fasm2 and setup fasmg
RUN git clone https://github.com/tgrysztar/fasm2.git /app/fasm2 \
    && chmod +x /app/fasm2/fasmg.x64

# Copy compiler-explorer source code
COPY . /app/compiler-explorer

# Build compiler-explorer
WORKDIR /app/compiler-explorer
RUN make prebuild

# Install only production dependencies
ENV NODE_ENV=production
RUN NODE_ENV=production npm prune --omit=dev --omit=optional

# Runtime stage
FROM node:22-slim AS runtime

# Set environment
ENV NODE_ENV=production

# Copy entire fasm2 directory (includes the include files)
COPY --from=builder /app/fasm2/ /app/fasm2/
RUN ln -s /app/fasm2/fasmg.x64 /usr/local/bin/fasmg

# Create working directory
WORKDIR /app/compiler-explorer

# Copy only runtime-needed files
COPY --from=builder /app/compiler-explorer/out/ ./out/
COPY --from=builder /app/compiler-explorer/etc/ ./etc/
COPY --from=builder /app/compiler-explorer/examples/ ./examples/
COPY --from=builder /app/compiler-explorer/views/ ./views/
COPY --from=builder /app/compiler-explorer/types/ ./types/
COPY --from=builder /app/compiler-explorer/package*.json ./
COPY --from=builder /app/compiler-explorer/node_modules/ ./node_modules/

# Expose port
EXPOSE 4567

# Start compiler-explorer
CMD ["node", "./out/dist/app.js", "--static", "./out/webpack/static", "--host", "0.0.0.0", "--port", "4567", "--language", "fasmg"]