#!/usr/bin/env bash
set -e

GREEN='\033[0;32m'
NC='\033[0m'
# Multi-Stage baby 8-)

SCRIPT_PATH=$(dirname "$0")
VERSION=$(npm run --silent version)
IMAGE_NAME=retaily/web-app
RELEASE_NAME=$IMAGE_NAME:$VERSION
# REGISTRY_IMAGE_NAME=gcr.io/docker-registry-xxxxxx/$RELEASE_NAME

for i in "$@"
do
    case $i in
    -b|--build)
        BUILD_IMAGE=true
        shift
        ;;
    -p|--push-to-registry)
        PUSH_TO_REGISTRY=true
        shift
        ;;
    esac
done

echo "version: $VERSION"

if [ -n "$BUILD_IMAGE" ]
then
  # Build
  echo -e "${GREEN}[Building image]${NC} ${RELEASE_NAME}"
  docker build -t "$RELEASE_NAME" .
  docker tag "$RELEASE_NAME" "$IMAGE_NAME:latest"
  # Delete the ones that has <none> repository name
  #if [[ "$(docker images -f 'dangling=true' -q 2> /dev/null)" != "" ]]; then
    # shellcheck disable=SC2046
    # docker rmi $(docker images -f 'dangling=true' -q)
  #fi
fi

if [ -n "$PUSH_TO_REGISTRY" ]
then
  echo -e "Are you sure you want to push ${REGISTRY_IMAGE_NAME}?"
  read -p "Y/n > " -n 1 -r
  echo    # (optional) move to a new line
  if [[ ! $REPLY =~ ^[Yy]$ ]]
  then
      # shellcheck disable=SC2128
      [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
  fi
  echo -e "${GREEN}[Pushing to docker artifactory]${NC} ${REGISTRY_IMAGE_NAME}"
  docker push "$REGISTRY_IMAGE_NAME"
fi
