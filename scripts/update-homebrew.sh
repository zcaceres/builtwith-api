#!/usr/bin/env bash
set -euo pipefail

# Update the Homebrew formula in zcaceres/homebrew-tap for the current version.
# Usage: ./scripts/update-homebrew.sh [version]
#   version: e.g. "3.2.1" (defaults to version in packages/builtwith-api/package.json)

REPO="zcaceres/homebrew-tap"
FORMULA_PATH="Formula/builtwith.rb"
RELEASE_BASE="https://github.com/zcaceres/builtwith-api/releases/download"

# Resolve version
if [[ -n "${1:-}" ]]; then
  VERSION="$1"
else
  VERSION=$(grep '"version"' packages/builtwith-api/package.json | head -1 | sed 's/.*"\([0-9][^"]*\)".*/\1/')
fi

echo "Updating Homebrew formula to v${VERSION}..."

# Download binaries and compute SHA256 hashes
echo "Computing SHA256 hashes..."
SHA_DARWIN_ARM64=$(curl -sL "${RELEASE_BASE}/v${VERSION}/builtwith-darwin-arm64" | shasum -a 256 | awk '{print $1}')
SHA_DARWIN_X64=$(curl -sL "${RELEASE_BASE}/v${VERSION}/builtwith-darwin-x64" | shasum -a 256 | awk '{print $1}')
SHA_LINUX_ARM64=$(curl -sL "${RELEASE_BASE}/v${VERSION}/builtwith-linux-arm64" | shasum -a 256 | awk '{print $1}')
SHA_LINUX_X64=$(curl -sL "${RELEASE_BASE}/v${VERSION}/builtwith-linux-x64" | shasum -a 256 | awk '{print $1}')

echo "  darwin-arm64: ${SHA_DARWIN_ARM64}"
echo "  darwin-x64:   ${SHA_DARWIN_X64}"
echo "  linux-arm64:  ${SHA_LINUX_ARM64}"
echo "  linux-x64:    ${SHA_LINUX_X64}"

# Generate formula
FORMULA=$(cat <<RUBY
class Builtwith < Formula
  desc "Query the BuiltWith API from your app, terminal, or AI agent"
  homepage "https://builtwith.zach.dev"
  license "MIT"
  version "${VERSION}"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/zcaceres/builtwith-api/releases/download/v#{version}/builtwith-darwin-arm64"
      sha256 "${SHA_DARWIN_ARM64}"
    else
      url "https://github.com/zcaceres/builtwith-api/releases/download/v#{version}/builtwith-darwin-x64"
      sha256 "${SHA_DARWIN_X64}"
    end
  end

  on_linux do
    if Hardware::CPU.arm?
      url "https://github.com/zcaceres/builtwith-api/releases/download/v#{version}/builtwith-linux-arm64"
      sha256 "${SHA_LINUX_ARM64}"
    else
      url "https://github.com/zcaceres/builtwith-api/releases/download/v#{version}/builtwith-linux-x64"
      sha256 "${SHA_LINUX_X64}"
    end
  end

  def install
    binary = Dir.glob("builtwith-*").first
    bin.install binary => "builtwith"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/builtwith --version")
  end
end
RUBY
)

# Get current file SHA from GitHub
FILE_SHA=$(gh api "repos/${REPO}/contents/${FORMULA_PATH}" --jq '.sha')

# Push update
ENCODED=$(echo -n "${FORMULA}" | base64)
COMMIT_URL=$(gh api "repos/${REPO}/contents/${FORMULA_PATH}" \
  --method PUT \
  --field message="builtwith ${VERSION}" \
  --field content="${ENCODED}" \
  --field sha="${FILE_SHA}" \
  --jq '.commit.html_url')

echo "Updated: ${COMMIT_URL}"
