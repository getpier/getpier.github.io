#!/bin/sh
set -eu

REPO_BASE="https://github.com/Pyor-review/pier-releases/releases/latest/download"

install_macos() {
  APP="/Applications/Pyor.app"
  case "$(uname -m)" in
    arm64) DMG="Pyor-mac-arm64.dmg" ;;
    x86_64) DMG="Pyor-mac-x64.dmg" ;;
    *) echo "Unsupported architecture: $(uname -m)" >&2; exit 1 ;;
  esac

  TMP="$(mktemp -d)"
  MOUNT="$TMP/mount"
  trap 'hdiutil detach "$MOUNT" -quiet 2>/dev/null || true; rm -rf "$TMP"' EXIT

  echo "Downloading Pyor ($DMG)…"
  curl -fL --progress-bar "$REPO_BASE/$DMG" -o "$TMP/Pyor.dmg"

  echo "Mounting…"
  mkdir -p "$MOUNT"
  hdiutil attach "$TMP/Pyor.dmg" -nobrowse -quiet -mountpoint "$MOUNT"

  echo "Installing to /Applications…"
  rm -rf "$APP"
  cp -R "$MOUNT/Pyor.app" "$APP"

  xattr -dr com.apple.quarantine "$APP" 2>/dev/null || true

  echo ""
  echo "✓ Pyor installed. Opening it…"
  open -a Pyor || echo "Launch it from your Applications folder or:  open -a Pyor"
}

install_linux() {
  case "$(uname -m)" in
    x86_64|amd64) ASSET="Pyor-linux-x64.AppImage" ;;
    *) echo "Unsupported architecture: $(uname -m). Download manually from https://pyor.review/download" >&2; exit 1 ;;
  esac

  DEST_DIR="${XDG_BIN_HOME:-$HOME/.local/bin}"
  DEST="$DEST_DIR/pyor.AppImage"

  echo "Downloading Pyor ($ASSET)…"
  mkdir -p "$DEST_DIR"
  curl -fL --progress-bar "$REPO_BASE/$ASSET" -o "$DEST"
  chmod +x "$DEST"

  echo ""
  echo "✓ Pyor installed to $DEST. Opening it…"
  case ":$PATH:" in
    *":$DEST_DIR:"*) HINT="Launch it with:  pyor.AppImage" ;;
    *) HINT="Add $DEST_DIR to your PATH, or launch it with:  $DEST" ;;
  esac
  ("$DEST" >/dev/null 2>&1 &) || echo "$HINT"
}

install_windows() {
  ASSET="Pyor-win-x64.exe"
  OUT="${USERPROFILE:-$HOME}/Downloads/$ASSET"

  echo "Downloading Pyor ($ASSET)…"
  curl -fL --progress-bar "$REPO_BASE/$ASSET" -o "$OUT"

  echo ""
  echo "✓ Downloaded to $OUT. Launching the installer…"
  cmd //c start "" "$OUT" 2>/dev/null \
    || start "" "$OUT" 2>/dev/null \
    || echo "Run the installer:  \"$OUT\""
}

case "$(uname -s)" in
  Darwin) install_macos ;;
  Linux) install_linux ;;
  MINGW*|MSYS*|CYGWIN*) install_windows ;;
  *) echo "Unsupported OS: $(uname -s). Download manually from https://pyor.review/download" >&2; exit 1 ;;
esac
