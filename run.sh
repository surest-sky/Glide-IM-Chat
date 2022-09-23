#!/bin/bash

if [ "$1" = "build" ]
then {
  if [ "$2" = "pc" ]; then
      npm run build
      tar -cJvf pc.tar.xz build
      echo "编译完成 PC"
      exit 1
  fi

  if [ "$2" == "mobile" ]; then
      npm run build:mobile
      tar -cJvf mobile.tar.xz build
      echo "编译完成 Mobile"
      exit 1
  fi

  echo "未找到需要编译的服务"
  exit 1
}
fi

if [ "$1" == "deploy" ]
then {
  if [ "$2" == "pc" ]; then
      rm -rf ./pc
      mkdir -p ./build/pc && tar -xzvf pc.tar.xz -C ./run/pc --strip-components 1
      echo "部署成功 PC"
      exit 1
  fi

  if [ "$2" == "mobile" ]; then
      rm -rf ./mobile
      mkdir -p ./build/mobile && tar -xzvf mobile.tar.xz -C ./run/mobile --strip-components 1
      echo "部署成功 MOBILE"
      exit 1
  fi
  echo "未找到需要部署的服务"
  exit 1
}
fi

if [ "$1" == "push" ]
then {
  sh run.sh build pc
  sh run.sh build mobile
  rm -rf build
  git status
  git add -A
  git commit -m "$2"
  exit 1
}
fi

echo ">>> 未能处理成功"