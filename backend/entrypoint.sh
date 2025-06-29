#!/bin/bash
set -e

# Remover el archivo PID del servidor si existe
if [ -f /rails/tmp/pids/server.pid ]; then
  echo "Removing stale server.pid file..."
  rm /rails/tmp/pids/server.pid
fi

# Ejecutar el comando original
exec "$@"